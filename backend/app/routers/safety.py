from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlmodel import Session, select
from typing import List
from datetime import timedelta
import json

from app.database import get_session
from app.dependencies import get_current_worker
from app.models import Worker, CheckIn, Escalation, GuardianContact, utc_now
from app.schemas import CheckInScheduleRequest, PanicRequest
from app.integrations.sms_gateway import send_alert_sms

router = APIRouter()

@router.post("/checkins/schedule")
def schedule_checkins(
    request: CheckInScheduleRequest,
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session)
):
    if request.frequency not in ["daily", "weekly"]:
        raise HTTPException(status_code=400, detail="Invalid frequency")
    
    interval = timedelta(days=1) if request.frequency == "daily" else timedelta(weeks=1)
    now = utc_now()
    
    checkins = []
    for i in range(4):
        scheduled_time = now + interval * i
        checkin = CheckIn(
            worker_id=worker.id,
            scheduled_at=scheduled_time,
            status="pending",
            channel=request.channel
        )
        session.add(checkin)
        checkins.append(checkin)
    
    session.commit()
    for c in checkins:
        session.refresh(c)
    
    return checkins

@router.post("/checkins/{id}/confirm")
def confirm_checkin(
    id: str,
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session)
):
    checkin = session.get(CheckIn, id)
    if not checkin or checkin.worker_id != worker.id:
        raise HTTPException(status_code=404, detail="Check-in not found")
    
    checkin.status = "confirmed"
    session.commit()
    session.refresh(checkin)
    return checkin

@router.get("/checkins")
def list_checkins(
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session)
):
    statement = select(CheckIn).where(CheckIn.worker_id == worker.id).order_by(CheckIn.scheduled_at.desc())
    checkins = session.exec(statement).all()
    return checkins

def trigger_panic_alerts(worker_id: str, contacts: List[GuardianContact], session: Session):
    for contact in contacts:
        if contact.phone:
            send_alert_sms(contact.phone, f"PANIC ALERT from worker {worker_id}")

@router.post("/panic")
def trigger_panic(
    request: PanicRequest,
    background_tasks: BackgroundTasks,
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session)
):
    contacts_stmt = select(GuardianContact).where(GuardianContact.worker_id == worker.id)
    contacts = session.exec(contacts_stmt).all()
    
    contacts_dicts = [{"id": c.id, "name": c.name, "relation": c.relation, "channel": c.channel, "phone": c.phone} for c in contacts]
    
    escalation = Escalation(
        worker_id=worker.id,
        trigger_type="panic",
        notified_contacts_json=json.dumps(contacts_dicts)
    )
    session.add(escalation)
    session.commit()
    
    background_tasks.add_task(trigger_panic_alerts, worker.id, contacts, session)
    return {"status": "panic triggered"}

@router.get("/hotlines")
def get_hotlines(
    country: str,
    worker: Worker = Depends(get_current_worker)
):
    hotlines = {
        "UAE": ["800-999", "800-111"],
        "Saudi Arabia": ["999", "19911"],
        "Lebanon": ["112", "1744"],
        "Kuwait": ["112"]
    }
    
    return hotlines.get(country, [])

@router.get("/escalations")
def list_escalations(
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session)
):
    statement = select(Escalation).where(Escalation.worker_id == worker.id).order_by(Escalation.timestamp.desc())
    escalations = session.exec(statement).all()
    return escalations
