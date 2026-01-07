"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import { 
  FlaskConical, Zap, FileText, RefreshCw, 
  ShieldAlert, Info, CheckCircle2
} from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const CHEMICALS = [
  { id: 'hcl', name: 'HCl', fullName: 'Asam Klorida', ph: 1.0, color: "#ff4d4d", fact: "Cairan ini juga ada di lambungmu untuk mencerna makanan!" },
  { id: 'vinegar', name: 'CH3COOH', fullName: 'Asam Asetat', ph: 3.0, color: "#ffcc00", fact: "Ini adalah bahan utama cuka makan. Baunya sangat tajam!" },
  { id: 'h2o', name: 'H2O', fullName: 'Air Murni', ph: 7.0, color: "#22c55e", fact: "Air murni bersifat netral. Tubuhmu 70% terdiri dari air." },
  { id: 'koh', name: 'KOH', fullName: 'Kalium Hidroksida', ph: 12.5, color: "#3b82f6", fact: "Sering digunakan sebagai bahan pembuat sabun mandi." },
  { id: 'naoh', name: 'NaOH', fullName: 'Natrium Hidroksida', ph: 13.7, color: "#a855f7", fact: "Dikenal sebagai soda api, bisa melarutkan sumbatan pipa!" },
];

const getPhColor = (ph: number) => {
  if (ph <= 3) return "#ff4d4d"; 
  if (ph <= 6) return "#ffcc00"; 
  if (ph >= 6.5 && ph <= 7.5) return "#22c55e"; 
  if (ph <= 11) return "#3b82f6"; 
  return "#a855f7"; 
};

