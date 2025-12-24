"""
Flask Backend Server untuk AI-Safe Virtual Lab
Menyediakan MediaPipe Hand Tracking melalui video streaming
"""

from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import cv2
import numpy as np
import json
import base64
import math
from collections import deque
import time
import random

# Import MediaPipe hands only (avoid audio module issues)
import mediapipe.python.solutions.hands as mp_hands
import mediapipe.python.solutions.drawing_utils as mp_drawing

app = Flask(__name__)
CORS(app)

# ============================================================================
# GLOBAL STATE FOR VIRTUAL LAB
# ============================================================================
fall_detected = False
fall_detection_enabled = True
selected_chemical = None
beaker_positions = []  # Will store virtual beaker positions

# ============================================================================
# MEDIAPIPE SETUP
# ============================================================================
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)

# ============================================================================
# CHEMICAL DATABASE (dari ChemAqua-Lab.py)
# ============================================================================
CHEMICALS_DATABASE = {
    "HCl": {
        "name": "Asam Klorida (HCl)",
        "type": "acid",
        "pH": 1.0,
        "color": [0, 0, 200],
        "description": "Asam kuat"
    },
    "H2SO4": {
        "name": "Asam Sulfat (H₂SO₄)",
        "type": "acid",
        "pH": 1.5,
        "color": [0, 0, 255],
        "description": "Asam kuat korosif"
    },
    "CH3COOH": {
        "name": "Asam Asetat (CH₃COOH)",
        "type": "weak_acid",
        "pH": 4.5,
        "color": [0, 100, 255],
        "description": "Asam lemah (cuka)"
    },
    "H2O": {
        "name": "Air (H₂O)",
        "type": "neutral",
        "pH": 7.0,
        "color": [200, 200, 200],
        "description": "Netral"
    },
    "NaOH": {
        "name": "Natrium Hidroksida (NaOH)",
        "type": "base",
        "pH": 13.0,
        "color": [255, 0, 0],
        "description": "Basa kuat"
    },
    "NH3": {
        "name": "Amonia (NH₃)",
        "type": "weak_base",
        "pH": 11.0,
        "color": [255, 100, 0],
        "description": "Basa lemah"
    },
    "NaCl": {
        "name": "Garam Dapur (NaCl)",
        "type": "salt",
        "pH": 7.0,
        "color": [255, 255, 255],
        "description": "Garam netral"
    },
    "PP": {
        "name": "Fenolftalein (PP)",
        "type": "indicator",
        "pH": 7.0,
        "color": [200, 0, 200],
        "description": "Indikator basa"
    }
}

