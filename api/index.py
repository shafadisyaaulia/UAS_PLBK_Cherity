from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import json

# Lightweight FastAPI app for Vercel Serverless
app = FastAPI(
    title="SOLVIA API - Serverless",
    description="AI-Safe Virtual Chemistry Lab - Serverless Backend",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class ChemicalAdd(BaseModel):
    chemical_id: str
    volume: float
    concentration: float

class MixtureState(BaseModel):
    chemicals: List[dict]
    total_volume: float
    ph: float
    temperature: float
    color: str

# In-memory storage (for serverless, use database in production)
mixture_state = {
    "chemicals": [],
    "total_volume": 0,
    "ph": 7.0,
    "temperature": 25.0,
    "color": "clear"
}

chemical_database = {
    "HCl": {"name": "Asam Klorida", "type": "acid", "pH": 1.0, "color": "clear"},
    "NaOH": {"name": "Natrium Hidroksida", "type": "base", "pH": 14.0, "color": "clear"},
    "H2SO4": {"name": "Asam Sulfat", "type": "acid", "pH": 0.5, "color": "clear"},
    "NH3": {"name": "Amonia", "type": "base", "pH": 11.0, "color": "clear"},
    "CH3COOH": {"name": "Asam Asetat", "type": "acid", "pH": 4.0, "color": "clear"},
    "phenolphthalein": {"name": "Fenolftalein", "type": "indicator", "pH": 7.0, "color": "clear"},
    "methyl_orange": {"name": "Metil Oranye", "type": "indicator", "pH": 7.0, "color": "orange"}
}

def calculate_ph(chemicals: List[dict]) -> float:
    """Simple pH calculation for demonstration"""
    if not chemicals:
        return 7.0
    
    h_concentration = 0
    oh_concentration = 0
    
    for chem in chemicals:
        chem_data = chemical_database.get(chem["id"], {})
        volume_fraction = chem["volume"] / max(sum(c["volume"] for c in chemicals), 1)
        
        if chem_data.get("type") == "acid":
            h_concentration += (14 - chem_data.get("pH", 7)) * volume_fraction
        elif chem_data.get("type") == "base":
            oh_concentration += (chem_data.get("pH", 7) - 7) * volume_fraction
    
    net_ph = 7.0 + oh_concentration - h_concentration
    return max(0, min(14, net_ph))

@app.get("/")
async def root():
    return {
        "message": "SOLVIA API - Serverless Mode",
        "status": "running",
        "mode": "vercel-serverless",
        "features": {
            "api": "✅ Available",
            "websocket": "⚠️ Limited (use polling instead)",
            "cv_detection": "❌ Use local mode for full CV features",
            "chemistry": "✅ Available"
        },
        "endpoints": {
            "health": "/health",
            "chemicals": "/api/chemicals",
            "mixture": "/api/mixture/*",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "mode": "serverless"}

@app.get("/api/chemicals")
async def get_chemicals():
    """Get available chemicals database"""
    return {
        "chemicals": chemical_database,
        "count": len(chemical_database)
    }

@app.get("/api/chemicals/{chemical_id}")
async def get_chemical(chemical_id: str):
    """Get specific chemical info"""
    if chemical_id not in chemical_database:
        raise HTTPException(status_code=404, detail="Chemical not found")
    return chemical_database[chemical_id]

@app.post("/api/mixture/add")
async def add_chemical(chemical: ChemicalAdd):
    """Add chemical to mixture"""
    if chemical.chemical_id not in chemical_database:
        raise HTTPException(status_code=404, detail="Chemical not found")
    
    mixture_state["chemicals"].append({
        "id": chemical.chemical_id,
        "volume": chemical.volume,
        "concentration": chemical.concentration,
        "name": chemical_database[chemical.chemical_id]["name"]
    })
    
    mixture_state["total_volume"] += chemical.volume
    mixture_state["ph"] = calculate_ph(mixture_state["chemicals"])
    
    return {
        "success": True,
        "mixture": mixture_state,
        "message": f"Added {chemical.volume}mL of {chemical_database[chemical.chemical_id]['name']}"
    }

@app.get("/api/mixture/state")
async def get_mixture_state():
    """Get current mixture state"""
    return mixture_state

@app.post("/api/mixture/reset")
async def reset_mixture():
    """Reset mixture to empty state"""
    mixture_state["chemicals"] = []
    mixture_state["total_volume"] = 0
    mixture_state["ph"] = 7.0
    mixture_state["temperature"] = 25.0
    mixture_state["color"] = "clear"
    
    return {
        "success": True,
        "message": "Mixture reset",
        "mixture": mixture_state
    }

@app.get("/api/experiments")
async def get_experiments():
    """Get available experiments"""
    return {
        "experiments": [
            {
                "id": "ph-meter",
                "name": "pH Meter Virtual",
                "description": "Measure pH of various solutions",
                "difficulty": "beginner"
            },
            {
                "id": "acid-base",
                "name": "Acid-Base Titration",
                "description": "Practice titration techniques",
                "difficulty": "intermediate"
            },
            {
                "id": "indicators",
                "name": "Chemical Indicators",
                "description": "Test various pH indicators",
                "difficulty": "beginner"
            }
        ]
    }

# Note: WebSocket and CV detection not available in serverless mode
# For full features, run backend locally with: python api/server.py

# Mangum handler for Vercel
from mangum import Mangum
handler = Mangum(app, lifespan="off")
