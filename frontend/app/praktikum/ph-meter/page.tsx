
"use client";
import React, { useRef } from "react";
import { useSolviaWebSocket } from "../../hooks/useSolviaWebSocket";

// VirtualCursor: Lingkaran cyan bercahaya mengikuti pointer_position dari WebSocket
function VirtualCursor({ pointer }: { pointer?: { x: number; y: number } }) {
  if (!pointer) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: pointer.x,
        top: pointer.y,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <div className="w-10 h-10 rounded-full border-4 border-cyan-400 shadow-[0_0_32px_8px_rgba(34,211,238,0.5)] animate-pulse bg-cyan-400/10" />
    </div>
  );
}

// BeakerVisualization: Warna cairan berubah sesuai pH
function BeakerVisualization({ ph }: { ph: number }) {
  // pH 0 (merah) - 7 (hijau) - 14 (ungu)
  function getColor(ph: number) {
    if (ph <= 2) return "bg-red-500";
    if (ph <= 6) return "bg-yellow-400";
    if (ph <= 8) return "bg-green-400";
    if (ph <= 11) return "bg-blue-500";
    return "bg-purple-500";
  }
  return (
    <div className="flex flex-col items-center">
      <div className="w-24 h-36 bg-white/10 rounded-b-3xl border-4 border-cyan-400 relative overflow-hidden shadow-xl">
        <div
          className={`absolute bottom-0 left-0 w-full transition-all duration-500 ${getColor(ph)}`}
          style={{ height: `${Math.max(10, (ph / 14) * 100)}%` }}
        />
      </div>
      <span className="text-xs text-cyan-300 mt-2">pH: {ph.toFixed(2)}</span>
    </div>
  );
}

