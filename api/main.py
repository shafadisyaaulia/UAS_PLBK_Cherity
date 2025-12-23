"""
SOLVIA Backend - FastAPI Server
Solution Vision-driven Integrated Analytics

Features:
- WebSocket video streaming with MediaPipe Hands and YOLOv5 Fall Detection
- Chemistry engine with pH calculation
- State management for mixture containers
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Tuple
import cv2
import numpy as np
import base64
import json
import asyncio
import math
from datetime import datetime
import mediapipe as mp
import torch
import os

# ============================================================================
# FASTAPI INITIALIZATION
# ============================================================================
app = FastAPI(title="SOLVIA Backend API", version="1.0.0")

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# YOLOV5 INITIALIZATION (OPTIONAL - Disabled by default for SOLVIA Chemistry focus)
# ============================================================================

print("🔄 Checking YOLOv5 model...")
yolo_model = None
yolo_available = False

# Disable YOLOv5 for chemistry lab focus - uncomment if needed for fall detection
# try:
#     custom_model_path = "models/best.pt"
#     if os.path.exists(custom_model_path):
#         print(f"🔄 Loading custom fall detection model from {custom_model_path}...")
#         
#         from ultralytics import YOLO
#         yolo_model = YOLO(custom_model_path)
#         
#         yolo_available = True
#         print("✅ Custom YOLOv5 fall detection model loaded successfully!")
#         print("📊 Model Accuracy: 95.3% mAP@50 (trained on 7929 images)")
#         print("🎯 Classes: non_fall (94.6%), fall (95.9%)")
# except Exception as e:
#     print(f"⚠️ Warning: Could not load YOLOv5 model: {e}")
#     yolo_available = False

print("⚠️ YOLOv5 fall detection: DISABLED (focus on chemistry)")

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class ChemicalInfo(BaseModel):
    name: str
    type: str
    pH: float
    color: Tuple[int, int, int]
    description: str
    molarity: Optional[float] = 1.0  # Default 1M

class MixtureComponent(BaseModel):
    chemical_id: str
    volume: float  # in mL
    molarity: float = 1.0  # Molar concentration

class MixtureState(BaseModel):
    components: List[MixtureComponent]
    total_volume: float
    current_pH: float
    current_color: Tuple[int, int, int]
    reaction_name: str
    description: str
    timestamp: str

class AddChemicalRequest(BaseModel):
    chemical_id: str
    volume: float = 10.0
    molarity: float = 1.0

class SafetyAlert(BaseModel):
    status: str  # "safe" or "danger"
    message: str
    timestamp: str

# ============================================================================
# CHEMICALS DATABASE
# ============================================================================

CHEMICALS_DATABASE: Dict[str, ChemicalInfo] = {
    "HCl": ChemicalInfo(
        name="Asam Klorida (HCl)",
        type="strong_acid",
        pH=1.0,
        color=(0, 0, 200),
        description="Asam kuat, Ka sangat besar",
        molarity=1.0
    ),
    "H2SO4": ChemicalInfo(
        name="Asam Sulfat (H₂SO₄)",
        type="strong_acid",
        pH=1.0,
        color=(0, 0, 255),
        description="Asam kuat diprotik",
        molarity=1.0
    ),
    "HNO3": ChemicalInfo(
        name="Asam Nitrat (HNO₃)",
        type="strong_acid",
        pH=1.0,
        color=(0, 50, 255),
        description="Asam kuat pengoksidasi",
        molarity=1.0
    ),
    "CH3COOH": ChemicalInfo(
        name="Asam Asetat (CH₃COOH)",
        type="weak_acid",
        pH=4.5,
        color=(0, 100, 255),
        description="Asam lemah, Ka=1.8×10⁻⁵",
        molarity=1.0
    ),
    "H2O": ChemicalInfo(
        name="Air (H₂O)",
        type="neutral",
        pH=7.0,
        color=(200, 200, 200),
        description="Pelarut netral",
        molarity=55.5  # Molarity of pure water
    ),
    "NaOH": ChemicalInfo(
        name="Natrium Hidroksida (NaOH)",
        type="strong_base",
        pH=14.0,
        color=(255, 0, 0),
        description="Basa kuat, Kb sangat besar",
        molarity=1.0
    ),
    "KOH": ChemicalInfo(
        name="Kalium Hidroksida (KOH)",
        type="strong_base",
        pH=14.0,
        color=(255, 50, 0),
        description="Basa kuat",
        molarity=1.0
    ),
    "NH3": ChemicalInfo(
        name="Amonia (NH₃)",
        type="weak_base",
        pH=11.0,
        color=(255, 100, 0),
        description="Basa lemah, Kb=1.8×10⁻⁵",
        molarity=1.0
    ),
    "NaCl": ChemicalInfo(
        name="Garam Dapur (NaCl)",
        type="salt_neutral",
        pH=7.0,
        color=(255, 255, 255),
        description="Garam netral",
        molarity=1.0
    ),
    "PP": ChemicalInfo(
        name="Fenolftalein (PP)",
        type="indicator",
        pH=7.0,
        color=(200, 0, 200),
        description="Indikator: tidak berwarna (pH<8.3), merah muda (pH>8.3)",
        molarity=0.1
    ),
    "MO": ChemicalInfo(
        name="Metil Orange (MO)",
        type="indicator",
        pH=7.0,
        color=(255, 165, 0),
        description="Indikator: merah (pH<3.1), kuning (pH>4.4)",
        molarity=0.1
    ),
}

# ============================================================================
# CHEMISTRY ENGINE
# ============================================================================

class ChemistryEngine:
    """Advanced chemistry calculation engine with molarity support"""
    
    def __init__(self):
        self.mixture_components: List[MixtureComponent] = []
        self.total_volume = 0.0
        self.current_pH = 7.0
        self.current_color = (200, 200, 200)
        self.reaction_name = "Wadah Kosong"
        self.description = "Belum ada bahan"
    
    def add_chemical(self, chemical_id: str, volume: float, molarity: float = 1.0) -> bool:
        """Add chemical to mixture"""
        if chemical_id not in CHEMICALS_DATABASE:
            return False
        
        component = MixtureComponent(
            chemical_id=chemical_id,
            volume=volume,
            molarity=molarity
        )
        self.mixture_components.append(component)
        self.total_volume += volume
        self._calculate_mixture()
        return True
    
    def _calculate_mixture(self):
        """Calculate pH and color of mixture using advanced chemistry"""
        if not self.mixture_components:
            self.current_pH = 7.0
            self.current_color = (200, 200, 200)
            self.reaction_name = "Wadah Kosong"
            self.description = "Belum ada bahan"
            return
        
        # Calculate total H+ and OH- concentrations using molarity
        total_h_moles = 0.0
        total_oh_moles = 0.0
        
        for component in self.mixture_components:
            chem = CHEMICALS_DATABASE[component.chemical_id]
            volume_L = component.volume / 1000.0  # Convert mL to L
            
            if chem.type == "strong_acid":
                # Strong acid: completely dissociates
                # For HCl: [H+] = M * V
                # For H2SO4: [H+] = 2 * M * V (diprotic)
                multiplier = 2 if component.chemical_id == "H2SO4" else 1
                h_moles = component.molarity * volume_L * multiplier
                total_h_moles += h_moles
                
            elif chem.type == "weak_acid":
                # Weak acid: partial dissociation using Ka
                # For CH3COOH: Ka = 1.8e-5
                Ka = 1.8e-5
                # Simplified: [H+] ≈ sqrt(Ka * M) * V
                h_concentration = math.sqrt(Ka * component.molarity)
                h_moles = h_concentration * volume_L
                total_h_moles += h_moles
                
            elif chem.type == "strong_base":
                # Strong base: completely dissociates
                oh_moles = component.molarity * volume_L
                total_oh_moles += oh_moles
                
            elif chem.type == "weak_base":
                # Weak base: partial dissociation using Kb
                # For NH3: Kb = 1.8e-5
                Kb = 1.8e-5
                # Simplified: [OH-] ≈ sqrt(Kb * M) * V
                oh_concentration = math.sqrt(Kb * component.molarity)
                oh_moles = oh_concentration * volume_L
                total_oh_moles += oh_moles
        
        # Calculate final pH
        total_volume_L = self.total_volume / 1000.0
        
        if total_volume_L == 0:
            self.current_pH = 7.0
        elif total_h_moles > total_oh_moles:
            # Acidic solution
            net_h_moles = total_h_moles - total_oh_moles
            h_concentration = net_h_moles / total_volume_L
            if h_concentration > 0:
                self.current_pH = -math.log10(h_concentration)
            else:
                self.current_pH = 7.0
        elif total_oh_moles > total_h_moles:
            # Basic solution
            net_oh_moles = total_oh_moles - total_h_moles
            oh_concentration = net_oh_moles / total_volume_L
            if oh_concentration > 0:
                pOH = -math.log10(oh_concentration)
                self.current_pH = 14 - pOH
            else:
                self.current_pH = 7.0
        else:
            # Neutral (perfect neutralization)
            self.current_pH = 7.0
        
        # Clamp pH to valid range
        self.current_pH = max(0, min(14, self.current_pH))
        
        # Calculate color (weighted average)
        self._calculate_color()
        
        # Generate reaction name and description
        self._generate_reaction_info()
    
    def _calculate_color(self):
        """Calculate mixture color based on components"""
        if not self.mixture_components:
            self.current_color = (200, 200, 200)
            return
        
        r_total, g_total, b_total = 0.0, 0.0, 0.0
        
        for component in self.mixture_components:
            chem = CHEMICALS_DATABASE[component.chemical_id]
            weight = component.volume / self.total_volume
            
            # Special case for indicators
            if chem.type == "indicator":
                if component.chemical_id == "PP":
                    # Phenolphthalein: colorless if pH < 8.3, pink if pH > 8.3
                    if self.current_pH > 8.3:
                        indicator_color = (200, 0, 200)  # Pink
                    else:
                        indicator_color = (200, 200, 200)  # Colorless
                elif component.chemical_id == "MO":
                    # Methyl Orange: red if pH < 3.1, yellow if pH > 4.4
                    if self.current_pH < 3.1:
                        indicator_color = (0, 0, 255)  # Red
                    elif self.current_pH > 4.4:
                        indicator_color = (0, 255, 255)  # Yellow
                    else:
                        indicator_color = (0, 128, 255)  # Orange
                else:
                    indicator_color = chem.color
                
                r_total += indicator_color[2] * weight
                g_total += indicator_color[1] * weight
                b_total += indicator_color[0] * weight
            else:
                r_total += chem.color[2] * weight
                g_total += chem.color[1] * weight
                b_total += chem.color[0] * weight
        
        self.current_color = (int(b_total), int(g_total), int(r_total))
    
    def _generate_reaction_info(self):
        """Generate reaction name and description"""
        if not self.mixture_components:
            self.reaction_name = "Wadah Kosong"
            self.description = "Belum ada bahan"
            return
        
        chem_ids = [c.chemical_id for c in self.mixture_components]
        
        # Check for acid-base neutralization
        has_strong_acid = any(
            CHEMICALS_DATABASE[c.chemical_id].type == "strong_acid" 
            for c in self.mixture_components
        )
        has_strong_base = any(
            CHEMICALS_DATABASE[c.chemical_id].type == "strong_base" 
            for c in self.mixture_components
        )
        
        if has_strong_acid and has_strong_base:
            if abs(self.current_pH - 7.0) < 0.3:
                self.reaction_name = "Reaksi Netralisasi Sempurna"
                self.description = f"Garam + Air terbentuk (pH {self.current_pH:.2f})"
            elif self.current_pH < 7:
                self.reaction_name = "Netralisasi: Asam Berlebih"
                self.description = f"Larutan masih asam (pH {self.current_pH:.2f})"
            else:
                self.reaction_name = "Netralisasi: Basa Berlebih"
                self.description = f"Larutan masih basa (pH {self.current_pH:.2f})"
        
        # Check for indicator reactions
        elif any(CHEMICALS_DATABASE[c].type == "indicator" for c in chem_ids):
            if "PP" in chem_ids:
                if self.current_pH > 8.3:
                    self.reaction_name = "Fenolftalein + Basa"
                    self.description = f"Warna merah muda muncul (pH {self.current_pH:.2f})"
                else:
                    self.reaction_name = "Fenolftalein dalam Larutan"
                    self.description = f"Tidak berwarna (pH {self.current_pH:.2f})"
            elif "MO" in chem_ids:
                if self.current_pH < 3.1:
                    self.reaction_name = "Metil Orange + Asam"
                    self.description = f"Warna merah (pH {self.current_pH:.2f})"
                elif self.current_pH > 4.4:
                    self.reaction_name = "Metil Orange + Basa"
                    self.description = f"Warna kuning (pH {self.current_pH:.2f})"
                else:
                    self.reaction_name = "Metil Orange"
                    self.description = f"Warna oranye (pH {self.current_pH:.2f})"
        
        # Single component
        elif len(self.mixture_components) == 1:
            chem = CHEMICALS_DATABASE[self.mixture_components[0].chemical_id]
            self.reaction_name = chem.name
            self.description = f"{chem.description} (pH {self.current_pH:.2f})"
        
        # General mixture
        else:
            names = [
                CHEMICALS_DATABASE[c.chemical_id].name.split("(")[0].strip() 
                for c in self.mixture_components[:3]
            ]
            self.reaction_name = "Campuran: " + " + ".join(names)
            if len(self.mixture_components) > 3:
                self.reaction_name += "..."
            
            if self.current_pH < 3:
                self.description = f"Larutan asam sangat kuat (pH {self.current_pH:.2f})"
            elif self.current_pH < 7:
                self.description = f"Larutan asam (pH {self.current_pH:.2f})"
            elif abs(self.current_pH - 7.0) < 0.1:
                self.description = f"Larutan netral (pH {self.current_pH:.2f})"
            elif self.current_pH < 11:
                self.description = f"Larutan basa (pH {self.current_pH:.2f})"
            else:
                self.description = f"Larutan basa sangat kuat (pH {self.current_pH:.2f})"
    
    def get_state(self) -> MixtureState:
        """Get current mixture state"""
        return MixtureState(
            components=self.mixture_components,
            total_volume=self.total_volume,
            current_pH=self.current_pH,
            current_color=self.current_color,
            reaction_name=self.reaction_name,
            description=self.description,
            timestamp=datetime.now().isoformat()
        )
    
    def reset(self):
        """Reset mixture to empty state"""
        self.__init__()

# ============================================================================
# MEDIAPIPE INITIALIZATION
# ============================================================================

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
hands_detector = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)

# ============================================================================
# GLOBAL STATE
# ============================================================================

chemistry_engine = ChemistryEngine()
current_safety_status = "safe"
reaction_log: List[Dict] = []
last_person_bbox = None  # Track last person bounding box for fall detection

# ============================================================================
# VIDEO PROCESSING FUNCTIONS
# ============================================================================

def detect_fall_yolov5(frame: np.ndarray) -> Tuple[bool, Optional[Dict]]:
    """
    Detect fall using YOLOv5 person detection
    Supports both custom trained model (class 0=non_fall, 1=fall) 
    and default model (aspect ratio based detection)
    Returns: (is_fallen, detection_info)
    """
    global last_person_bbox
    
    if yolo_model is None:
        return False, None
    
    try:
        # Run YOLOv5 inference
        results = yolo_model(frame)
        
        # Get detections
        detections = results.xyxy[0].cpu().numpy()  # x1, y1, x2, y2, conf, class
        
        if len(detections) == 0:
            last_person_bbox = None
            return False, None
        
        # Get the first detection (highest confidence)
        detection = detections[0]
        x1, y1, x2, y2, conf, cls = detection
        
        # Calculate bounding box dimensions
        bbox_width = x2 - x1
        bbox_height = y2 - y1
        aspect_ratio = bbox_width / bbox_height if bbox_height > 0 else 0
        
        # Determine if fallen based on model type
        # Check if using custom model (has class 1 for 'fall')
        if os.path.exists("models/best.pt"):
            # Custom model: class 1 = fall, class 0 = non_fall
            is_fallen = (int(cls) == 1)
            detection_method = "Custom Model"
        else:
            # Default model: use aspect ratio
            # Thresholds:
            # - Normal standing person: height > width (ratio < 1)
            # - Fallen person: width > height (ratio > 1.3)
            is_fallen = aspect_ratio > 1.3
            detection_method = "Aspect Ratio"
        
        detection_info = {
            "bbox": [float(x1), float(y1), float(x2), float(y2)],
            "confidence": float(conf),
            "class": int(cls),
            "width": float(bbox_width),
            "height": float(bbox_height),
            "aspect_ratio": float(aspect_ratio),
            "is_fallen": is_fallen,
            "detection_method": detection_method
        }
        
        last_person_bbox = detection_info
        
        return is_fallen, detection_info
        
    except Exception as e:
        print(f"Error in fall detection: {e}")
        return False, None

def process_frame_complete(frame: np.ndarray) -> Tuple[np.ndarray, Dict, str]:
    """
    Complete frame processing pipeline:
    1. YOLOv5 fall detection
    2. MediaPipe hands detection
    3. Overlay information
    
    Returns: (processed_frame, hand_data, safety_status)
    """
    global current_safety_status
    
    # Step 1: YOLOv5 Fall Detection
    is_fallen, detection_info = detect_fall_yolov5(frame)
    
    # Update safety status based on fall detection
    if is_fallen:
        current_safety_status = "danger"
    else:
        current_safety_status = "safe"
    
    # Draw YOLO detection
    if detection_info:
        frame = draw_yolo_detection(frame, detection_info)
    
    # Step 2: MediaPipe Hands Detection
    frame, hand_data = process_frame_with_mediapipe(frame)
    
    return frame, hand_data, current_safety_status

def draw_yolo_detection(frame: np.ndarray, detection_info: Optional[Dict]) -> np.ndarray:
    """Draw YOLOv5 detection bounding box on frame"""
    if detection_info is None:
        return frame
    
    x1, y1, x2, y2 = detection_info["bbox"]
    is_fallen = detection_info["is_fallen"]
    conf = detection_info["confidence"]
    aspect_ratio = detection_info["aspect_ratio"]
    
    # Choose color based on fall status
    color = (0, 0, 255) if is_fallen else (0, 255, 0)  # Red if fallen, green if safe
    
    # Draw bounding box
    cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), color, 2)
    
    # Draw label
    label = f"{'FALLEN!' if is_fallen else 'Person'} {conf:.2f}"
    (label_w, label_h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
    cv2.rectangle(frame, (int(x1), int(y1) - label_h - 10), 
                  (int(x1) + label_w, int(y1)), color, -1)
    cv2.putText(frame, label, (int(x1), int(y1) - 5), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    
    # Draw aspect ratio info
    info_text = f"Ratio: {aspect_ratio:.2f}"
    cv2.putText(frame, info_text, (int(x1), int(y2) + 20),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
    
    return frame

def process_frame_with_mediapipe(frame: np.ndarray) -> Tuple[np.ndarray, Dict]:
    """Process frame with MediaPipe hands detection"""
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands_detector.process(frame_rgb)
    
    hand_data = {
        "hands_detected": False,
        "landmarks": [],
        "gesture": "none",
        "pointer_position": None
    }
    
    if results.multi_hand_landmarks:
        hand_data["hands_detected"] = True
        
        for hand_landmarks in results.multi_hand_landmarks:
            # Draw hand landmarks on frame
            mp_drawing.draw_landmarks(
                frame,
                hand_landmarks,
                mp_hands.HAND_CONNECTIONS,
                mp_drawing.DrawingSpec(color=(0, 255, 255), thickness=2, circle_radius=2),
                mp_drawing.DrawingSpec(color=(255, 0, 255), thickness=2)
            )
            
            # Extract landmark positions
            landmarks_list = []
            for landmark in hand_landmarks.landmark:
                landmarks_list.append({
                    "x": landmark.x,
                    "y": landmark.y,
                    "z": landmark.z
                })
            hand_data["landmarks"].append(landmarks_list)
            
            # Get key landmarks
            thumb_tip = hand_landmarks.landmark[4]
            index_tip = hand_landmarks.landmark[8]
            index_mcp = hand_landmarks.landmark[5]  # Index finger base
            middle_tip = hand_landmarks.landmark[12]
            ring_tip = hand_landmarks.landmark[16]
            pinky_tip = hand_landmarks.landmark[20]
            
            # Pinch detection (thumb + index close)
            pinch_distance = math.sqrt(
                (thumb_tip.x - index_tip.x)**2 + 
                (thumb_tip.y - index_tip.y)**2
            )
            
            # Pointing detection (only index extended, others closed)
            index_extended = index_tip.y < index_mcp.y - 0.05
            middle_closed = middle_tip.y > index_mcp.y
            ring_closed = ring_tip.y > index_mcp.y
            pinky_closed = pinky_tip.y > index_mcp.y
            
            # Set gesture and pointer position
            if pinch_distance < 0.05:
                hand_data["gesture"] = "pinch"
            elif index_extended and middle_closed and ring_closed and pinky_closed:
                hand_data["gesture"] = "pointing"
                hand_data["pointer_position"] = {
                    "x": index_tip.x,
                    "y": index_tip.y
                }
                # Draw pointer indicator on frame
                h, w = frame.shape[:2]
                px, py = int(index_tip.x * w), int(index_tip.y * h)
                cv2.circle(frame, (px, py), 15, (0, 255, 0), 3)
                cv2.circle(frame, (px, py), 5, (0, 255, 0), -1)
            else:
                hand_data["gesture"] = "open"
    
    return frame, hand_data

def encode_frame_to_base64(frame: np.ndarray) -> str:
    """Encode frame to base64 string"""
    _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
    jpg_as_text = base64.b64encode(buffer).decode('utf-8')
    return jpg_as_text

# ============================================================================
# REST API ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    return {
        "message": "SOLVIA Backend API - Solution Vision-driven Integrated Analytics",
        "version": "1.0.0",
        "status": "running",
        "features": {
            "chemistry_engine": True,
            "hand_gestures": True,
            "fall_detection": yolo_available
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "websocket": "active",
            "mediapipe_hands": True,
            "yolov5_fall_detection": yolo_available,
            "chemistry_engine": True
        }
    }

@app.get("/api/model/info")
async def model_info():
    """Get information about the loaded YOLOv5 model"""
    if yolo_available:
        return {
            "model_loaded": True,
            "model_path": "models/best.pt",
            "accuracy": "95.3% mAP@50",
            "training_data": "Fall/Non-fall dataset (7929 train images)",
            "classes": ["non_fall (94.6%)", "fall (95.9%)"],
            "epochs_trained": 22,
            "best_epoch": 11,
            "precision": "96.3%",
            "recall": "94.3%"
        }
    return {
        "model_loaded": False,
        "reason": "Model file not found or failed to load",
        "fallback": "Fall detection disabled"
    }

@app.get("/api/chemicals")
async def get_chemicals():
    """Get list of all available chemicals"""
    return {
        "chemicals": {
            chem_id: chem.dict() for chem_id, chem in CHEMICALS_DATABASE.items()
        }
    }

@app.post("/api/mixture/add")
async def add_chemical_to_mixture(request: AddChemicalRequest):
    """Add chemical to mixture"""
    success = chemistry_engine.add_chemical(
        request.chemical_id,
        request.volume,
        request.molarity
    )
    
    if not success:
        raise HTTPException(status_code=400, detail="Invalid chemical ID")
    
    # Add to reaction log
    timestamp = datetime.now().strftime("%H:%M:%S")
    chem = CHEMICALS_DATABASE[request.chemical_id]
    reaction_log.append({
        "id": len(reaction_log) + 1,
        "time": timestamp,
        "reaction": f"Added {request.volume}mL of {chem.name} ({request.molarity}M)"
    })
    
    return {
        "success": True,
        "mixture_state": chemistry_engine.get_state(),
        "reaction_log": reaction_log[-10:]  # Last 10 entries
    }

@app.get("/api/mixture/state")
async def get_mixture_state():
    """Get current mixture state"""
    return {
        "mixture_state": chemistry_engine.get_state(),
        "reaction_log": reaction_log[-10:]
    }

@app.post("/api/mixture/reset")
async def reset_mixture_endpoint():
    """Reset mixture to initial state"""
    chemistry_engine.reset()
    reaction_log.clear()
    
    timestamp = datetime.now().strftime("%H:%M:%S")
    reaction_log.append({
        "id": 1,
        "time": timestamp,
        "reaction": "Lab reset - mixture cleared"
    })
    
    return {
        "success": True,
        "mixture_state": chemistry_engine.get_state(),
        "message": "Mixture reset successfully"
    }

@app.get("/api/safety/status")
async def get_safety_status():
    """Get current safety status"""
    return {
        "safety_status": current_safety_status,
        "yolov5_enabled": yolo_model is not None,
        "timestamp": datetime.now().isoformat()
    }

# ============================================================================
# WEBSOCKET ENDPOINT
# ============================================================================

@app.websocket("/ws/camera")
async def websocket_camera_endpoint(websocket: WebSocket):
    """WebSocket endpoint for streaming camera feed with MediaPipe and YOLOv5"""
    await websocket.accept()
    
    # Open camera
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        await websocket.send_json({
            "error": "Could not open camera"
        })
        await websocket.close()
        return
    
    try:
        while True:
            # Read frame from camera
            ret, frame = cap.read()
            
            if not ret:
                await websocket.send_json({
                    "error": "Failed to read frame"
                })
                break
            
            # Process frame with complete pipeline (YOLOv5 + MediaPipe)
            processed_frame, hand_data, safety_status = process_frame_complete(frame)
            
            # Add mixture info overlay
            h, w = processed_frame.shape[:2]
            
            # pH display
            cv2.putText(
                processed_frame,
                f"pH: {chemistry_engine.current_pH:.2f}",
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 255),
                2
            )
            
            # Safety status display
            status_color = (0, 255, 0) if safety_status == "safe" else (0, 0, 255)
            cv2.putText(
                processed_frame,
                f"Status: {safety_status.upper()}",
                (10, 70),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                status_color,
                2
            )
            
            # YOLOv5 status
            if yolo_model:
                cv2.putText(
                    processed_frame,
                    "YOLOv5: Active",
                    (10, h - 20),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 255, 0),
                    1
                )
            
            # Encode frame to base64
            frame_base64 = encode_frame_to_base64(processed_frame)
            
            # Send data to frontend
            await websocket.send_json({
                "frame": frame_base64,
                "hand_data": hand_data,
                "mixture_state": chemistry_engine.get_state().dict(),
                "safety_status": safety_status,
                "fall_detection": {
                    "enabled": yolo_model is not None,
                    "person_detected": last_person_bbox is not None,
                    "is_fallen": last_person_bbox.get("is_fallen", False) if last_person_bbox else False
                },
                "timestamp": datetime.now().isoformat()
            })
            
            # Control frame rate (30 FPS)
            await asyncio.sleep(1/30)
            
    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print(f"Error in WebSocket: {e}")
    finally:
        cap.release()
        await websocket.close()

# ============================================================================
# STARTUP EVENT
# ============================================================================

@app.on_event("startup")
async def startup_event():
    print("🚀 SOLVIA Backend Server Started")
    print("📡 WebSocket endpoint: ws://localhost:8000/ws/camera")
    print("📊 API documentation: http://localhost:8000/docs")
    if yolo_model:
        print("🤖 YOLOv5 Fall Detection: ENABLED")
    else:
        print("⚠️  YOLOv5 Fall Detection: DISABLED (model not loaded)")
    print("👋 MediaPipe Hands: ENABLED")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
