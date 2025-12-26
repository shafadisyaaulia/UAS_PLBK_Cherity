import React, { useRef, useEffect } from "react";
import { Hands } from "@mediapipe/hands";

// Simple callback interface for gesture events
interface HandDetectorProps {
  onPinch?: (pointer: { x: number; y: number }) => void;
  onPoint?: (pointer: { x: number; y: number }) => void;
}

export default function HandDetector({ onPinch, onPoint }: HandDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        // Draw landmarks
        for (const lm of landmarks) {
          ctx.beginPath();
          ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "#00ff00";
          ctx.fill();
        }
        // Gesture detection: pinch (thumb tip & index tip close)
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const dx = thumbTip.x - indexTip.x;
        const dy = thumbTip.y - indexTip.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const pointer = { x: indexTip.x, y: indexTip.y };
        if (dist < 0.06 && onPinch) {
          onPinch(pointer);
        } else if (onPoint) {
          onPoint(pointer);
        }
      }
    });

    const startCamera = async () => {
      const video = videoRef.current;
      if (video) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.play();
        video.onloadedmetadata = () => {
          video.width = 640;
          video.height = 480;
          canvasRef.current!.width = 640;
          canvasRef.current!.height = 480;
          const detect = async () => {
            await hands.send({ image: video });
            requestAnimationFrame(detect);
          };
          detect();
        };
      }
    };
    startCamera();
    return () => {
      const video = videoRef.current;
      if (video && video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      }
    };
  }, [onPinch, onPoint]);

  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ width: 640, height: 480 }} />
    </div>
  );
}
