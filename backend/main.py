from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
import datetime

app = FastAPI(
    title="Agentic Consultancy API",
    description="Backend for the Cityscape Sandbox waitlist and agent interaction.",
    version="1.0.0"
)

# CORS configuration for local dev and Nginx proxy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WaitlistRequest(BaseModel):
    name: str
    email: EmailStr
    interest_area: str

class WaitlistResponse(BaseModel):
    status: str
    message: str
    timestamp: str

@app.post("/api/waitlist", response_model=WaitlistResponse)
async def join_waitlist(request: WaitlistRequest):
    """
    Captures waitlist signups from the 3D WebGL Frontend.
    In a production setting, this would insert into a database (e.g., PostgreSQL).
    """
    # Validation logic is handled by Pydantic (EmailStr)
    if request.interest_area not in ["Text2Clip", "OVI", "Aura"]:
        raise HTTPException(status_code=400, detail="Invalid area of interest.")

    # Mock DB insertion
    print(f"New signup: {request.name} ({request.email}) - {request.interest_area}")
    
    return WaitlistResponse(
        status="success",
        message="Welcome to the vanguard.",
        timestamp=datetime.datetime.utcnow().isoformat()
    )

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "agentic-backend"}
