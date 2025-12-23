'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Camera, Hand, MousePointer2, Play, X, CheckCircle, AlertTriangle, Droplet, FlaskConical, RotateCcw, ImagePlus, Beaker, Wifi, WifiOff, Plus, ArrowLeft, Info, Download } from 'lucide-react'
import { useSolviaWebSocket, addChemical, resetMixture } from '../hooks/useSolviaWebSocket'
import CircularGauge from '../../components/CircularGauge'
import BeakerVisualization from '../../components/BeakerVisualization'

const CHEMICALS = [
  { id: 'HCl', name: 'HCl', fullName: 'Hydrochloric Acid', color: 'bg-red-600', borderColor: 'border-red-400', textColor: 'text-red-100' },
  { id: 'NaOH', name: 'NaOH', fullName: 'Sodium Hydroxide', color: 'bg-blue-600', borderColor: 'border-blue-400', textColor: 'text-blue-100' },
  { id: 'H2SO4', name: 'H2SO4', fullName: 'Sulfuric Acid', color: 'bg-orange-600', borderColor: 'border-orange-400', textColor: 'text-orange-100' },
  { id: 'KOH', name: 'KOH', fullName: 'Potassium Hydroxide', color: 'bg-indigo-600', borderColor: 'border-indigo-400', textColor: 'text-indigo-100' },
  { id: 'NH3', name: 'NH3', fullName: 'Ammonia', color: 'bg-purple-600', borderColor: 'border-purple-400', textColor: 'text-purple-100' },
  { id: 'NaCl', name: 'NaCl', fullName: 'Sodium Chloride', color: 'bg-gray-500', borderColor: 'border-gray-400', textColor: 'text-gray-100' },
]

function DashboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'cv' | 'drag'>('drag')
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt')
  const [showCameraPrompt, setShowCameraPrompt] = useState(false)
  const [showGestureTutorial, setShowGestureTutorial] = useState(false)
  
  const { isConnected, frame, mixtureState, safetyStatus, error, handData } = useSolviaWebSocket({ 
    url: 'ws://localhost:8000/ws/camera', 
    autoConnect: viewMode === 'cv' && cameraPermission === 'granted'
  })
  
  const phValue = mixtureState?.current_pH ?? 7.0
  const aiStatus = safetyStatus === 'danger' ? 'danger' : 'safe'
  const [reactionLog, setReactionLog] = useState<Array<{ id: number; time: string; reaction: string }>>([])
  const [hoveredChemical, setHoveredChemical] = useState<string | null>(null)
  const chemicalRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const lastPinchTime = useRef<number>(0)
  const [virtualCursor, setVirtualCursor] = useState<{ x: number; y: number } | null>(null)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

  // Helper functions
  const handleAddChemicalClick = async (chemicalId: string) => {
    try { 
      await addChemical(chemicalId, 10, 1.0) 
    } catch (err) { 
      console.error(err) 
    }
  }

  const handleReset = async () => {
    try { 
      await resetMixture()
      setReactionLog([{ id: Date.now(), time: new Date().toLocaleTimeString(), reaction: 'Lab reset' }]) 
    } catch (err) { 
      console.error(err) 
    }
  }

  const getPhColor = (ph: number) => {
    if (ph < 4) return 'from-red-500 to-orange-500'
    if (ph < 6) return 'from-orange-500 to-yellow-500'
    if (ph < 8) return 'from-green-500 to-emerald-500'
    if (ph < 11) return 'from-blue-500 to-cyan-500'
    return 'from-indigo-500 to-purple-500'
  }

  const handleStartCamera = () => {
    setShowCameraPrompt(false)
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        setCameraPermission('granted')
        setShowGestureTutorial(true)
      })
      .catch(() => {
        setCameraPermission('denied')
      })
  }

  useEffect(() => {
    // Initialize reaction log on client side only
    setReactionLog([{ id: 1, time: new Date().toLocaleTimeString(), reaction: 'Lab initialized...' }])
  }, [])

  useEffect(() => {
    const mode = searchParams.get('mode')
    if (mode === 'cv' || mode === 'drag') {
      setViewMode(mode)
      if (mode === 'cv') {
        setShowCameraPrompt(true)
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (mixtureState?.reaction_name) {
      setReactionLog(prev => [{ id: Date.now(), time: new Date().toLocaleTimeString(), reaction: mixtureState.reaction_name }, ...prev].slice(0, 10))
    }
  }, [mixtureState?.timestamp])

  useEffect(() => {
    if (viewMode !== 'cv') return
    
    // Update virtual cursor position - always track when hand detected
    if (handData?.pointer_position) {
      const { x, y } = handData.pointer_position
      // Direct mapping without mirror
      const screenX = x * window.innerWidth
      const screenY = y * window.innerHeight
      
      setVirtualCursor({ x: screenX, y: screenY })
      
      // Check hover for all chemicals
      let foundHover = false
      for (const chem of CHEMICALS) {
        const ref = chemicalRefs.current[chem.id]
        if (ref) {
          const rect = ref.getBoundingClientRect()
          
          if (screenX >= rect.left && screenX <= rect.right && 
              screenY >= rect.top && screenY <= rect.bottom) {
            setHoveredChemical(chem.id)
            foundHover = true
            break
          }
        }
      }
      
      if (!foundHover) {
        setHoveredChemical(null)
      }
    } else {
      setVirtualCursor(null)
      setHoveredChemical(null)
    }
  }, [handData, viewMode])

  useEffect(() => {
    if (viewMode !== 'cv') return
    
    if (handData?.gesture === 'pinch' && hoveredChemical) {
      const now = Date.now()
      if (now - lastPinchTime.current > 800) {
        handleAddChemicalClick(hoveredChemical)
        lastPinchTime.current = now
        
        // Create ripple effect at cursor position
        if (virtualCursor) {
          const newRipple = { id: Date.now(), x: virtualCursor.x, y: virtualCursor.y }
          setRipples(prev => [...prev, newRipple])
          setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== newRipple.id))
          }, 800)
        }
      }
    }
  }, [handData?.gesture, hoveredChemical, viewMode, virtualCursor])

  const handleScreenshot = () => {
    if (!frame) return
    const canvas = document.createElement('canvas')
    canvas.width = 1920
    canvas.height = 1080
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#0B1120'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#22d3ee'
    ctx.font = 'bold 48px Arial'
    ctx.fillText('SOLVIA - Laboratory Report', 60, 80)
    ctx.fillStyle = '#6ee7b7'
    ctx.font = '24px Arial'
    ctx.fillText(`Generated: ${new Date().toLocaleString()}`, 60, 120)

    const img = new Image()
    img.onload = function() {
      ctx.drawImage(img, 60, 160, 800, 600)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.fillRect(900, 160, 960, 250)
      ctx.strokeStyle = '#22d3ee'
      ctx.lineWidth = 2
      ctx.strokeRect(900, 160, 960, 250)
      ctx.fillStyle = '#22d3ee'
      ctx.font = 'bold 32px Arial'
      ctx.fillText('pH Analysis', 940, 210)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 72px Arial'
      ctx.fillText(phValue.toFixed(2), 940, 300)
      ctx.fillStyle = '#6ee7b7'
      ctx.font = '24px Arial'
      const phType = phValue < 7 ? 'ACIDIC' : phValue > 7 ? 'BASIC' : 'NEUTRAL'
      ctx.fillText(`Status: ${phType}`, 940, 360)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.fillRect(900, 440, 960, 320)
      ctx.strokeStyle = '#22d3ee'
      ctx.strokeRect(900, 440, 960, 320)
      ctx.fillStyle = '#22d3ee'
      ctx.font = 'bold 28px Arial'
      ctx.fillText('Chemicals Added', 940, 490)
      ctx.fillStyle = '#fff'
      ctx.font = '20px Arial'
      const components = mixtureState?.components || []
      components.slice(0, 5).forEach((comp: any, idx: number) => {
        ctx.fillText(`${comp.chemical_id}: ${comp.volume.toFixed(1)}mL (${comp.concentration}M)`, 940, 540 + idx * 40)
      })
      ctx.fillStyle = aiStatus === 'safe' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'
      ctx.fillRect(60, 800, 1800, 120)
      ctx.strokeStyle = aiStatus === 'safe' ? '#22c55e' : '#ef4444'
      ctx.strokeRect(60, 800, 1800, 120)
      ctx.fillStyle = aiStatus === 'safe' ? '#22c55e' : '#ef4444'
      ctx.font = 'bold 36px Arial'
      ctx.fillText(`Safety Status: ${aiStatus.toUpperCase()}`, 80, 860)
      ctx.fillStyle = '#6ee7b7'
      ctx.font = '20px Arial'
      ctx.fillText('Verified by SOLVIA AI Computer Vision System', 80, 900)
      ctx.fillStyle = '#22d3ee'
      ctx.font = 'italic 18px Arial'
      ctx.fillText('SOLVIA - Solution Vision-driven Laboratory with Intelligent Analytics', 60, 1040)
      canvas.toBlob(function(blob) {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `solvia-lab-report-${Date.now()}.png`
          link.click()
          URL.revokeObjectURL(url)
        }
      })
    }
    img.src = `data:image/jpeg;base64,${frame}`
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0B1120' }}>
      {/* Virtual Cursor */}
      {virtualCursor && viewMode === 'cv' && (
        <div
          className="fixed pointer-events-none z-[100] transition-all duration-75"
          style={{
            left: virtualCursor.x,
            top: virtualCursor.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            {/* Main cursor dot */}
            <div className="w-6 h-6 rounded-full bg-cyan-400 border-3 border-white shadow-2xl glow-cyan" />
            {/* Outer ring */}
            <div className="absolute inset-0 w-10 h-10 -m-2 rounded-full border-2 border-cyan-400/60 glow-cyan" />
            {/* Pulse effect */}
            <div className="absolute inset-0 w-10 h-10 -m-2 rounded-full bg-cyan-400/30 animate-ping" />
            {/* Gesture indicator */}
            {handData?.gesture === 'pinch' && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-cyan-500/90 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap font-bold shadow-lg">
                JEPIT!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ripple Effects */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="fixed pointer-events-none z-[99] ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="w-16 h-16 rounded-full border-4 border-cyan-400" />
        </div>
      ))}

      <header className="glass-panel border-b border-cyan-400/20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/landing')}
                className="text-cyan-400 hover:text-cyan-300 transition-colors glow-cyan-soft"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <FlaskConical className="w-8 h-8 text-cyan-400 glow-cyan-soft" />
              <h1 className="text-3xl font-bold text-gradient">SOLVIA</h1>
            </div>

            <div className="flex items-center gap-2 glass-card p-1">
              <button
                onClick={() => setViewMode('drag')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                  viewMode === 'drag' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg glow-cyan' 
                    : 'text-cyan-300/60 hover:text-cyan-300'
                }`}
              >
                <MousePointer2 className="w-4 h-4" />
                Drag & Drop
              </button>
              <button
                onClick={() => {
                  setViewMode('cv')
                  if (cameraPermission === 'prompt') {
                    setShowCameraPrompt(true)
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                  viewMode === 'cv' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg glow-cyan' 
                    : 'text-cyan-300/60 hover:text-cyan-300'
                }`}
              >
                <Hand className="w-4 h-4" />
                Computer Vision
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${isConnected ? 'glass-card border-cyan-400/40 glow-cyan-soft' : 'glass-card border-gray-500/40'}`}>
                {isConnected ? <><Wifi className="w-4 h-4 text-cyan-400" /><span className="text-cyan-300 text-xs font-semibold">CONNECTED</span></> : <><WifiOff className="w-4 h-4 text-gray-400" /><span className="text-gray-300 text-xs font-semibold">OFFLINE</span></>}
              </div>
            </div>
          </div>
        </div>
      </header>

      {showCameraPrompt && viewMode === 'cv' && cameraPermission === 'prompt' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass-panel p-8 max-w-md w-full relative border-2 border-cyan-400/30 glow-cyan-soft">
            <button 
              onClick={() => {
                setShowCameraPrompt(false)
                setViewMode('drag')
              }}
              className="absolute top-4 right-4 text-cyan-300/60 hover:text-cyan-300"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 glass-card flex items-center justify-center mx-auto border-cyan-400/30 glow-cyan-soft">
                <Camera className="w-10 h-10 text-cyan-400" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-cyan-100 mb-2">solvia-lab.vercel.app wants to</h2>
                <p className="text-cyan-100/70">Use your camera</p>
              </div>

              <div className="glass-card p-4 border-cyan-400/20">
                <p className="text-cyan-100/60 text-sm leading-relaxed">
                  SOLVIA menggunakan kamera untuk tracking gerakan tangan. 
                  Video tidak direkam - hanya diproses real-time untuk deteksi gesture.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleStartCamera}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-3 glow-cyan"
                >
                  <Camera className="w-5 h-5" />
                  Allow Camera Access
                </button>
                <button
                  onClick={() => {
                    setShowCameraPrompt(false)
                    setViewMode('drag')
                  }}
                  className="w-full glass-card border-cyan-400/30 text-cyan-100 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all"
                >
                  Use Drag & Drop Instead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showGestureTutorial && viewMode === 'cv' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 rounded-3xl border-2 border-purple-500/30 p-8 max-w-2xl w-full relative">
            <button 
              onClick={() => setShowGestureTutorial(false)}
              className="absolute top-4 right-4 text-purple-300/60 hover:text-purple-300"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                <Hand className="w-10 h-10 text-purple-400" />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-purple-100 mb-2">Panduan Gesture Tangan</h2>
                <p className="text-purple-100/70">Gunakan tangan untuk kontrol praktikum</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-purple-500/20">
                  <div className="text-6xl mb-4">👉</div>
                  <h3 className="text-xl font-bold text-purple-100 mb-2">Pointing Gesture</h3>
                  <p className="text-purple-100/60 text-sm mb-3">Telunjuk lurus, jari lain tertekuk</p>
                  <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/30">
                    <p className="text-purple-300 text-xs font-semibold">Fungsi: Hover di atas kimia</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-6 border border-purple-500/20">
                  <div className="text-6xl mb-4">🤏</div>
                  <h3 className="text-xl font-bold text-purple-100 mb-2">Pinch Gesture</h3>
                  <p className="text-purple-100/60 text-sm mb-3">Ibu jari & telunjuk bertemu</p>
                  <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/30">
                    <p className="text-purple-300 text-xs font-semibold">Fungsi: Tambah kimia</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowGestureTutorial(false)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Saya Mengerti - Mulai Praktikum
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-[calc(100vh-80px)]">
        <div className="w-[70%] p-6">
          <div className="glass-panel h-full flex flex-col border-cyan-400/20 glow-cyan-soft">
            <div className="p-4 border-b border-cyan-400/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Camera className="w-5 h-5 text-cyan-400 glow-cyan-soft" />
                <span className="text-cyan-100 font-semibold">
                  {viewMode === 'cv' ? 'Live Camera Feed' : 'Laboratory View'}
                </span>
              </div>
            </div>

            <div className="relative flex-1 bg-black/30 flex items-center justify-center overflow-hidden">
              {viewMode === 'cv' && cameraPermission === 'granted' ? (
                frame && isConnected ? (
                  <>
                    <img 
                      src={`data:image/jpeg;base64,${frame}`} 
                      alt="Live" 
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 glow-cyan">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-white text-xs font-semibold">LIVE</span>
                    </div>

                    {/* Test Tube Visualization - Top Right Corner */}
                    <div className="absolute top-20 right-8 glass-panel p-4 border-cyan-400/30">
                      <div className="text-center mb-2">
                        <span className="text-cyan-300 text-xs font-semibold">Tabung Reaksi</span>
                      </div>
                      <div className="relative w-24 h-32">
                        {/* Test tube SVG */}
                        <svg viewBox="0 0 100 150" className="w-full h-full">
                          {/* Tube body */}
                          <rect x="30" y="20" width="40" height="120" rx="3" 
                            fill="rgba(255,255,255,0.1)" stroke="#22d3ee" strokeWidth="2"/>
                          {/* Liquid fill */}
                          <rect x="32" y={`${140 - (mixtureState?.components?.length || 0) * 20}`} 
                            width="36" height={`${(mixtureState?.components?.length || 0) * 20}`} 
                            fill={phValue < 6 ? '#ef4444' : phValue > 8 ? '#3b82f6' : '#84cc16'} 
                            opacity="0.7"/>
                          {/* Tube rim */}
                          <ellipse cx="50" cy="20" rx="20" ry="5" 
                            fill="rgba(255,255,255,0.2)" stroke="#22d3ee" strokeWidth="2"/>
                        </svg>
                        {/* pH indicator */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-cyan-500/80 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs font-bold">
                          pH {phValue.toFixed(1)}
                        </div>
                      </div>
                    </div>

                    {/* Gesture Status Indicator */}
                    <div className="absolute top-4 left-4 glass-panel px-4 py-2 border-cyan-400/30">
                      <div className="flex items-center gap-2">
                        <Hand className="w-4 h-4 text-cyan-400 glow-cyan" />
                        <span className="text-cyan-300 text-sm font-semibold">
                          Gesture: {handData?.gesture?.toUpperCase() || 'NONE'}
                        </span>
                      </div>
                    </div>

                    {/* Floating Chemical Buttons - Vertical sidebar kiri */}
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                      {CHEMICALS.map((chem) => (
                        <div
                          key={chem.id}
                          ref={el => chemicalRefs.current[chem.id] = el}
                          onClick={() => handleAddChemicalClick(chem.id)}
                          className={`relative ${chem.color} backdrop-blur-md bg-opacity-90 cursor-pointer hover:scale-110 text-white font-bold py-3 px-4 rounded-xl flex items-center gap-2 text-sm transition-all shadow-2xl
                            ${hoveredChemical === chem.id ? 'ring-4 ring-cyan-400 scale-125 glow-cyan' : ''}`}
                          title={chem.fullName}
                        >
                          {hoveredChemical === chem.id && (
                            <div className="absolute inset-0 bg-cyan-400/30 flex items-center justify-center rounded-xl animate-pulse">
                              <Hand className="w-6 h-6 text-cyan-300 glow-cyan" />
                            </div>
                          )}
                          <Plus className="w-5 h-5" />
                          {chem.name}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <Camera className="w-24 h-24 text-cyan-500/30 mx-auto animate-pulse" />
                    <p className="text-cyan-300/50 mt-4">Connecting...</p>
                  </div>
                )
              ) : (
                <div className="text-center space-y-6">
                  <BeakerVisualization 
                    phValue={phValue} 
                    fillPercentage={Math.min((mixtureState?.components?.length || 0) * 15, 80)}
                    className="w-64 h-96 mx-auto"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-cyan-100 mb-2">
                      {viewMode === 'drag' ? 'Drag & Drop Mode' : 'Camera Not Started'}
                    </h3>
                    <p className="text-cyan-300/50">
                      {viewMode === 'drag' ? 'Klik kimia di panel kanan' : 'Aktifkan Computer Vision'}
                    </p>
                  </div>
                  {viewMode === 'cv' && (
                    <button
                      onClick={() => setShowCameraPrompt(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all inline-flex items-center gap-3 glow-cyan"
                    >
                      <Play className="w-5 h-5" />
                      Start Camera
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-[30%] p-6 pl-0 space-y-4">
          <div className="glass-panel p-6 border-cyan-400/20 glow-cyan-soft">
            <div className="flex items-center gap-2 mb-4">
              <Droplet className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-cyan-100">pH Meter</h2>
            </div>
            <div className="flex items-center justify-center">
              <CircularGauge value={phValue} label="pH" size={200} />
            </div>
          </div>

          <div className="glass-panel p-6 border-cyan-400/20 glow-cyan-soft">
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-cyan-100">Reaction Log</h2>
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {reactionLog.map((log) => (
                <div key={log.id} className="glass-card p-3 border-cyan-400/20">
                  <div className="text-xs text-cyan-300/60 font-mono">{log.time}</div>
                  <div className="text-sm text-cyan-100">{log.reaction}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleReset} 
              className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all glow-cyan-soft"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
            <button 
              onClick={handleScreenshot} 
              className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all glow-cyan"
            >
              <Download className="w-5 h-5" />
              Report
            </button>
          </div>

          {/* Add Chemicals Panel - Hidden in CV mode (ada di overlay kamera) */}
          {viewMode === 'drag' && (
            <div className="glass-panel p-6 border-cyan-400/20 glow-cyan-soft">
              <div className="flex items-center gap-2 mb-4">
                <FlaskConical className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-cyan-100">Add Chemicals</h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {CHEMICALS.map((chem) => (
                  <div
                    key={chem.id}
                    onClick={() => handleAddChemicalClick(chem.id)}
                    className={`relative ${chem.color} cursor-pointer hover:scale-105 text-white font-semibold py-3 px-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-all shadow-lg`}
                  >
                    <Plus className="w-4 h-4" />
                    {chem.name}
                  </div>
                ))}
              </div>
              <p className="text-cyan-300/50 text-xs mt-3 text-center">
                Click to add 10mL
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-cyan-400" style={{ backgroundColor: '#0B1120' }}>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
