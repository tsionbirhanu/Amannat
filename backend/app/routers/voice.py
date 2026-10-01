from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.models import Worker, Contract
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
    worker: Worker = Depends(get_current_worker)
):
    resolved_text = _resolve_text(payload.audio_url, payload.text)
    
    text_lower = resolved_text.lower()
    registry_keywords = ["safe", "trust", "agency", "check"]
    
    if any(kw in text_lower for kw in registry_keywords):
        # TODO: call registry search once available
        answer_text = "This agency appears to be safe based on our preliminary records."
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
    worker: Worker = Depends(get_current_worker)
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
        
    # extract agency name guess (stub)
    agency_name_guess = None
    known_agency_names = ["bad agency llc", "good agency"]
    for name in known_agency_names:
        if name in text_lower:
            agency_name_guess = name
            break
            
    return VoiceReportResponse(
        text=resolved_text,
        category_guess=category_guess,
        agency_name_guess=agency_name_guess
    )