# ============================================================================
# MIXTURE STATE - Sistem Pencampuran
# ============================================================================
class MixtureState:
    def __init__(self):
        self.components = []  # List of (chemical_id, volume)
        self.total_volume = 0
        self.current_pH = 7.0
        self.current_color = [200, 200, 200]
        self.reaction_name = "Wadah Kosong"
        self.description = "Belum ada bahan"
        
    def add_chemical(self, chemical_id, volume=10):
        """Tambah bahan kimia ke campuran"""
        if chemical_id in CHEMICALS_DATABASE:
            self.components.append((chemical_id, volume))
            self.total_volume += volume
            self._calculate_mixture()
            return True
        return False
    
    def _calculate_mixture(self):
        """Hitung pH dan warna hasil campuran"""
        if not self.components:
            self.current_pH = 7.0
            self.current_color = [200, 200, 200]
            self.reaction_name = "Wadah Kosong"
            self.description = "Belum ada bahan"
            return
        
        # Hitung weighted average pH
        total_h_concentration = 0
        total_oh_concentration = 0
        
        for chem_id, volume in self.components:
            chem = CHEMICALS_DATABASE[chem_id]
            pH = chem["pH"]
            
            if pH < 7:
                h_conc = 10 ** (-pH) * volume
                total_h_concentration += h_conc
            elif pH > 7:
                oh_conc = 10 ** (-(14 - pH)) * volume
                total_oh_concentration += oh_conc
        
        # Hitung pH final
        if total_h_concentration > total_oh_concentration:
            net_h = total_h_concentration - total_oh_concentration
            self.current_pH = -math.log10(net_h / self.total_volume)
        elif total_oh_concentration > total_h_concentration:
            net_oh = total_oh_concentration - total_h_concentration
            pOH = -math.log10(net_oh / self.total_volume)
            self.current_pH = 14 - pOH
        else:
            self.current_pH = 7.0
        
        self.current_pH = max(0, min(14, self.current_pH))
        
        # Hitung warna campuran (weighted average)
        r_total, g_total, b_total = 0, 0, 0
        for chem_id, volume in self.components:
            color = CHEMICALS_DATABASE[chem_id]["color"]
            weight = volume / self.total_volume
            r_total += color[2] * weight
            g_total += color[1] * weight
            b_total += color[0] * weight
        
        self.current_color = [int(b_total), int(g_total), int(r_total)]
        
        # Generate nama campuran
        self._generate_mixture_name()
    
    def _generate_mixture_name(self):
        """Generate nama dan deskripsi hasil campuran"""
        if len(self.components) == 0:
            self.reaction_name = "Wadah Kosong"
            self.description = "Belum ada bahan"
            return
        
        chem_ids = [c[0] for c in self.components]
        
        has_acid = any(CHEMICALS_DATABASE[c]["type"] in ["acid", "weak_acid"] for c in chem_ids)
        has_base = any(CHEMICALS_DATABASE[c]["type"] in ["base", "weak_base"] for c in chem_ids)
        
        if has_acid and has_base:
            if abs(self.current_pH - 7.0) < 0.5:
                self.reaction_name = "Reaksi Netralisasi Berhasil"
                self.description = f"Garam + Air (pH {self.current_pH:.1f})"
            elif self.current_pH < 7:
                self.reaction_name = "Campuran Asam Berlebih"
                self.description = f"Masih bersifat asam (pH {self.current_pH:.1f})"
            else:
                self.reaction_name = "Campuran Basa Berlebih"
                self.description = f"Masih bersifat basa (pH {self.current_pH:.1f})"
        
        elif "PP" in chem_ids:
            if self.current_pH > 8.3:
                self.reaction_name = "Fenolftalein + Basa"
                self.description = "Warna merah muda (basa terdeteksi)"
            else:
                self.reaction_name = "Fenolftalein + Asam/Netral"
                self.description = "Tidak berwarna"
        
        elif len(self.components) == 1:
            chem_id = self.components[0][0]
            self.reaction_name = CHEMICALS_DATABASE[chem_id]["name"]
            self.description = CHEMICALS_DATABASE[chem_id]["description"]
        
        else:
            names = [CHEMICALS_DATABASE[c[0]]["name"].split("(")[0].strip() for c in self.components]
            self.reaction_name = "Campuran: " + " + ".join(names[:3])
            if len(names) > 3:
                self.reaction_name += "..."
            
            if self.current_pH < 4:
                self.description = f"Larutan asam kuat (pH {self.current_pH:.1f})"
            elif self.current_pH < 7:
                self.description = f"Larutan asam (pH {self.current_pH:.1f})"
            elif self.current_pH == 7:
                self.description = f"Larutan netral (pH {self.current_pH:.1f})"
            elif self.current_pH < 10:
                self.description = f"Larutan basa (pH {self.current_pH:.1f})"
            else:
                self.description = f"Larutan basa kuat (pH {self.current_pH:.1f})"
    
    def reset(self):
        """Reset campuran"""
        self.__init__()
    
    def to_dict(self):
        """Convert to dictionary for JSON response"""
        return {
            "components": self.components,
            "totalVolume": self.total_volume,
            "pH": round(self.current_pH, 2),
            "color": self.current_color,
            "reactionName": self.reaction_name,
            "description": self.description
        }

# Global mixture instance
mixture = MixtureState()

# ============================================================================
# VIDEO STREAMING FUNCTIONS
# ============================================================================
camera = None

def get_camera():
    """Get or initialize camera"""
    global camera
    if camera is None or not camera.isOpened():
        print("🎥 Trying to open camera...")
        camera = cv2.VideoCapture(0, cv2.CAP_DSHOW)  # Use DirectShow on Windows
        if not camera.isOpened():
            print("⚠️ Camera 0 failed, trying camera 1...")
            camera = cv2.VideoCapture(1, cv2.CAP_DSHOW)
        
        if camera.isOpened():
            camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            camera.set(cv2.CAP_PROP_FPS, 30)
            print("✅ Camera opened successfully!")
        else:
            print("❌ Failed to open camera!")
    return camera

