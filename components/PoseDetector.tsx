import React, { useRef, useEffect } from "react";
import { Pose } from "@mediapipe/pose";
import "@mediapipe/pose/pose.css";

export default function PoseDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (results.segmentationMask) {
        ctx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);
      }
      if (results.poseLandmarks) {
        for (const landmark of results.poseLandmarks) {
          ctx.beginPath();
          ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
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
            await pose.send({ image: video });
            requestAnimationFrame(detect);
          };
          detect();
        };
      }
    };

    startCamera();

    return () => {
      // Cleanup: stop camera
      const video = videoRef.current;
      if (video && video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ width: 640, height: 480 }} />
    </div>
  );
}
