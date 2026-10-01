from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.models import Agency, Worker, Contract
from app.dependencies import get_current_worker
from app.integrations.voxide import call_voxide_stt, call_voxide_tts
from app.schemas import (
    VoiceQueryRequest,
    VoiceQueryResponse,
    VoiceContractRequest,
    VoiceContractResponse,
    VoiceReportRequest,
    VoiceReportResponse,
)
from app.services import registry

router = APIRouter()

def _resolve_text(audio_url: str | None, text: str | None) -> str:
    if text:
        return text
    if audio_url:
        return call_voxide_stt(audio_url)
    raise HTTPException(status_code=400, detail="Must provide either text or audio_url")


@router.post("/query", response_model=VoiceQueryResponse)
def voice_query(
    payload: VoiceQueryRequest,
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session)
):
    resolved_text = _resolve_text(payload.audio_url, payload.text)
    
    text_lower = resolved_text.lower()
    registry_keywords = ["safe", "trust", "agency", "check"]
    
    if any(kw in text_lower for kw in registry_keywords):
        agency = None
        if payload.agency_id:
            agency = session.get(Agency, payload.agency_id)
        if agency is None:
            agency = registry.match_agency_by_name(session, resolved_text)

        if agency is not None:
            answer_text = registry.describe_agency_safety(session, agency)
        else:
            answer_text = (
                "I could not tell which agency you mean. "
                "Please say the agency's name or license number."
            )
    else:
        answer_text = "I am Amannat voice assistant. How can I help you today?"
        
    answer_audio_url = call_voxide_tts(answer_text)
    return VoiceQueryResponse(answer_text=answer_text, answer_audio_url=answer_audio_url)


@router.post("/contract/read", response_model=VoiceContractResponse)
def voice_contract_read(
    payload: VoiceContractRequest,
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session)
):
    contract = session.exec(select(Contract).where(Contract.id == payload.contract_id)).first()
    if not contract or contract.worker_id != worker.id:
        raise HTTPException(status_code=404, detail="Contract not found")
        
    end_date_str = contract.end_date.isoformat() if contract.end_date else "ongoing"
    
    summary = (
        f"Your contract runs from {contract.start_date.isoformat()} to {end_date_str}, "
        f"with a monthly wage of {contract.wage}. Terms: {contract.terms_json}."
    )
    
    audio_url = call_voxide_tts(summary)
    
    return VoiceContractResponse(text=summary, audio_url=audio_url)


@router.post("/report", response_model=VoiceReportResponse)
def voice_report(
    payload: VoiceReportRequest,
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session)
):
    resolved_text = _resolve_text(payload.audio_url, payload.text)
    text_lower = resolved_text.lower()
    
    category_guess = "unknown"
    if any(kw in text_lower for kw in ["pay", "wage", "paid"]):
        category_guess = "wage_nonpayment"
    elif "passport" in text_lower:
        category_guess = "passport_confiscation"
    elif any(kw in text_lower for kw in ["hit", "hurt", "abuse"]):
        category_guess = "abuse"
    elif any(kw in text_lower for kw in ["contract", "different", "changed"]):
        category_guess = "contract_substitution"
        
    agency = registry.match_agency_by_name(session, resolved_text)

    # Deliberately returns a draft only: the worker must confirm it in the app before the
    # frontend submits it to /report/reports. Do not auto-submit from here.
    return VoiceReportResponse(
        text=resolved_text,
        category_guess=category_guess,
        agency_name_guess=agency.name if agency else None,
        agency_id=agency.id if agency else None
    )