export default function CheritySMPEdition() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'drag' | 'cv'>('drag');
  const [phValue, setPhValue] = useState(7.0);
  const [volume, setVolume] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [isHandDetected, setIsHandDetected] = useState(false);
  const [hoverTarget, setHoverTarget] = useState<string | null>(null);
  const [hoverProgress, setHoverProgress] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  const mixChemical = useCallback((id: string) => {
    const chem = CHEMICALS.find(c => c.id === id);
    if (!chem) return;
    setPhValue(prev => Math.round(((prev * 0.7) + (chem.ph * 0.3)) * 100) / 100);
    setVolume(v => Math.min(v + 10, 100));
    setHistory(prev => [...prev, { ...chem, time: new Date().toLocaleTimeString('id-ID'), volAdded: "10mL" }]);
  }, []);

  // AI VISION ENGINE WITH DRAWING UTILS
  useEffect(() => {
    if (mode !== 'cv') return;
    let camera: any;

    const setupAI = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const { Hands, HAND_CONNECTIONS } = await import('@mediapipe/hands');
      const { Camera: MpCamera } = await import('@mediapipe/camera_utils');
      const { drawConnectors, drawLandmarks } = await import('@mediapipe/drawing_utils');
      
      const hands = new Hands({ 
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` 
      });

      hands.setOptions({ 
        maxNumHands: 1, 
        modelComplexity: 1, 
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
      });

      hands.onResults((results: any) => {
        const canvasCtx = canvasRef.current!.getContext('2d');
        if (!canvasCtx) return;

        // 1. Clear Canvas & Mirroring
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          setIsHandDetected(true);
          
          for (const landmarks of results.multiHandLandmarks) {
            // 2. Menggambar Garis Sendi (Neon Style)
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
              color: '#00ffff',
              lineWidth: 3
            });
            
            // 3. Menggambar Titik Sendi
            drawLandmarks(canvasCtx, landmarks, {
              color: '#ff00ff',
              lineWidth: 1,
              radius: 4
            });

            // 4. Deteksi Interaksi (Ujung Jari Telunjuk - Landmark 8)
            const indexTip = landmarks[8];
            const x = (1 - indexTip.x) * 100; // Inverse karena video mirror
            const y = indexTip.y * 100;

            // Efek Glow di Jari
            canvasCtx.beginPath();
            canvasCtx.arc(indexTip.x * canvasRef.current!.width, indexTip.y * canvasRef.current!.height, 15, 0, 2 * Math.PI);
            canvasCtx.fillStyle = "rgba(0, 255, 255, 0.3)";
            canvasCtx.fill();

            if (y > 75) {
              const sectorSize = 100 / CHEMICALS.length;
              const sector = Math.floor(x / sectorSize);
              const target = CHEMICALS[sector]?.id;
              
              if (target) {
                setHoverTarget(target);
                setHoverProgress(p => {
                  if (p >= 100) {
                    mixChemical(target);
                    return 0;
                  }
                  return p + 4; // Kecepatan mengisi
                });
              }
            } else {
              setHoverTarget(null);
              setHoverProgress(0);
            }
          }
        } else {
          setIsHandDetected(false);
          setHoverTarget(null);
          setHoverProgress(0);
        }
        canvasCtx.restore();
      });

      camera = new MpCamera(videoRef.current, { 
        onFrame: async () => {
          if (videoRef.current) await hands.send({ image: videoRef.current });
        }, 
        width: 1280, 
        height: 720 
      });
      camera.start();
    };

    setupAI();
    return () => { if (camera) camera.stop(); };
  }, [mode, mixChemical]);

  // PDF Export Logic (Stable)
  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "JPEG", 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`Laporan_Cherity_${Date.now()}.pdf`);
  };

  if (!mounted) return null;
// --- TAMBAHKAN BARIS INI ---
  const currentChemInfo = CHEMICALS.find(c => c.id === hoverTarget) || 
                          CHEMICALS.find(c => c.id === history[history.length - 1]?.id);
  // ---------------------------
  return (
    <div className="min-h-screen bg-[#02040a] text-white p-4 font-sans overflow-hidden">
      {/* NAVBAR AT THE TOP */}
      <Navigation />
      
      {/* HEADER REMOVED: digantikan oleh Navigation di atas */}

      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-120px)] mt-20">
        {/* MAIN SIMULATOR */}
        <div className="col-span-8 relative bg-black rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
          {/* Mode Switcher & Export PDF at top-right */}
          <div className="absolute top-6 right-8 z-30 flex gap-3">
            <div className="flex bg-black/50 p-1 rounded-xl border border-white/10">
              <button onClick={() => setMode('drag')} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${mode === 'drag' ? 'bg-cyan-600' : 'text-slate-500'}`}>MOUSE</button>
              <button onClick={() => setMode('cv')} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${mode === 'cv' ? 'bg-purple-600' : 'text-slate-500'}`}>AI VISION</button>
            </div>
            <button onClick={handleExportPDF} className="bg-white text-black px-5 py-1.5 rounded-xl text-[10px] font-black hover:bg-cyan-400 transition-colors">EXPORT PDF</button>
          </div>
          <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 -scale-x-100" />
          {/* CANVAS UNTUK DRAWING SKELETON */}
          <canvas ref={canvasRef} width={1280} height={720} className="absolute inset-0 w-full h-full object-cover -scale-x-100 z-10 pointer-events-none" />
          
          {/* UI HUD: pH SENSOR */}
          <div className="absolute top-10 left-10 z-20">
            <div className="bg-black/80 backdrop-blur-xl p-8 rounded-[2.5rem] border-t border-l border-white/20 shadow-2xl" style={{ borderLeft: `8px solid ${getPhColor(phValue)}` }}>
              <p className="text-[10px] font-black text-cyan-500 tracking-[0.2em] mb-1">ANALYSIS ACTIVE</p>
              <h2 className="text-7xl font-black tracking-tighter mb-2">{phValue.toFixed(1)}</h2>
              <div className="text-[11px] font-bold px-4 py-1.5 rounded-full inline-block" style={{ backgroundColor: getPhColor(phValue), color: 'black' }}>
                {phValue < 7 ? 'ACIDIC' : phValue > 7 ? 'ALKALINE' : 'NEUTRAL'}
              </div>
            </div>
          </div>

          {/* THE BEAKER */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-72 border-x-[6px] border-b-[6px] border-white/20 rounded-b-[70px] relative overflow-hidden bg-white/5 backdrop-blur-[2px] shadow-inner">
              <div className="absolute bottom-0 w-full transition-all duration-700 ease-out" style={{ height: `${volume}%`, backgroundColor: getPhColor(phValue), opacity: 0.5, boxShadow: `0 0 50px ${getPhColor(phValue)}` }} />
            </div>
          </div>

          {/* INTERACTIVE CHEMICAL TRAY */}
          <div className="absolute bottom-10 inset-x-0 flex justify-center gap-6 z-30">
            {CHEMICALS.map((c) => (
              <div key={c.id} className="relative group">
                {/* Progress Ring saat Hover AI */}
                {hoverTarget === c.id && (
                  <svg className="absolute -inset-4 -rotate-90 w-24 h-24 pointer-events-none">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#00ffff" strokeWidth="4" strokeDasharray="251" strokeDashoffset={251 - (251 * hoverProgress) / 100} strokeLinecap="round" className="transition-all duration-100" />
                  </svg>
                )}
                <button 
                  onClick={() => mixChemical(c.id)}
                  className={`relative p-5 rounded-3xl border-2 transition-all duration-300 ${hoverTarget === c.id ? 'bg-white scale-125 -translate-y-4' : 'bg-slate-900/80 border-white/10'}`}
                >
                  <FlaskConical size={28} style={{ color: hoverTarget === c.id ? '#000' : c.color }} />
                  <p className={`text-[9px] font-black mt-2 text-center ${hoverTarget === c.id ? 'text-black' : 'text-white/50'}`}>{c.name}</p>
                </button>
              </div>
            ))}
            <button onClick={() => {setPhValue(7); setVolume(0); setHistory([]);}} className="p-5 rounded-3xl bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white transition-all"><RefreshCw size={28}/></button>
          </div>
        </div>

        {/* SIDEBAR LOGS */}
        <div className="col-span-4 flex flex-col gap-4">
          <div className="bg-cyan-600 rounded-[2rem] p-6 shadow-xl shadow-cyan-900/20">
            <h3 className="text-xs font-black text-black/60 uppercase mb-2 flex items-center gap-2"><Info size={16}/> Lab Assistant</h3>
            <p className="text-sm font-bold leading-relaxed">{currentChemInfo?.fact || "Gunakan tanganmu untuk menunjuk tabung kimia di layar!"}</p>
          </div>

          <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-6 flex-1 overflow-hidden flex flex-col">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Chemical Log</h3>
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {history.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 animate-in slide-in-from-right-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-[0_0_10px]" style={{ backgroundColor: h.color, boxShadow: `0 0 10px ${h.color}` }} />
                    <span className="text-[11px] font-black tracking-tight">{h.fullName}</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-600">{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* HIDDEN REPORT TEMPLATE */}
      <div className="fixed left-[-9999px]">
         <div ref={reportRef} style={{ width: '800px', padding: '60px', background: '#fff', color: '#000' }}>
            <h1 style={{ textAlign: 'center', borderBottom: '4px solid #000', paddingBottom: '10px' }}>LAPORAN PRAKTIKUM KIMIA VIRTUAL</h1>
            <div style={{ marginTop: '40px', fontSize: '20px' }}>
                <p><b>Nilai pH Akhir:</b> {phValue.toFixed(2)}</p>
                <p><b>Sifat Larutan:</b> {phValue < 7 ? 'Asam' : phValue > 7 ? 'Basa' : 'Netral'}</p>
                <p><b>Total Volume:</b> {volume} mL</p>
            </div>
            <table style={{ width: '100%', marginTop: '30px', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#eee' }}><th style={{ border: '1px solid #000', padding: '10px' }}>Zat Kimia</th><th style={{ border: '1px solid #000', padding: '10px' }}>Waktu</th></tr></thead>
                <tbody>{history.map((h, i) => (<tr key={i}><td style={{ border: '1px solid #000', padding: '10px' }}>{h.fullName}</td><td style={{ border: '1px solid #000', padding: '10px' }}>{h.time}</td></tr>))}</tbody>
            </table>
         </div>
      </div>
    </div>
  );
}