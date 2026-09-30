from dataclasses import Field

from app.models import gen_id, utc_now
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Literal
from sqlmodel import SQLModel

class OtpRequest(BaseModel):
    phone: str

class OtpVerify(BaseModel):
    phone: str
    code: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ContractCreate(BaseModel):
    agency_id: Optional[str] = None
    wage: float
    hours: Optional[int] = None
    terms: str
    start_date: datetime
    end_date: Optional[datetime] = None

class ContractResponse(BaseModel):
    contract: dict
    flags: List[str]

class WageLogCreate(BaseModel):
    amount: float
    paid_on: datetime
    note: Optional[str] = None

class WageSummary(BaseModel):
    total_owed: float
    total_paid: float
    balance: float

class GuardianContactCreate(BaseModel):
    name: str
    relation: str
    channel: str
    phone: str

class RecordExport(BaseModel):
    worker: dict
    contracts: List[dict]
    guardian_contacts: List[dict]

class AgencyCreate(BaseModel):
    name: str
    license_no: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None
    verification_status: Optional[Literal["unverified", "verified", "flagged"]] = "unverified"

class AgencyRead(BaseModel):
    id: str
    name: str
    license_no: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None
    verification_status: str

class ReportCreate(BaseModel):
    agency_id: str
    category: Literal[
        "wage_nonpayment",
        "contract_substitution",
        "abuse",
        "passport_confiscation",
    ]
    description: Optional[str] = None

class AppealCreate(BaseModel):
    message: str
class ShortlistCreate(BaseModel):
    agency_id: str
