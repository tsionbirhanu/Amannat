from pydantic import BaseModel

class OtpRequest(BaseModel):
    phone: str

class OtpVerify(BaseModel):
    phone: str
    code: str

class Token(BaseModel):
    access_token: str
    token_type: str
