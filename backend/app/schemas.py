from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

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
