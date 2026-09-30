import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, SQLModel


def gen_id() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Worker(SQLModel, table=True):
    id: str = Field(default_factory=gen_id, primary_key=True)
    phone: str = Field(unique=True, index=True)
    languages: str = ""  # comma-separated, e.g. "am,en"
    created_at: datetime = Field(default_factory=utc_now)


class OtpCode(SQLModel, table=True):
    id: str = Field(default_factory=gen_id, primary_key=True)
    phone: str = Field(index=True)
    code: str
    expires_at: datetime


class GuardianContact(SQLModel, table=True):
    id: str = Field(default_factory=gen_id, primary_key=True)
    worker_id: str = Field(foreign_key="worker.id")
    name: str
    relation: str
    channel: str  # sms | call | app
    phone: str


class Agency(SQLModel, table=True):
    id: str = Field(default_factory=gen_id, primary_key=True)
    name: str
    license_no: Optional[str] = Field(default=None, unique=True)
    phone: Optional[str] = Field(default=None, index=True)
    email: Optional[str] = Field(default=None)
    location: Optional[str] = Field(default=None)
    verification_status: str = Field(
        default="unverified"
    )  # unverified | verified | flagged


class Contract(SQLModel, table=True):
    id: str = Field(default_factory=gen_id, primary_key=True)
    worker_id: str = Field(foreign_key="worker.id")
    agency_id: Optional[str] = Field(default=None, foreign_key="agency.id")
    wage: float
    terms_json: str
    start_date: datetime
    end_date: Optional[datetime] = None
    document_ref: Optional[str] = None


class WageLog(SQLModel, table=True):
    id: str = Field(default_factory=gen_id, primary_key=True)
    contract_id: str = Field(foreign_key="contract.id")
    amount: float
    paid_on: datetime
    note: Optional[str] = None


class Report(SQLModel, table=True):
    id: str = Field(default_factory=gen_id, primary_key=True)
    worker_pseudo_id: str
    worker_id_raw: Optional[str] = None  # council-only, never exposed publicly
    agency_id: str = Field(foreign_key="agency.id")
    category: (
        str  # wage_nonpayment | contract_substitution | abuse | passport_confiscation
    )
    description: Optional[str] = None
    verified_status: str = Field(default="pending")
    created_at: datetime = Field(default_factory=utc_now)
    
class Appeal(SQLModel, table=True):
    id: str = Field(default_factory=gen_id, primary_key=True)
    agency_id: str = Field(foreign_key="agency.id")
    message: str
    status: str = Field(default="pending")
    created_at: datetime = Field(default_factory=utc_now)


class Shortlist(SQLModel, table=True):
    id: str = Field(default_factory=gen_id, primary_key=True)
    worker_id: str = Field(foreign_key="worker.id")
    agency_id: str = Field(foreign_key="agency.id")


class CheckIn(SQLModel, table=True):
    id: str = Field(default_factory=gen_id, primary_key=True)
    worker_id: str = Field(foreign_key="worker.id")
    scheduled_at: datetime
    status: str = Field(default="pending")  # pending | confirmed | missed
    channel: str = Field(default="app")


class Escalation(SQLModel, table=True):
    id: str = Field(default_factory=gen_id, primary_key=True)
    worker_id: str = Field(foreign_key="worker.id")
    trigger_type: str  # missed_checkin | panic
    notified_contacts_json: str
    timestamp: datetime = Field(default_factory=utc_now)


class CouncilDecision(SQLModel, table=True):
    id: str = Field(default_factory=gen_id, primary_key=True)
    case_id: str
    ruling: str
    published_summary: str
    created_at: datetime = Field(default_factory=utc_now)