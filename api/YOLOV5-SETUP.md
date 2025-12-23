# 🔥 YOLOv5 Installation Guide

## Quick Install (Recommended)

### For CPU Only:
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

### For NVIDIA GPU (CUDA 11.8):
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

### For NVIDIA GPU (CUDA 12.1):
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
```

---

## Full Backend Installation

```bash
cd api

# Install PyTorch first (choose CPU or GPU version above)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Install remaining dependencies
pip install -r requirements.txt
```

---

## Testing YOLOv5

```bash
# Start backend
python main.py

# You should see:
# 🔄 Loading YOLOv5 model...
# ✅ YOLOv5 model loaded successfully!
# 🤖 YOLOv5 Fall Detection: ENABLED
```

---

## Troubleshooting

### Error: "No module named 'torch'"
```bash
pip install torch torchvision
```

### Error: "Could not load YOLOv5 model"
```bash
# Make sure you have internet connection (downloads model on first run)
# Or manually download:
python -c "import torch; torch.hub.load('ultralytics/yolov5', 'yolov5n')"
```

### Slow on CPU
- YOLOv5n is optimized for CPU but may be slower than GPU
- Consider using GPU version if available
- First run will be slower (downloads model ~4MB)

---

## Fall Detection Algorithm

**Logic:**
1. Detect person using YOLOv5 (class 0)
2. Calculate bounding box aspect ratio: `width / height`
3. If ratio > 1.3 → Person is **fallen** (lying down)
4. If ratio < 1.3 → Person is **standing** (normal)

**Visual Indicators:**
- Green box = Safe (standing)
- Red box = Alert (fallen)

---

## Performance

- **Model**: YOLOv5n (nano, ~4MB)
- **FPS**: 20-30 FPS on CPU
- **Accuracy**: High for person detection
- **Latency**: ~30-50ms per frame

---

**Note**: First run will download YOLOv5 model (~4MB) from PyTorch Hub.
