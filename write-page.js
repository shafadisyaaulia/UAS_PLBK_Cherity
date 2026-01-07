const fs = require('fs');

const content = `'use client'

import { useState, useEffect } from 'react'
import { Camera, AlertTriangle, Droplet, FlaskConical, RotateCcw, ImagePlus, CheckCircle, XCircle, Beaker, Sparkles, Wifi, WifiOff, Flask, Plus } from 'lucide-react'
import { useCherityWebSocket, addChemical, resetMixture } from './hooks/useCherityWebSocket'

const CHEMICALS = [
  { id: 'HCl', name: 'HCl', fullName: 'Hydrochloric Acid', color: 'bg-red-500' },
  { id: 'NaOH', name: 'NaOH', fullName: 'Sodium Hydroxide', color: 'bg-blue-500' },
  { id: 'H2SO4', name: 'H2SO4', fullName: 'Sulfuric Acid', color: 'bg-orange-500' },
  { id: 'KOH', name: 'KOH', fullName: 'Potassium Hydroxide', color: 'bg-indigo-500' },
]

export default function Home() {
  const { isConnected, frame, mixtureState, safetyStatus, error } = useCherityWebSocket({ url: 'ws://localhost:8000/ws/camera', autoConnect: true })
  const phValue = mixtureState?.current_pH ?? 7.0
  const aiStatus = safetyStatus === 'danger' ? 'danger' : 'safe'
  const [reactionLog, setReactionLog] = useState([{ id: 1, time: '10:23:15', reaction: 'Waiting...' }])

  useEffect(() => {
    if (mixtureState?.reaction_name) {
      setReactionLog(prev => [{ id: Date.now(), time: new Date().toLocaleTimeString(), reaction: mixtureState.reaction_name }, ...prev].slice(0, 10))
    }
  }, [mixtureState?.timestamp])

  const handleReset = async () => {
    try { await resetMixture(); setReactionLog([{ id: Date.now(), time: new Date().toLocaleTimeString(), reaction: 'Lab reset' }]) }
    catch (err) { console.error(err) }
  }

  const handleScreenshot = () => {
    if (frame) {
      const link = document.createElement('a')
      link.href = \`data:image/jpeg;base64,\${frame}\`
      link.download = `cherity-${Date.now()}.jpg`
      link.click()
    }
  }

  const handleAddChemical = async (id) => {
    try { await addChemical(id, 10, 1.0) } catch (err) { console.error(err) }
  }

  const getPhColor = (ph) => {
    if (ph < 4) return 'from-red-500 to-orange-500'
    if (ph < 6) return 'from-orange-500 to-yellow-500'
    if (ph < 8) return 'from-green-500 to-emerald-500'
    if (ph < 11) return 'from-blue-500 to-cyan-500'
    return 'from-indigo-500 to-purple-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <header className="border-b border-cyan-500/30 bg-slate-950/80 backdrop-blur-md">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sparkles className="w-8 h-8 text-cyan-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">CHERITY</h1>
            </div>
            <div className={\`flex items-center gap-2 px-3 py-2 rounded-full \${isConnected ? 'bg-blue-500/20' : 'bg-gray-500/20'}\`}>
              {isConnected ? <><Wifi className="w-4 h-4 text-blue-400" /><span className="text-xs">CONNECTED</span></> : <><WifiOff className="w-4 h-4" /><span className="text-xs">OFFLINE</span></>}
            </div>
            <div className={\`flex items-center gap-2 px-4 py-2 rounded-full \${aiStatus === 'safe' ? 'bg-green-500/20' : 'bg-red-500/20'}\`}>
              {aiStatus === 'safe' ? <><CheckCircle className="w-5 h-5 text-green-400" /><span>SAFE</span></> : <><XCircle className="w-5 h-5 text-red-400" /><span>ALERT</span></>}
            </div>
          </div>
        </div>
      </header>
      <div className="flex h-[calc(100vh-80px)]">
        <div className="w-[70%] p-6">
          <div className="bg-slate-900/60 rounded-2xl border border-cyan-500/30 h-full flex flex-col">
            <div className="p-4 border-b border-cyan-500/20">
              <Camera className="w-5 h-5 text-cyan-400 inline" />
              <span className="ml-2 text-cyan-100">Live Camera Feed</span>
            </div>
            <div className="relative flex-1 flex items-center justify-center bg-slate-950/50">
              {frame && isConnected ? (
                <>
                  <img src={\`data:image/jpeg;base64,\${frame}\`} alt="Live" className="w-full h-full object-contain" />
                  <div className="absolute top-4 left-4 bg-slate-950/80 px-4 py-2 rounded-lg border border-cyan-500/30">
                    <div className="text-cyan-300 text-sm">pH: {phValue.toFixed(2)}</div>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <Camera className="w-24 h-24 text-cyan-500/30 mx-auto mb-4 animate-pulse" />
                  <p className="text-cyan-300/50">{isConnected ? 'Waiting for camera...' : 'Connecting...'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-[30%] p-6 pl-0 space-y-4">
          <div className="bg-slate-900/60 rounded-2xl border border-cyan-500/30 p-6">
            <Droplet className="w-5 h-5 text-cyan-400 inline" />
            <h2 className="ml-2 inline text-lg font-bold text-cyan-100">pH Meter</h2>
            <div className="mt-4 text-center">
              <div className={\`text-6xl font-bold bg-gradient-to-br \${getPhColor(phValue)} bg-clip-text text-transparent\`}>{phValue.toFixed(1)}</div>
              <div className="text-sm mt-2 text-cyan-300">{phValue < 7 ? 'ACIDIC' : phValue > 7 ? 'BASIC' : 'NEUTRAL'}</div>
            </div>
          </div>
          <div className="bg-slate-900/60 rounded-2xl border border-cyan-500/30 p-6">
            <FlaskConical className="w-5 h-5 text-cyan-400 inline" />
            <h2 className="ml-2 inline text-lg font-bold text-cyan-100">Reactions</h2>
            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
              {reactionLog.map(log => (
                <div key={log.id} className="bg-slate-800/50 p-3 rounded-lg">
                  <div className="text-xs text-cyan-300/60">{log.time}</div>
                  <div className="text-sm text-cyan-100">{log.reaction}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={handleReset} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" /><span>Reset</span>
            </button>
            <button onClick={handleScreenshot} className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2">
              <ImagePlus className="w-5 h-5" /><span>Screenshot</span>
            </button>
          </div>
          <div className="bg-slate-900/60 rounded-2xl border border-cyan-500/30 p-6">
            <Flask className="w-5 h-5 text-cyan-400 inline" />
            <h2 className="ml-2 inline text-lg font-bold text-cyan-100">Chemicals</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {CHEMICALS.map(chem => (
                <button key={chem.id} onClick={() => handleAddChemical(chem.id)} className={\`\${chem.color} hover:opacity-80 text-white py-2 px-3 rounded-lg\`} title={chem.fullName}>
                  <Plus className="w-4 h-4 inline" /> {chem.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
`;

fs.writeFileSync('app/page.tsx', content, 'utf8');
console.log('✅ page.tsx created successfully');