export default function PhMeterPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { frame, handData, mixtureState, safetyStatus } = useSolviaWebSocket();

  // Dummy fallback
  const phValue = mixtureState?.current_pH ?? 7;
  const temperature = mixtureState?.total_volume ?? 25;
  const reactionName = mixtureState?.reaction_name ?? "-";
  const pointer = handData?.pointer_position;

  return (
    <div className="min-h-screen w-full bg-[#0B1120] flex flex-col items-center justify-center p-0">
      {/* Virtual Cursor */}
      <VirtualCursor pointer={pointer} />
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 py-12 px-4 md:px-0">
        {/* Kiri: Video Feed + Safety Overlay */}
        <div className="relative flex items-center justify-center">
          <div className="rounded-3xl border-4 border-cyan-400 shadow-[0_0_32px_8px_rgba(34,211,238,0.3)] overflow-hidden">
            {frame ? (
              <img
                src={frame}
                alt="Camera Feed"
                className="w-full h-96 object-cover bg-black"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                width={480}
                height={384}
                className="w-full h-96 object-cover bg-black"
              />
            )}
          </div>
          {/* Safety Alert Overlay */}
          {safetyStatus === "danger" && (
            <div className="absolute inset-0 bg-red-600/40 flex items-center justify-center z-20 animate-pulse">
              <span className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                ⚠️ FALL DETECTED - SAFETY PROTOCOL ACTIVE
              </span>
            </div>
          )}
        </div>
        {/* Kanan: Sidebar Statistik (Glassmorphism) */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl bg-white/5 backdrop-blur-md p-6 shadow-lg border border-cyan-400/30">
            <h2 className="text-cyan-400 text-lg font-bold mb-2">Lab Statistics</h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-200">pH Value</span>
                <span className="font-mono text-cyan-300 text-xl">{phValue.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cyan-200">Temperature</span>
                <span className="font-mono text-cyan-300 text-xl">{temperature}°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cyan-200">Reaction</span>
                <span className="font-mono text-cyan-300 text-lg">{reactionName}</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white/5 backdrop-blur-md p-6 shadow-lg border border-cyan-400/30 flex flex-col items-center">
            <h2 className="text-cyan-400 text-lg font-bold mb-4">Interactive Beaker</h2>
            <BeakerVisualization ph={phValue} />
          </div>
        </div>
      </div>
    </div>
  );
}
          [REMOVE ALL LINES BELOW THIS LINE]
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
          return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
              <h1 className="text-2xl font-bold text-cyan-300 mb-4">Praktikum pH Meter (Drag & Drop + Gesture)</h1>
              <div className="mb-4 text-center">
                <p className="text-lg text-cyan-200">Aktifkan kamera agar tangan Anda bisa terdeteksi sebagai mouse (MediaPipe Hand).</p>
                <p className="text-sm text-cyan-400">Pilih larutan dengan gesture tangan (pinch) atau drag & drop ke tabung reaksi.</p>
      );
    }

    export default PhMeterPage;
                <video ref={videoRef} autoPlay playsInline width={320} height={240} className="rounded-lg border-2 border-cyan-400 shadow" />
                <span className="text-cyan-400 text-xs mt-2">Preview kamera (tangan Anda akan terdeteksi)</span>
              </div>

              {/* HandDetector for gesture selection */}
              <HandDetector onPinch={handlePinch} chemicals={CHEMICALS} />

              {/* Chemical List */}
              <div className="flex gap-4 mb-8">
                {CHEMICALS.map((chem) => (
                  <div
                    key={chem.id}
                    draggable
                    onDragStart={() => handleDragStart(chem.id)}
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                    className={`w-20 h-20 flex items-center justify-center rounded-lg shadow-lg cursor-grab ${chem.color} text-white font-bold text-lg border-2 border-white`}
                  >
                    {chem.name}
                  </div>
                ))}
              </div>

              {/* Beaker Drop Area */}
              <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                className="w-64 h-64 flex flex-col items-center justify-center rounded-xl border-4 border-cyan-400 bg-slate-800 mb-6"
              >
                <span className="text-cyan-200 font-semibold mb-2">Tabung Reaksi</span>
                <div className="flex flex-wrap gap-2 justify-center">
                  {beakerChemicals.map((chemId) => {
                    const chem = CHEMICALS.find(c => c.id === chemId);
                    return chem ? (
                      <span key={chemId} className={`px-3 py-1 rounded-full text-white ${chem.color} font-bold text-sm`}>{chem.name}</span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          );
                        </span>
                      </div>
                    </div>

                    {/* Floating Chemical Buttons - Vertical sidebar kiri */}
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                      {CHEMICALS.map((chem) => (
                        <div
                          key={chem.id}
                          className="relative group"
                        >
                          <div
                            ref={(el) => { chemicalRefs.current[chem.id] = el }}
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
                          {/* Info button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const info = getChemicalInfo(chem.id)
                              if (info) {
                                setSelectedChemicalInfo(info)
                                setShowChemicalModal(true)
                                sound.click()
                              }
                            }}
                            className="absolute -right-2 -top-2 w-6 h-6 bg-cyan-500/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan-400 hover:scale-110"
                            title="View Chemical Info"
                          >
                            <Info className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-6 p-8">
                    {connectionTimeout ? (
                      // Timeout Error State
                      <>
                        <XCircle className="w-24 h-24 text-red-400/70 mx-auto" />
                        <div className="space-y-3">
                          <p className="text-red-300 text-xl font-bold">Koneksi Timeout ⏱️</p>
                          <p className="text-red-200/70 text-sm">
                            Backend tidak merespons dalam 30 detik
                          </p>
                        </div>
                        
                        {/* Error Troubleshooting */}
                        <div className="glass-card border-red-400/30 p-5 max-w-md mx-auto text-left">
                          <p className="text-red-400 font-semibold mb-2">❌ Troubleshooting:</p>
                          <ul className="space-y-2 text-red-100/70 text-sm">
                            <li>• Backend mungkin belum running</li>
                            <li>• Jalankan: <code className="bg-black/30 px-2 py-1 rounded text-xs">python server.py</code></li>
                            <li>• Pastikan port 8000 tersedia</li>
                            <li>• Cek apakah webcam terdeteksi sistem</li>
                          </ul>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-3 justify-center mt-6">
                          <button
                            onClick={handleRetryConnection}
                            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105"
                          >
                          export default PhMeterPage;
                          </button>
                          <button
                            onClick={() => {
                              setViewMode('drag')
                              setCameraPermission('prompt')
                              setConnectionTimeout(false)
                            }}
                            className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/50 rounded-lg transition-all"
                          >
                            Switch to Drag & Drop
                          </button>
                        </div>
                      </>
                    ) : (
                      // Normal Connecting State
                      <>
                        <AlertCircle className="w-24 h-24 text-yellow-400/70 mx-auto animate-pulse" />
                        <div className="space-y-3">
                          <p className="text-yellow-300 text-xl font-bold">Menghubungkan ke Lab Virtual...</p>
                          <p className="text-yellow-200/70 text-sm">
                            Memproses video stream dari backend
                          </p>
                        </div>
                        
                        {/* Connection Tips */}
                        <div className="glass-card border-yellow-400/30 p-5 max-w-md mx-auto text-left">
                          <p className="text-yellow-400 font-semibold mb-2">🔧 Jika lama loading:</p>
                          <ul className="space-y-2 text-yellow-100/70 text-sm">
                            <li>• Pastikan backend running: <code className="bg-black/30 px-2 py-1 rounded text-xs">python server.py</code></li>
                            <li>• Cek port 8000 tidak dipakai aplikasi lain</li>
                            <li>• Tunggu hingga "Connected to backend" muncul</li>
                            <li>• Atau switch ke mode Drag & Drop dulu</li>
                          </ul>
                        </div>
                        
                        <div className="flex items-center justify-center gap-3 mt-4">
                          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-yellow-400 animate-ping'}`}></div>
                          <span className="text-yellow-100/60 text-sm">
                            {isConnected ? 'Connected, waiting for first frame...' : 'Connecting to ws://localhost:8000...'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )
              ) : (
                <div className="text-center space-y-6">
                  <BeakerVisualization 
                    phValue={phValue} 
                    fillPercentage={Math.min(((mixtureState?.components?.length || 0) * 15), 80)}
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
                      export default PhMeterPage;
                  </div>
                </div>
              </div>
              <div className="mt-3 glass-card p-2 border-cyan-400/20 bg-cyan-500/5">
                <p className="text-xs text-cyan-300/80 text-center">
                  💡 Tangan kanan lebih akurat
                </p>
              </div>
            </div>
          )}

          {/* Temperature Gauge */}
          <div className="glass-panel p-5 border-orange-400/20 glow-soft">
            <div className="flex items-center gap-2 mb-3">
              <Thermometer className="w-5 h-5 text-orange-400" />
              <h2 className="text-lg font-bold text-orange-100">Temperature</h2>
            </div>
            <TemperatureGauge temperature={temperature} />
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
                  <div key={chem.id} className="relative group">
                    <div
                      onClick={() => handleAddChemicalClick(chem.id)}
                      className={`relative ${chem.color} cursor-pointer hover:scale-105 text-white font-semibold py-3 px-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-all shadow-lg`}
                    >
                      <Plus className="w-4 h-4" />
                      {chem.name}
                    </div>
                    {/* Info button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        const info = getChemicalInfo(chem.id)
                        if (info) {
                          setSelectedChemicalInfo(info)
                          setShowChemicalModal(true)
                          sound.click()
                        }
                      }}
                      className="absolute -right-1 -top-1 w-5 h-5 bg-cyan-500/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan-400 hover:scale-110 z-10"
                      title="View Chemical Info"
                    >
                      <Info className="w-3 h-3 text-white" />
                    </button>
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

      {/* Experiment Guide Overlay */}
      {currentExperiment && experimentStep < currentExperiment.steps.length && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 glass-panel border-amber-400/40 p-6 max-w-md animate-slideDown glow-soft">
          <div className="flex items-start gap-3 mb-3">
            <BookOpen className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-100 mb-1">
                {currentExperiment.name}
              </h3>
              <p className="text-xs text-amber-300/70">
                Step {experimentStep + 1} of {currentExperiment.steps.length}
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentExperiment(null)
                setExperimentStep(0)
                sound.click()
              }}
              className="text-amber-300/60 hover:text-amber-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="glass-card border-amber-400/20 p-4 bg-amber-500/5">
            <p className="text-sm text-amber-100 font-semibold mb-2">
              {currentExperiment.steps[experimentStep].instruction}
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-300/70">
              <FlaskConical className="w-4 h-4" />
              <span>Add {currentExperiment.steps[experimentStep].chemical_id}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 glass-card border-amber-400/10 p-2">
            <div className="h-2 bg-amber-900/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                style={{ width: `${((experimentStep + 1) / currentExperiment.steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Experiment Complete Overlay */}
      {currentExperiment && experimentStep >= currentExperiment.steps.length && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 glass-panel border-green-400/40 p-6 max-w-md animate-slideDown glow-soft">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-3 glow-cyan" />
            <h3 className="text-xl font-bold text-green-100 mb-2">
              Experiment Complete!
            </h3>
            <p className="text-sm text-green-300/70 mb-4">
              {currentExperiment.name}
            </p>
            
            <div className="glass-card border-green-400/20 p-4 bg-green-500/5 mb-4">
              <p className="text-xs text-green-100 font-semibold mb-2">Expected Result:</p>
              <p className="text-xs text-green-300/80">{currentExperiment.expectedResult.observation}</p>
              <p className="text-xs text-green-300/60 mt-2">
                pH: {currentExperiment.expectedResult.phRange} | 
                Color: {currentExperiment.expectedResult.color}
              </p>
            </div>

            <button
              onClick={() => {
                setCurrentExperiment(null)
                setExperimentStep(0)
                sound.success()
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Bubble Effects */}
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute rounded-full bg-cyan-400/30 backdrop-blur-sm border border-cyan-300/50 animate-bubble pointer-events-none"
          style={{
            left: `${bubble.x}%`,
            bottom: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animation: 'bubble 2s ease-out forwards'
          }}
        />
      ))}

      {/* Modals */}
      {showChemicalModal && selectedChemicalInfo && (
        <ChemicalModal
          chemical={selectedChemicalInfo}
          isOpen={showChemicalModal}
          onClose={() => {
            setShowChemicalModal(false)
            sound.click()
          }}
        />
      )}

      {showSafetyWarning && safetyWarningData && (
        <SafetyWarning
          {...safetyWarningData}
          onClose={() => {
            setShowSafetyWarning(false)
            sound.click()
          }}
        />
      )}

      {showExperimentSelector && (
        <ExperimentSelector
          isOpen={showExperimentSelector}
          onSelectExperiment={handleSelectExperiment}
          onClose={() => {
            setShowExperimentSelector(false)
            sound.click()
          }}
        />
      )}
    </div>
  )
}

export default PhMeterPage;
