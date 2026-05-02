from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: Literal["citizen", "admin"] = "citizen"
    admin_code: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    name: str


class AmbulanceBookingRequest(BaseModel):
    patient_name: str = Field(min_length=2, max_length=80)
    location: str = Field(min_length=3, max_length=200)
    emergency_level: Literal["low", "medium", "high"]
    notes: Optional[str] = Field(default=None, max_length=600)


class ComplaintRequest(BaseModel):
    title: str = Field(min_length=3, max_length=120)
    description: str = Field(min_length=10, max_length=1200)
    category: str = Field(min_length=2, max_length=80)


class SosRequest(BaseModel):
    location: str = Field(min_length=3, max_length=200)
    message: Optional[str] = Field(default="Emergency SOS triggered", max_length=400)
