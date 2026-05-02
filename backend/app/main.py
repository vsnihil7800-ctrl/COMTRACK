from datetime import datetime, timezone
from bson import ObjectId
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from .schemas import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    AmbulanceBookingRequest,
    ComplaintRequest,
    SosRequest,
)
from .database import users_collection, ambulance_collection, complaints_collection, sos_collection
from .auth import hash_password, verify_password, create_access_token, get_current_user, require_admin
from .config import settings

app = FastAPI(title="COMTRACK API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def serialize_doc(doc: dict):
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc


@app.get("/health")
def health():
    return {"status": "ok", "service": "comtrack-api"}


@app.post("/auth/register", response_model=TokenResponse)
def register(payload: RegisterRequest):
    if users_collection.find_one({"email": payload.email}):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    if payload.role == "admin":
        if not settings.admin_registration_code:
            raise HTTPException(status_code=403, detail="Admin registration is disabled")
        if payload.admin_code != settings.admin_registration_code:
            raise HTTPException(status_code=403, detail="Invalid admin registration code")

    user_doc = {
        "name": payload.name,
        "email": payload.email,
        "password_hash": hash_password(payload.password),
        "role": payload.role,
        "created_at": datetime.now(timezone.utc),
    }
    result = users_collection.insert_one(user_doc)
    token = create_access_token({"sub": str(result.inserted_id), "role": payload.role})
    return TokenResponse(access_token=token, role=payload.role, name=payload.name)


@app.post("/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    user = users_collection.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token({"sub": str(user["_id"]), "role": user["role"]})
    return TokenResponse(access_token=token, role=user["role"], name=user["name"])


@app.get("/dashboard/summary")
def dashboard_summary(user=Depends(get_current_user)):
    return {
        "user": {"name": user["name"], "role": user["role"], "email": user["email"]},
        "stats": {
            "ambulance_bookings": ambulance_collection.count_documents({}),
            "complaints": complaints_collection.count_documents({}),
            "sos_alerts": sos_collection.count_documents({}),
        },
    }


@app.post("/ambulance/book")
def book_ambulance(payload: AmbulanceBookingRequest, user=Depends(get_current_user)):
    doc = {
        "user_id": str(user["_id"]),
        "patient_name": payload.patient_name,
        "location": payload.location,
        "emergency_level": payload.emergency_level,
        "notes": payload.notes,
        "status": "pending",
        "created_at": datetime.now(timezone.utc),
    }
    result = ambulance_collection.insert_one(doc)
    return {"message": "Ambulance booking submitted", "booking_id": str(result.inserted_id)}


@app.get("/ambulance/my-bookings")
def my_bookings(user=Depends(get_current_user)):
    bookings = ambulance_collection.find({"user_id": str(user["_id"])}).sort("created_at", -1)
    return [serialize_doc(item) for item in bookings]


@app.post("/complaints")
def create_complaint(payload: ComplaintRequest, user=Depends(get_current_user)):
    doc = {
        "user_id": str(user["_id"]),
        "title": payload.title,
        "description": payload.description,
        "category": payload.category,
        "status": "open",
        "created_at": datetime.now(timezone.utc),
    }
    result = complaints_collection.insert_one(doc)
    return {"message": "Complaint registered", "complaint_id": str(result.inserted_id)}


@app.get("/complaints/my")
def my_complaints(user=Depends(get_current_user)):
    complaints = complaints_collection.find({"user_id": str(user["_id"])}).sort("created_at", -1)
    return [serialize_doc(item) for item in complaints]


@app.post("/sos")
def trigger_sos(payload: SosRequest, user=Depends(get_current_user)):
    doc = {
        "user_id": str(user["_id"]),
        "name": user["name"],
        "location": payload.location,
        "message": payload.message,
        "severity": "critical",
        "created_at": datetime.now(timezone.utc),
    }
    result = sos_collection.insert_one(doc)
    return {"message": "SOS alert sent", "sos_id": str(result.inserted_id)}


@app.get("/admin/overview")
def admin_overview(admin=Depends(require_admin)):
    return {
        "admin": admin["name"],
        "totals": {
            "users": users_collection.count_documents({}),
            "ambulance_bookings": ambulance_collection.count_documents({}),
            "complaints": complaints_collection.count_documents({}),
            "sos_alerts": sos_collection.count_documents({}),
        },
        "recent_sos": [serialize_doc(item) for item in sos_collection.find().sort("created_at", -1).limit(10)],
        "recent_complaints": [
            serialize_doc(item) for item in complaints_collection.find().sort("created_at", -1).limit(10)
        ],
        "recent_bookings": [
            serialize_doc(item) for item in ambulance_collection.find().sort("created_at", -1).limit(10)
        ],
    }


@app.patch("/admin/complaints/{complaint_id}/status")
def update_complaint_status(complaint_id: str, status_value: str, admin=Depends(require_admin)):
    _ = admin
    allowed = {"open", "in_progress", "resolved", "rejected"}
    if status_value not in allowed:
        raise HTTPException(status_code=400, detail=f"Invalid status. Allowed: {sorted(allowed)}")

    if not ObjectId.is_valid(complaint_id):
        raise HTTPException(status_code=400, detail="Invalid complaint id")

    result = complaints_collection.update_one(
        {"_id": ObjectId(complaint_id)},
        {"$set": {"status": status_value}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return {"message": "Complaint status updated"}