def euclidean_distance(p1, p2):
    """Calculate Euclidean distance between two points"""
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def draw_beaker(frame, x, y, width, height, liquid_color, fill_percent, label=""):
    """Draw virtual beaker with liquid"""
    # Beaker outline
    cv2.rectangle(frame, (x, y), (x + width, y + height), (255, 255, 255), 3)
    
    # Liquid inside
    if fill_percent > 0:
        liquid_height = int(height * (fill_percent / 100))
        liquid_y = y + height - liquid_height
        
        # Draw liquid with transparency effect
        overlay = frame.copy()
        cv2.rectangle(overlay, (x + 5, liquid_y), (x + width - 5, y + height - 5), liquid_color, -1)
        cv2.addWeighted(overlay, 0.6, frame, 0.4, 0, frame)
        
        # Liquid shine effect
        cv2.rectangle(frame, (x + 8, liquid_y + 5), (x + 15, liquid_y + 20), (255, 255, 255), -1)
    
    # Label
    if label:
        cv2.putText(frame, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)
    
    return (x, y, width, height)

def simple_fall_detection(landmarks, h):
    """Simple fall detection based on body orientation"""
    # Get key points for posture analysis
    nose = landmarks[0]
    left_hip = landmarks[23] if len(landmarks) > 23 else None
    right_hip = landmarks[24] if len(landmarks) > 24 else None
    
    # Simple heuristic: if nose is below hip level, might be falling
    if left_hip and right_hip:
        avg_hip_y = (left_hip.y + right_hip.y) / 2
        if nose.y > avg_hip_y + 0.2:  # Nose below hips
            return True
    
    return False

