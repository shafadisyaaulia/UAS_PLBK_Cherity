'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Camera, 
  Activity, 
  AlertTriangle, 
  Droplet, 
  FlaskConical, 
  RotateCcw, 
  ImagePlus,
  CheckCircle,
  XCircle,
  Beaker,
  Sparkles,
  Wifi,
  WifiOff
} from 'lucide-react'
import { useSolviaWebSocket, addChemical, resetMixture } from './hooks/useSolviaWebSocket'

export default function Home() {
  // Use WebSocket hook for real-time data
  const { 
    isConnected, 
    frame, 
    mixtureState, 
    safetyStatus,
    error 
  } = useSolviaWebSocket({
    url: 'ws://localhost:8000/ws/camera',
    autoConnect: true
  })

  // Get data from backend (with fallbacks for initial state)
  const phValue = mixtureState?.current_pH ?? 7.0
  const aiStatus = safetyStatus === 'danger' ? 'danger' : 'safe'
  
  // Reaction log from backend
  const [reactionLog, setReactionLog] = useState([
    { id: 1, time: '10:23:15', reaction: 'Waiting for data...' },
  ])

  // Update reaction log when mixture state changes
  useEffect(() => {
    if (mixtureState?.reaction_name && mixtureState?.timestamp) {
      const time = new Date(mixtureState.timestamp).toLocaleTimeString()
      setReactionLog(prev => {
        const newLog = {
          id: Date.now(),
          time,
          reaction: mixtureState.reaction_name
        }
        return [newLog, ...prev].slice(0, 10) // Keep only last 10
      })
    }
  }, [mixtureState?.timestamp])

  const handleReset = async () => {
    try {
      await resetMixture()
      setReactionLog([{ id: Date.now(), time: new Date().toLocaleTimeString(), reaction: 'Lab reset' }])
    } catch (err) {
      console.error('Failed to reset mixture:', err)
      alert('Failed to reset lab. Make sure backend is running.')
    }
  }

  const handleScreenshot = () => {
    if (frame) {
      // Create download link for screenshot
      const link = document.createElement('a')
      link.href = `data:image/jpeg;base64,${frame}`
      link.download = `solvia-screenshot-${Date.now()}.jpg`
      link.click()
    } else {
      alert('No camera feed available for screenshot.')
    }
  }

  const handleAddChemical = async (chemicalId: string, volume: number = 10, molarity: number = 1.0) => {
    try {
      await addChemical(chemicalId, volume, molarity)
    } catch (err) {
      console.error('Failed to add chemical:', err)
    }
  }

  const getPhColor = (ph: number) => {
    if (ph < 4) return 'from-red-500 to-orange-500'
    if (ph < 6) return 'from-orange-500 to-yellow-500'
    if (ph < 8) return 'from-green-500 to-emerald-500'
    if (ph < 11) return 'from-blue-500 to-cyan-500'
    return 'from-indigo-500 to-purple-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-cyan-500/30 bg-slate-950/80 backdrop-blur-md">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-cyan-400" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  SOLVIA
                </h1>
              </div>
              <span className="text-xs text-cyan-300/60 font-medium tracking-wider">
                Solution Vision-driven Integrated Analytics
              </span>
            </div>
              
              {/* Connection Status */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${
                isConnected 
                  ? 'bg-blue-500/20 border border-blue-500/40' 
                  : 'bg-gray-500/20 border border-gray-500/40'
              }`}>
                {isConnected ? (
                  <>
                    <Wifi className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-300 text-xs font-semibold">CONNECTED</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-xs font-semibold">OFFLINE</span>
                  </>
                )}
              </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-cyan-100 font-medium">Safety Monitor</span>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                aiStatus === 'safe' 
                  ? 'bg-green-500/20 border border-green-500/40' 
                  : 'bg-red-500/20 border border-red-500/40 animate-pulse'
              }`}>
                {aiStatus === 'safe' ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-300 font-semibold">SAFE</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-300 font-semibold">ALERT</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Column - Camera Feed (70%) */}
        <div c{frame && isConnected ? (
                <>
                  {/* Real camera feed from backend */}
                  <img 
                    src={`data:image/jpeg;base64,${frame}`}
                    alt="Live Camera Feed"
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Overlay information */}
                  <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-500/30">
                    <div className="text-cyan-300 text-sm font-mono">
                      <div>pH: {phValue.toFixed(2)}</div>
                      <div>Status: {aiStatus.toUpperCase()}</div>
                      {mixtureState && (
                        <div className="text-xs mt-1 text-cyan-400">
                          {mixtureState.reaction_name}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                /* Placeholder when no feed */
                <div className="text-center space-y-4">
                  <Camera className="w-24 h-24 text-cyan-500/30 mx-auto" />
                  <p className="text-cyan-300/50 text-lg">
                    {isConnected ? 'Waiting for camera feed...' : 'Connecting to backend...'}
                  </p>
                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}
                  {!isConnected && (
                    <p className="text-cyan-300/30 text-sm">
                      Make sure backend is running at http://localhost:8000
                    </p>
                  )}
                </div>
              )}pan className="text-xs text-cyan-300/70">RECORDING</span>
                </div>
              </div>
              <div className="text-xs text-cyan-300/60 font-mono">
                {new Date().toLocaleTimeString()}
              </div>
            </div>

            {/* Camera Feed Area */}
            <div className="relative h-[calc(100%-52px)] bg-slate-950/50 flex items-center justify-center">
              <canvas 
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-contain"
              />
              {/* Placeholder for camera */}
              <div className="text-center space-y-4">
                <Camera className="w-24 h-24 text-cyan-500/30 mx-auto" />
                <p className="text-cyan-300/50 text-lg">Camera feed will appear here</p>
                <p className="text-cyan-300/30 text-sm">MediaPipe overlay will render on canvas</p>
              </div>

              {/* Corner overlays */}
              <div className="absolute top-4 left-4">
                <div className="w-16 h-16 border-l-2 border-t-2 border-cyan-400/60" />
              </div>
              <div className="absolute top-4 right-4">
                <div className="w-16 h-16 border-r-2 border-t-2 border-cyan-400/60" />
              </div>
              <div className="absolute bottom-4 left-4">
                <div className="w-16 h-16 border-l-2 border-b-2 border-cyan-400/60" />
              </div>
              <div className="absolute bottom-4 right-4">
                <div className="w-16 h-16 border-r-2 border-b-2 border-cyan-400/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Analytical Sidebar (30%) */}
        <div className="w-[30%] p-6 pl-0 space-y-4">
          {/* pH Meter */}
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-cyan-500/30 p-6 shadow-[0_0_30px_rgba(0,212,255,0.1)]">
            <div className="flex items-center gap-2 mb-4">
              <Droplet className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-cyan-100">pH Meter</h2>
            </div>
            
            <div className="relative">
              {/* pH Gauge */}
              <div className="relative h-48 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${getPhColor(phValue)} opacity-30 blur-xl`} />
                </div>
                <div className="relative z-10 text-center">
                  <div className={`text-6xl font-bold bg-gradient-to-br ${getPhColor(phValue)} bg-clip-text text-transparent`}>
                    {phValue.toFixed(1)}
                  </div>
                  <div className="text-cyan-300/70 text-sm mt-2">
                    {phValue < 7 ? 'ACIDIC' : phValue > 7 ? 'BASIC' : 'NEUTRAL'}
                  </div>
                </div>
              </div>

              {/* pH Scale */}
              <div className="mt-4">
                <div className="h-4 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-purple-500 relative">
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-8 bg-white rounded-full shadow-lg transition-all duration-300"
                    style={{ left: `${(phValue / 14) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-cyan-300/60 mt-1">
                  <span>0</span>
                  <span>7</span>
                  <span>14</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reaction Log */}
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-cyan-500/30 p-6 shadow-[0_0_30px_rgba(0,212,255,0.1)]">
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-cyan-100">Reaction Log</h2>
            </div>
            
            <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-slate-800/30">
              {reactionLog.length === 0 ? (
                <p className="text-cyan-300/50 text-sm text-center py-8">No reactions recorded yet</p>
              ) : (
                reactionLog.map((log) => (
                  <div 
                    key={log.id}
                    className="bg-slate-800/50 rounded-lg p-3 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <Beaker className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-cyan-300/60 font-mono mb-1">{log.time}</div>
                        <div className="text-sm text-cyan-100 break-words">{log.reaction}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Safety Alert */}
          <div className={`backdrop-blur-sm rounded-2xl border p-6 shadow-[0_0_30px_rgba(0,212,255,0.1)] transition-all ${
            aiStatus === 'danger' 
              ? 'bg-red-900/60 border-red-500/60 animate-pulse shadow-[0_0_50px_rgba(239,68,68,0.4)]' 
              : 'bg-slate-900/60 border-cyan-500/30'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className={`w-5 h-5 ${aiStatus === 'danger' ? 'text-red-400' : 'text-cyan-400'}`} />
              <h2 className={`text-lg font-bold ${aiStatus === 'danger' ? 'text-red-100' : 'text-cyan-100'}`}>
                Safety Alert
              </h2>
            </div>
            
            <div className="text-center py-6">
              {aiStatus === 'danger' ? (
                <>
                  <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-3 animate-bounce" />
                  <p className="text-red-100 font-bold text-lg mb-2">DANGER DETECTED!</p>
                  <p className="text-red-200/80 text-sm">
                    Unsafe position detected by YOLOv5. Please maintain safe distance.
                  </p>
                </>
              ) : (
                <>
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-3" />
                  <p className="text-cyan-100 font-semibold">All systems normal</p>
                  <p className="text-cyan-300/60 text-sm mt-1">No hazards detected</p>
                </>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleReset}
              className="bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset Lab</span>
            </button>
            
            <button 
              onClick={handleScreenshot}
              className="bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <ImagePlus className="w-5 h-5" />
              <span>Screenshot</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
