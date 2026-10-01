from apscheduler.schedulers.background import BackgroundScheduler
from sqlmodel import Session, select
import json

from app.database import engine
from app.models import CheckIn, Escalation, GuardianContact, utc_now
from app.integrations.sms_gateway import send_alert_sms

def checkin_job():
    with Session(engine) as session:
        now = utc_now()
        
        # 1. Update pending to missed
        stmt_pending = select(CheckIn).where(CheckIn.scheduled_at < now, CheckIn.status == "pending")
        pending_checkins = session.exec(stmt_pending).all()
        for checkin in pending_checkins:
            checkin.status = "missed"
        
        session.commit()
        
        # 2. Check for escalation
        stmt_missed = select(CheckIn).where(CheckIn.status == "missed").order_by(CheckIn.scheduled_at.desc())
        all_missed = session.exec(stmt_missed).all()
        
        # Group by worker
        worker_missed = {}
        for m in all_missed:
            if m.worker_id not in worker_missed:
                worker_missed[m.worker_id] = []
            worker_missed[m.worker_id].append(m)
        
        for worker_id, missed in worker_missed.items():
            if len(missed) >= 2:
                recent_two = missed[:2]
                
                # Check if escalation exists after these two
                latest_scheduled_at = max(recent_two[0].scheduled_at, recent_two[1].scheduled_at)
                
                stmt_esc = select(Escalation).where(
                    Escalation.worker_id == worker_id,
                    Escalation.trigger_type == "missed_checkin",
                    Escalation.timestamp > latest_scheduled_at
                )
                existing = session.exec(stmt_esc).first()
                
                if not existing:
                    contacts_stmt = select(GuardianContact).where(GuardianContact.worker_id == worker_id)
                    contacts = session.exec(contacts_stmt).all()
                    
                    contacts_dicts = [{"id": c.id, "name": c.name, "relation": c.relation, "channel": c.channel, "phone": c.phone} for c in contacts]
                    
                    escalation = Escalation(
                        worker_id=worker_id,
                        trigger_type="missed_checkin",
                        notified_contacts_json=json.dumps(contacts_dicts)
                    )
                    session.add(escalation)
                    session.commit()
                    
                    for c in contacts:
                        if c.phone:
                            send_alert_sms(c.phone, f"MISSED CHECK-IN ALERT for worker {worker_id}")

import os
_scheduler = None

def start_scheduler():
    global _scheduler
    if os.getenv("TESTING") == "1":
        return
    if _scheduler is None:
        _scheduler = BackgroundScheduler()
        _scheduler.add_job(checkin_job, 'interval', minutes=15)
        _scheduler.start()

def stop_scheduler():
    global _scheduler
    if _scheduler is not None:
        _scheduler.shutdown(wait=False)
        _scheduler = None