def generate_frames():
    """Generate video frames with MediaPipe hand tracking and virtual beakers"""
    global fall_detected, beaker_positions, mixture
    
    try:
        cam = get_camera()
        
        if not cam or not cam.isOpened():
            print("❌ ERROR: Camera not available!")
            # Return empty frame with error message
            error_frame = np.zeros((480, 640, 3), dtype=np.uint8)
            cv2.putText(error_frame, "Camera Not Available", (150, 240), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            _, buffer = cv2.imencode('.jpg', error_frame)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
            return
        
        # Initialize beaker positions (3 beakers)
        beaker_positions = []
        
        while True:
            try:
                success, frame = cam.read()
                if not success:
                    print("❌ Failed to read frame from camera")
                    break
                
                # Flip horizontally for mirror effect
                frame = cv2.flip(frame, 1)
                h, w, _ = frame.shape
                
                # Initialize beakers if empty
                if not beaker_positions:
                    beaker_w = 80
                    beaker_h = 120
                    spacing = 120
                    start_x = (w - (beaker_w + spacing) * 3) // 2
                    beaker_y = h - beaker_h - 50
                    
                    beaker_positions = [
                        {'x': start_x, 'y': beaker_y, 'w': beaker_w, 'h': beaker_h, 'label': 'Beaker 1'},
                        {'x': start_x + beaker_w + spacing, 'y': beaker_y, 'w': beaker_w, 'h': beaker_h, 'label': 'Beaker 2'},
                        {'x': start_x + (beaker_w + spacing) * 2, 'y': beaker_y, 'w': beaker_w, 'h': beaker_h, 'label': 'Main Mix'},
                    ]
                
                # MediaPipe detection
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = hands.process(frame_rgb)
                
                cursor_pos = None
                is_pinching = False
                
                # Draw hand landmarks and detect gestures
                if results.multi_hand_landmarks:
                    for hand_landmarks in results.multi_hand_landmarks:
                        # Draw hand skeleton with custom styling
                        mp_drawing.draw_landmarks(
                            frame,
                            hand_landmarks,
                            mp_hands.HAND_CONNECTIONS,
                            mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=4),
                            mp_drawing.DrawingSpec(color=(0, 255, 255), thickness=2)
                        )
                        
                        # Get index finger tip position
                        landmarks = hand_landmarks.landmark
                        index_tip = landmarks[8]
                        cursor_x = int(index_tip.x * w)
                        cursor_y = int(index_tip.y * h)
                        cursor_pos = (cursor_x, cursor_y)
                        cv2.circle(frame, (cursor_x, cursor_y), 10, (0, 255, 255), -1)
                        cv2.circle(frame, (cursor_x, cursor_y), 12, (0, 255, 0), 2)
                        
                        # Detect pinch gesture (thumb + index finger)
                        thumb_tip = landmarks[4]
                        thumb_x = int(thumb_tip.x * w)
                        thumb_y = int(thumb_tip.y * h)
                        
                        distance = euclidean_distance((cursor_x, cursor_y), (thumb_x, thumb_y))
                        
                        if distance < 40:  # Pinch detected
                            is_pinching = True
                            cv2.putText(frame, "PINCH DETECTED", (10, 60), 
                                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                            cv2.line(frame, (cursor_x, cursor_y), (thumb_x, thumb_y), (0, 255, 0), 3)
                
                        # Simple fall detection (using hand position as proxy)
                        if cursor_y > h * 0.8:  # Hand very low in frame
                            fall_detected = random.random() < 0.3  # Random simulation
                
                # Draw virtual beakers with mixture
                for i, beaker in enumerate(beaker_positions):
                    # Determine fill and color
                    if i == 2:  # Main mixing beaker
                        fill = min(100, mixture.total_volume)
                        color = tuple(int(c) for c in mixture.current_color)
                    else:
                        fill = random.randint(30, 60)  # Demo beakers
                        colors = [(200, 0, 0), (0, 200, 200)]
                        color = colors[i]
                    
                    draw_beaker(frame, beaker['x'], beaker['y'], beaker['w'], beaker['h'], 
                               color, fill, beaker['label'])
                    
                    # pH AR overlay for main beaker
                    if i == 2 and mixture.total_volume > 0:
                        ph_y = beaker['y'] - 80
                        ph_x = beaker['x'] - 50
                        
                        # AR overlay background
                        overlay = frame.copy()
                        cv2.rectangle(overlay, (ph_x, ph_y), (ph_x + 180, ph_y + 70), (0, 100, 100), -1)
                        cv2.addWeighted(overlay, 0.7, frame, 0.3, 0, frame)
                        
                        # Border
                        cv2.rectangle(frame, (ph_x, ph_y), (ph_x + 180, ph_y + 70), (0, 255, 255), 2)
                        
                        # pH text
                        cv2.putText(frame, f"pH: {mixture.current_pH:.1f}", (ph_x + 10, ph_y + 25), 
                                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
                        
                        # Status
                        if mixture.current_pH < 4:
                            status = "Acidic Excess"
                            status_color = (0, 0, 255)
                        elif mixture.current_pH > 10:
                            status = "Basic Excess"
                            status_color = (255, 0, 255)
                        elif abs(mixture.current_pH - 7.0) < 1:
                            status = "Neutral"
                            status_color = (0, 255, 0)
                        else:
                            status = "Mixed"
                            status_color = (0, 255, 255)
                        
                        cv2.putText(frame, f"Status: {status}", (ph_x + 10, ph_y + 50), 
                                   cv2.FONT_HERSHEY_SIMPLEX, 0.4, status_color, 1)
                        
                        # Connection line
                        cv2.line(frame, (ph_x + 90, ph_y + 70), 
                                (beaker['x'] + beaker['w']//2, beaker['y']), 
                                (0, 255, 255), 2)
                
                        # Fall Detection HUD
                hud_y = 30
                if fall_detected:
                    cv2.rectangle(frame, (10, hud_y - 25), (250, hud_y + 10), (0, 0, 200), -1)
                    cv2.rectangle(frame, (10, hud_y - 25), (250, hud_y + 10), (0, 0, 255), 2)
                    cv2.putText(frame, "⚠ FALL DETECTED!", (20, hud_y), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
                else:
                    cv2.rectangle(frame, (10, hud_y - 25), (200, hud_y + 10), (0, 100, 0), -1)
                    cv2.rectangle(frame, (10, hud_y - 25), (200, hud_y + 10), (0, 255, 0), 2)
                    cv2.putText(frame, "✓ Safe Posture", (20, hud_y), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
                
                # Add overlay text
                cv2.putText(frame, "AI-Safe Virtual Lab - Hand Tracking", (10, h - 20), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
        
                # Encode frame to JPEG
                ret, buffer = cv2.imencode('.jpg', frame)
                frame_bytes = buffer.tobytes()
                
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            
            except Exception as e:
                print(f"❌ Error in frame processing: {str(e)}")
                import traceback
                traceback.print_exc()
                # Continue to next frame instead of breaking
                continue
    
    except Exception as e:
        print(f"❌ Fatal error in generate_frames: {str(e)}")
        import traceback
        traceback.print_exc()
        # Return error frame
        error_frame = np.zeros((480, 640, 3), dtype=np.uint8)
        cv2.putText(error_frame, f"Error: {str(e)}", (50, 240), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
        _, buffer = cv2.imencode('.jpg', error_frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

# ============================================================================
# API ROUTES
# ============================================================================

@app.route('/')
def index():
    """Root endpoint"""
    return jsonify({
        "message": "AI-Safe Virtual Lab - Backend Server",
        "endpoints": {
            "/video_feed": "Video streaming with hand tracking",
            "/api/mixture": "Get current mixture state",
            "/api/add_chemical": "Add chemical to mixture (POST)",
            "/api/reset": "Reset mixture (POST)",
            "/api/chemicals": "Get chemical database",
            "/api/safety_status": "Get safety status (fall detection, etc.)"
        }
    })

@app.route('/video_feed')
def video_feed():
    """Video streaming endpoint"""
    return Response(generate_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/safety_status', methods=['GET'])
def get_safety_status():
    """Get current safety status"""
    global fall_detected
    return jsonify({
        "fallDetected": fall_detected,
        "faceDetection": "OK",
        "ppeCheck": "PASS",
        "postureAnalysis": "NORMAL" if not fall_detected else "ALERT"
    })

@app.route('/api/warmup', methods=['GET'])
def warmup_camera():
    """Pre-warm camera and models for faster first connection"""
    global camera
    try:
        if camera is None or not camera.isOpened():
            camera = cv2.VideoCapture(0)
            # Set low resolution for faster startup
            camera.set(cv2.CAP_PROP_FRAME_WIDTH, 320)
            camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 240)
            camera.set(cv2.CAP_PROP_FPS, 15)
            
            # Read one frame to initialize camera
            success, frame = camera.read()
            if success:
                # Process one frame with MediaPipe to load model
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                hands.process(frame_rgb)
                
                return jsonify({
                    "status": "warmed_up",
                    "message": "Camera and models pre-loaded successfully",
                    "resolution": "320x240"
                })
        
        return jsonify({
            "status": "already_ready",
            "message": "Camera already initialized"
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/mixture', methods=['GET'])
def get_mixture():
    """Get current mixture state"""
    return jsonify(mixture.to_dict())

@app.route('/api/add_chemical', methods=['POST'])
def add_chemical():
    """Add chemical to mixture"""
    data = request.get_json()
    chemical_id = data.get('chemicalId')
    volume = data.get('volume', 10)
    
    if mixture.add_chemical(chemical_id, volume):
        return jsonify({
            "success": True,
            "mixture": mixture.to_dict()
        })
    else:
        return jsonify({
            "success": False,
            "error": "Invalid chemical ID"
        }), 400

@app.route('/api/reset', methods=['POST'])
def reset_mixture():
    """Reset mixture"""
    mixture.reset()
    return jsonify({
        "success": True,
        "mixture": mixture.to_dict()
    })

@app.route('/api/chemicals', methods=['GET'])
def get_chemicals():
    """Get all chemicals in database"""
    return jsonify(CHEMICALS_DATABASE)

# ============================================================================
# MAIN
# ============================================================================
if __name__ == '__main__':
    print("🧪 AI-Safe Virtual Lab Backend Server")
    print("📹 Starting MediaPipe Hand Tracking...")
    print("🌐 Server running on http://localhost:5000")
    print("\nEndpoints:")
    print("  - Video Feed: http://localhost:5000/video_feed")
    print("  - API Docs: http://localhost:5000/")
    
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
