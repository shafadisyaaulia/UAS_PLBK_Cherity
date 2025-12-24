'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Camera, Hand, MousePointer2, Play, X, CheckCircle, AlertTriangle, Droplet, FlaskConical, RotateCcw, ImagePlus, Beaker, Wifi, WifiOff, Plus, ArrowLeft, Info, Download, BookOpen, Thermometer, AlertCircle, XCircle, RefreshCw, Award } from 'lucide-react'
import { useSolviaWebSocket, addChemical, resetMixture, getMixtureState } from '../../hooks/useSolviaWebSocket'
import CircularGauge from '../../../components/CircularGauge'
import BeakerVisualization from '../../../components/BeakerVisualization'
import ChemicalModal from '../../../components/ChemicalModal'
import SafetyWarning from '../../../components/SafetyWarning'
import ExperimentSelector from '../../../components/ExperimentSelector'
import TemperatureGauge from '../../../components/TemperatureGauge'
import { useSound } from '../../hooks/useSound'
import { getChemicalInfo } from '../../data/chemicalInfo'
import { Experiment } from '../../data/experiments'
import { trackPraktikumCompletion } from '@/lib/achievementSystem'

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
  const [isLoadingCamera, setIsLoadingCamera] = useState(false)
  
  const { isConnected, frame, mixtureState: wsMixtureState, safetyStatus, error, handData } = useSolviaWebSocket({ 
    url: 'ws://localhost:8000/ws/camera', 
    autoConnect: viewMode === 'cv' && cameraPermission === 'granted'
  })
  
  const [localMixtureState, setLocalMixtureState] = useState<any>(null)
  const mixtureState = viewMode === 'cv' ? wsMixtureState : (localMixtureState?.mixture_state || localMixtureState)
  
  const phValue = mixtureState?.current_pH ?? 7.0
  const aiStatus = safetyStatus === 'danger' ? 'danger' : 'safe'
  const [reactionLog, setReactionLog] = useState<Array<{ id: number; time: string; reaction: string }>>([])
  const [hoveredChemical, setHoveredChemical] = useState<string | null>(null)
  const chemicalRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const lastPinchTime = useRef<number>(0)
  const [virtualCursor, setVirtualCursor] = useState<{ x: number; y: number } | null>(null)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  
  // New features state
  const [showChemicalModal, setShowChemicalModal] = useState(false)
  const [selectedChemicalInfo, setSelectedChemicalInfo] = useState<any>(null)
  const [showSafetyWarning, setShowSafetyWarning] = useState(false)
  const [safetyWarningData, setSafetyWarningData] = useState<any>(null)
  const [showExperimentSelector, setShowExperimentSelector] = useState(false)
  const [currentExperiment, setCurrentExperiment] = useState<Experiment | null>(null)
  const [experimentStep, setExperimentStep] = useState(0)
  const [temperature, setTemperature] = useState(25) // Room temperature
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number }[]>([])
  const [praktikumStartTime, setPraktikumStartTime] = useState<number | null>(null)
  const [showAchievementNotif, setShowAchievementNotif] = useState(false)
  const [connectionTimeout, setConnectionTimeout] = useState(false)
  
  // Sound effects
  const sound = useSound()

  // Pre-warm backend camera on mount for faster CV mode initialization
  useEffect(() => {
    // Call warmup endpoint to pre-load camera and models
    fetch('http://localhost:8000/api/warmup')
      .then(res => res.json())
      .then(data => {
        console.log('✅ Backend pre-warmed:', data.message)
      })
      .catch(err => {
        console.log('⚠️ Backend warmup failed (it will initialize on first connection):', err.message)
      })
  }, [])

  // Start timer when component mounts
  useEffect(() => {
    setPraktikumStartTime(Date.now())
  }, [])

  // Helper functions
  const handleAddChemicalClick = async (chemicalId: string) => {
    try {
      // Play sound effect
      sound.addChemical()
      
      const result = await addChemical(chemicalId, 10, 1.0)
      console.log('Add chemical result:', result)
      
      // Fetch updated state
      const newState = await getMixtureState()
      console.log('New mixture state:', newState)
      setLocalMixtureState(newState)
      
      // Check for safety warnings
      checkSafetyConditions(newState)
      
      // Update temperature based on reaction
      updateTemperature(chemicalId, newState)
      
      // Create bubble effect
      createBubbleEffect()
      
      // Add to reaction log
      if (result.reaction) {
        sound.reaction()
        setReactionLog(prev => [
          { id: Date.now(), time: new Date().toLocaleTimeString(), reaction: result.reaction },
          ...prev
        ].slice(0, 10))
      }
      
      // Check if experiment step completed
      if (currentExperiment && experimentStep < currentExperiment.steps.length) {
        const currentStep = currentExperiment.steps[experimentStep]
        if (currentStep.chemical_id === chemicalId) {
          const newStep = experimentStep + 1
          setExperimentStep(newStep)
          sound.success()
          
          // If experiment completed, track it
          if (newStep >= currentExperiment.steps.length) {
            handleExperimentComplete()
          }
        }
      }
      
      // Check for perfect pH (7.00)
      const ph = (newState.mixture_state || newState)?.current_pH ?? 7.0
      if (Math.abs(ph - 7.0) < 0.01) {
        trackPraktikumCompletion(0, true) // isPerfectPH = true
        setShowAchievementNotif(true)
        setTimeout(() => setShowAchievementNotif(false), 3000)
      }
    } catch (err) { 
      console.error(err) 
    }
  }
  
  const handleExperimentComplete = () => {
    if (!praktikumStartTime) return
    
    const duration = Math.floor((Date.now() - praktikumStartTime) / 60000) // in minutes
    trackPraktikumCompletion(duration, false)
    
    sound.success()
    setShowAchievementNotif(true)
    setTimeout(() => setShowAchievementNotif(false), 3000)
  }

  const checkSafetyConditions = (state: any) => {
    const mixState = state.mixture_state || state
    const ph = mixState?.current_pH ?? 7
    const volume = mixState?.total_volume ?? 0
    
    if (ph < 2) {
      sound.warning()
      setSafetyWarningData({
        title: 'CRITICAL: Extremely Acidic!',
        message: 'pH is dangerously low. Use extreme caution. Wear protective equipment.',
        severity: 'critical'
      })
      setShowSafetyWarning(true)
    } else if (ph > 12) {
      sound.warning()
      setSafetyWarningData({
        title: 'CRITICAL: Extremely Basic!',
        message: 'pH is dangerously high. Use extreme caution. Wear protective equipment.',
        severity: 'critical'
      })
      setShowSafetyWarning(true)
    } else if (ph < 4 || ph > 11) {
      sound.warning()
      setSafetyWarningData({
        title: 'Warning: Strong pH Level',
        message: 'pH level is entering dangerous range. Handle with care.',
        severity: 'warning'
      })
      setShowSafetyWarning(true)
    }
    
    if (volume > 100) {
      sound.warning()
      setSafetyWarningData({
        title: 'Warning: High Volume',
        message: 'Total volume exceeds 100mL. Consider using a larger container.',
        severity: 'warning'
      })
      setShowSafetyWarning(true)
    }
  }
  
  const updateTemperature = (chemicalId: string, state: any) => {
    // Check if there was a reaction
    const mixState = state.mixture_state || state
    const hasReaction = (mixState?.components?.length || 0) > 1
    
    if (hasReaction) {
      // Exothermic reactions (acid + base) increase temperature
      const components = mixState?.components || []
      const hasAcid = components.some((c: any) => 
        ['HCl', 'H2SO4'].includes(c.name || c.chemical)
      )
      const hasBase = components.some((c: any) => 
        ['NaOH', 'KOH', 'NH3'].includes(c.name || c.chemical)
      )
      
      if (hasAcid && hasBase) {
        // Exothermic reaction
        setTemperature(prev => Math.min(prev + Math.random() * 10 + 5, 95))
      } else {
        // Dilution (slight temperature change)
        setTemperature(prev => prev + Math.random() * 3 - 1)
      }
    } else {
      // Single chemical, slight cooling or warming
      setTemperature(prev => 25 + Math.random() * 2 - 1)
    }
  }
  
  const createBubbleEffect = () => {
    const newBubble = {
      id: Date.now(),
      x: Math.random() * 80 + 10, // 10-90%
      y: 100,
      size: Math.random() * 20 + 10
    }
    
    setBubbles(prev => [...prev, newBubble])
    sound.bubble()
    
    // Remove bubble after animation
    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== newBubble.id))
    }, 2000)
  }
  
  const handleSelectExperiment = (experiment: Experiment) => {
    setCurrentExperiment(experiment)
    setExperimentStep(0)
    setShowExperimentSelector(false)
    sound.click()
    
    // Reset lab for new experiment
    handleReset()
  }

  const handleReset = async () => {
    try {
      sound.click()
      await resetMixture()
      const newState = await getMixtureState()
      setLocalMixtureState(newState)
      setReactionLog([{ id: Date.now(), time: new Date().toLocaleTimeString(), reaction: 'Lab reset' }])
      setTemperature(25)
      setBubbles([])
      setCurrentExperiment(null)
      setExperimentStep(0)
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
    setIsLoadingCamera(true)
    setConnectionTimeout(false)
    
    // Set connection timeout (30 seconds)
    const timeoutId = setTimeout(() => {
      if (isLoadingCamera || (!frame && cameraPermission === 'granted')) {
        setConnectionTimeout(true)
        setIsLoadingCamera(false)
      }
    }, 30000)
    
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        setCameraPermission('granted')
        setShowGestureTutorial(true)
        setIsLoadingCamera(false)
        clearTimeout(timeoutId)
      })
      .catch(() => {
        setCameraPermission('denied')
        setIsLoadingCamera(false)
        clearTimeout(timeoutId)
      })
  }

  const handleRetryConnection = () => {
    setConnectionTimeout(false)
    handleStartCamera()
  }

  const handleStopCamera = () => {
    setCameraPermission('prompt')
    setViewMode('drag')
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
    sound.click()
    const canvas = document.createElement('canvas')
    canvas.width = 1920
    canvas.height = 1200
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Background with gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    bgGradient.addColorStop(0, '#0B1120')
    bgGradient.addColorStop(1, '#1a1f35')
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Header Section
    ctx.fillStyle = '#22d3ee'
    ctx.font = 'bold 56px Arial'
    ctx.fillText('SOLVIA', 60, 80)
    ctx.fillStyle = '#6ee7b7'
    ctx.font = '28px Arial'
    ctx.fillText('Laboratory Report', 250, 78)
    
    // Decorative line
    const headerGradient = ctx.createLinearGradient(60, 110, 1860, 110)
    headerGradient.addColorStop(0, '#22d3ee')
    headerGradient.addColorStop(0.5, '#06b6d4')
    headerGradient.addColorStop(1, '#0891b2')
    ctx.strokeStyle = headerGradient
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(60, 110)
    ctx.lineTo(1860, 110)
    ctx.stroke()
    
    // Metadata
    ctx.fillStyle = '#6ee7b7'
    ctx.font = '20px Arial'
    ctx.fillText(`Generated: ${new Date().toLocaleString()}`, 60, 145)
    ctx.fillStyle = '#22d3ee'
    ctx.fillText(`Mode: ${viewMode === 'cv' ? 'Computer Vision 🎥' : 'Drag & Drop 🖱️'}`, 60, 175)

    // Draw camera frame if available (CV mode)
    const startDrawing = () => {
      if (frame && viewMode === 'cv') {
        const img = new Image()
        img.onload = () => {
          // CV Mode layout
          ctx.drawImage(img, 60, 210, 900, 675)
          finishReportCV()
        }
        img.src = `data:image/jpeg;base64,${frame}`
      } else {
        finishReportDrag()
      }
    }

    const finishReportCV = () => {
      // CV Mode - Camera on left, data on right
      const rightX = 1000
      
      // pH Card
      drawCard(ctx, rightX, 210, 860, 200, '#22d3ee', 'pH Analysis')
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 80px Arial'
      ctx.fillText(phValue.toFixed(2), rightX + 30, 340)
      ctx.fillStyle = '#6ee7b7'
      ctx.font = '28px Arial'
      const phType = phValue < 7 ? '🔴 ACIDIC' : phValue > 7 ? '🔵 BASIC' : '🟢 NEUTRAL'
      ctx.fillText(phType, rightX + 30, 390)
      
      // Temperature Card
      drawCard(ctx, rightX, 450, 860, 200, '#fb923c', 'Temperature')
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 72px Arial'
      ctx.fillText(`${temperature.toFixed(1)}°C`, rightX + 30, 580)
      
      // Safety Status
      drawCard(ctx, rightX, 690, 860, 195, aiStatus === 'safe' ? '#22c55e' : '#ef4444', 'Safety Status')
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 40px Arial'
      ctx.fillText(aiStatus.toUpperCase(), rightX + 30, 850)
      
      // Chemicals section below
      drawChemicalsSection(ctx, 60, 920, 1800)
      
      // Footer
      drawFooter(ctx)
      
      // Export
      exportCanvas()
    }

    const finishReportDrag = () => {
      // Drag Mode - Centered beaker with side panels
      const centerY = 240
      
      // Draw Large Centered Beaker
      drawLargeBeaker(ctx, 760, centerY)
      
      // Left Panel - pH Analysis
      drawCard(ctx, 60, centerY, 620, 520, '#22d3ee', 'pH Analysis')
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 100px Arial'
      ctx.fillText(phValue.toFixed(2), 100, 440)
      ctx.fillStyle = '#6ee7b7'
      ctx.font = 'bold 32px Arial'
      const phType = phValue < 7 ? '🔴 ACIDIC' : phValue > 7 ? '🔵 BASIC' : '🟢 NEUTRAL'
      ctx.fillText(phType, 100, 510)
      
      // pH Scale indicator
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.fillRect(100, 560, 500, 80)
      const phPosition = (phValue / 14) * 500
      const phGradient = ctx.createLinearGradient(100, 560, 600, 560)
      phGradient.addColorStop(0, '#ef4444')
      phGradient.addColorStop(0.35, '#f97316')
      phGradient.addColorStop(0.5, '#22c55e')
      phGradient.addColorStop(0.7, '#3b82f6')
      phGradient.addColorStop(1, '#8b5cf6')
      ctx.fillStyle = phGradient
      ctx.fillRect(100, 560, 500, 80)
      
      // pH marker
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(100 + phPosition, 600, 15, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#22d3ee'
      ctx.lineWidth = 4
      ctx.stroke()
      
      // pH scale labels
      ctx.fillStyle = '#6ee7b7'
      ctx.font = '18px Arial'
      ctx.fillText('0', 100, 690)
      ctx.fillText('7', 345, 690)
      ctx.fillText('14', 580, 690)
      
      // Right Panel - Temperature & Stats
      drawCard(ctx, 1240, centerY, 620, 250, '#fb923c', 'Temperature')
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 80px Arial'
      ctx.fillText(`${temperature.toFixed(1)}°C`, 1280, 390)
      
      // Temperature status
      const tempStatus = temperature < 20 ? '❄️ Cold' : temperature < 30 ? '🌡️ Room Temp' : temperature < 50 ? '🔥 Warm' : '🔥🔥 Hot'
      ctx.fillStyle = '#6ee7b7'
      ctx.font = '24px Arial'
      ctx.fillText(tempStatus, 1280, 440)
      
      // Volume & Components Card
      drawCard(ctx, 1240, centerY + 280, 620, 240, '#8b5cf6', 'Mixture Info')
      const components = mixtureState?.components || []
      const totalVol = components.reduce((sum: number, c: any) => sum + (c.volume || 0), 0)
      
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 56px Arial'
      ctx.fillText(`${totalVol.toFixed(0)} mL`, 1280, 650)
      ctx.fillStyle = '#6ee7b7'
      ctx.font = '24px Arial'
      ctx.fillText(`${components.length} Chemicals Mixed`, 1280, 690)
      
      // Chemicals Grid below
      drawChemicalsGrid(ctx, 60, 800, 1800)
      
      // Footer
      drawFooter(ctx)
      
      // Export
      exportCanvas()
    }

    const exportCanvas = () => {
      canvas.toBlob(function(blob) {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `solvia-lab-report-${Date.now()}.png`
          link.click()
          URL.revokeObjectURL(url)
          sound.success()
        }
      })
    }

    const drawLargeBeaker = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      const width = 360
      const height = 520
      
      // Beaker outline with glow
      ctx.shadowColor = '#22d3ee'
      ctx.shadowBlur = 20
      ctx.strokeStyle = '#22d3ee'
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.moveTo(x + 40, y)
      ctx.lineTo(x, y + 30)
      ctx.lineTo(x, y + height - 30)
      ctx.lineTo(x + 40, y + height)
      ctx.lineTo(x + width - 40, y + height)
      ctx.lineTo(x + width, y + height - 30)
      ctx.lineTo(x + width, y + 30)
      ctx.lineTo(x + width - 40, y)
      ctx.closePath()
      ctx.stroke()
      ctx.shadowBlur = 0
      
      // Calculate fill
      const components = mixtureState?.components || []
      const fillPercentage = Math.min((components.length * 15), 85)
      const fillHeight = (height - 60) * (fillPercentage / 100)
      
      // Get pH color
      const getPhColor = (ph: number) => {
        if (ph < 4) return { r: 239, g: 68, b: 68 }
        if (ph < 6) return { r: 251, g: 146, b: 60 }
        if (ph < 8) return { r: 34, g: 197, b: 94 }
        if (ph < 11) return { r: 59, g: 130, b: 246 }
        return { r: 168, g: 85, b: 247 }
      }
      
      const color = getPhColor(phValue)
      
      // Draw liquid with gradient
      if (fillHeight > 0) {
        const liquidY = y + height - 30 - fillHeight
        const liquidGradient = ctx.createLinearGradient(x, liquidY, x, liquidY + fillHeight)
        liquidGradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`)
        liquidGradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`)
        ctx.fillStyle = liquidGradient
        ctx.fillRect(x + 8, liquidY, width - 16, fillHeight)
        
        // Shine effect
        const shineGradient = ctx.createLinearGradient(x, liquidY, x + width / 3, liquidY)
        shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)')
        shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = shineGradient
        ctx.fillRect(x + 8, liquidY, width / 3, fillHeight)
      }
      
      // Volume markers
      ctx.strokeStyle = '#22d3ee'
      ctx.lineWidth = 2
      for (let i = 1; i <= 4; i++) {
        const markerY = y + (height - 60) * (i / 5) + 30
        ctx.beginPath()
        ctx.moveTo(x + 8, markerY)
        ctx.lineTo(x + 25, markerY)
        ctx.stroke()
        ctx.fillStyle = '#6ee7b7'
        ctx.font = '16px Arial'
        ctx.fillText(`${100 - i * 20}`, x - 45, markerY + 5)
      }
      
      // pH label
      ctx.fillStyle = '#22d3ee'
      ctx.font = 'bold 28px Arial'
      ctx.fillText(`pH ${phValue.toFixed(1)}`, x + width / 2 - 50, y - 15)
    }

    const drawCard = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, title: string) => {
      // Card background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.fillRect(x, y, w, h)
      
      // Card border with gradient
      const borderGradient = ctx.createLinearGradient(x, y, x + w, y)
      borderGradient.addColorStop(0, color)
      borderGradient.addColorStop(1, color + '80')
      ctx.strokeStyle = borderGradient
      ctx.lineWidth = 3
      ctx.strokeRect(x, y, w, h)
      
      // Title bar
      ctx.fillStyle = color + '20'
      ctx.fillRect(x, y, w, 50)
      ctx.fillStyle = color
      ctx.font = 'bold 28px Arial'
      ctx.fillText(title, x + 20, y + 35)
    }

    const drawChemicalsGrid = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number) => {
      drawCard(ctx, x, y, w, 330, '#22d3ee', '🧪 Chemicals Added')
      
      const components = mixtureState?.components || []
      if (components.length > 0) {
        ctx.fillStyle = '#fff'
        ctx.font = '22px Arial'
        const cols = 4
        const colWidth = (w - 100) / cols
        
        components.slice(0, 8).forEach((comp: any, idx: number) => {
          const col = idx % cols
          const row = Math.floor(idx / cols)
          const compX = x + 40 + col * colWidth
          const compY = y + 90 + row * 50
          
          const chemName = comp.chemical_id || comp.name || 'Unknown'
          const vol = comp.volume || 0
          const conc = comp.concentration || comp.molarity || 1.0
          
          // Chemical dot
          ctx.fillStyle = getChemColor(chemName)
          ctx.beginPath()
          ctx.arc(compX, compY, 8, 0, Math.PI * 2)
          ctx.fill()
          
          // Chemical text
          ctx.fillStyle = '#fff'
          ctx.fillText(`${chemName}`, compX + 20, compY + 6)
          ctx.fillStyle = '#6ee7b7'
          ctx.font = '18px Arial'
          ctx.fillText(`${vol.toFixed(1)}mL (${conc.toFixed(1)}M)`, compX + 20, compY + 28)
          ctx.font = '22px Arial'
        })
      } else {
        ctx.fillStyle = '#6ee7b7'
        ctx.font = '22px Arial'
        ctx.fillText('No chemicals added yet', x + 40, y + 90)
      }
    }

    const drawChemicalsSection = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number) => {
      drawCard(ctx, x, y, w, 220, '#22d3ee', '🧪 Chemicals Added')
      
      const components = mixtureState?.components || []
      if (components.length > 0) {
        ctx.fillStyle = '#fff'
        ctx.font = '20px Arial'
        const cols = 3
        const colWidth = w / cols
        
        components.slice(0, 6).forEach((comp: any, idx: number) => {
          const col = idx % cols
          const row = Math.floor(idx / cols)
          const compX = x + 30 + col * colWidth
          const compY = y + 80 + row * 45
          
          const chemName = comp.chemical_id || comp.name || 'Unknown'
          const vol = comp.volume || 0
          const conc = comp.concentration || comp.molarity || 1.0
          
          ctx.fillText(`• ${chemName}: ${vol.toFixed(1)}mL (${conc.toFixed(1)}M)`, compX, compY)
        })
      }
    }

    const getChemColor = (name: string): string => {
      const colors: any = {
        'HCl': '#ef4444',
        'H2SO4': '#dc2626',
        'NaOH': '#3b82f6',
        'KOH': '#2563eb',
        'NH3': '#8b5cf6',
        'NaCl': '#6b7280'
      }
      return colors[name] || '#22d3ee'
    }

    const drawFooter = (ctx: CanvasRenderingContext2D) => {
      // Footer line
      const footerGradient = ctx.createLinearGradient(60, 1160, 1860, 1160)
      footerGradient.addColorStop(0, '#22d3ee')
      footerGradient.addColorStop(0.5, '#06b6d4')
      footerGradient.addColorStop(1, '#0891b2')
      ctx.strokeStyle = footerGradient
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(60, 1160)
      ctx.lineTo(1860, 1160)
      ctx.stroke()
      
      ctx.fillStyle = '#22d3ee'
      ctx.font = 'italic 20px Arial'
      ctx.fillText('SOLVIA - Solution Vision-driven Laboratory with Intelligent Analytics', 60, 1190)
    }
    
    startDrawing()
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0B1120' }}>
      {/* Achievement Notification */}
      {showAchievementNotif && (
        <div className="fixed top-24 right-6 z-[110] glass-panel border-2 border-yellow-400/50 bg-yellow-500/10 p-4 rounded-xl shadow-2xl animate-bounce">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-yellow-400 font-bold text-sm">Achievement Progress!</p>
              <p className="text-cyan-100 text-xs">Check your achievements page 🎯</p>
            </div>
          </div>
        </div>
      )}
      
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
                onClick={() => router.push('/beranda')}
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
              {/* Experiment Selector Button */}
              <button
                onClick={() => {
                  setShowExperimentSelector(true)
                  sound.click()
                }}
                className="glass-card border-amber-400/40 px-4 py-2 rounded-full text-amber-400 hover:bg-amber-500/20 transition-all flex items-center gap-2 text-xs font-semibold glow-soft"
                title="Browse Experiments"
              >
                <BookOpen className="w-4 h-4" />
                Experiments
              </button>
              
              {viewMode === 'cv' && cameraPermission === 'granted' && (
                <button
                  onClick={handleStopCamera}
                  className="glass-card border-red-400/40 px-4 py-2 rounded-full text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2 text-xs font-semibold"
                >
                  <X className="w-4 h-4" />
                  Stop Camera
                </button>
              )}
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
              {isLoadingCamera ? (
                <div className="text-center space-y-6 p-8">
                  <Camera className="w-32 h-32 text-cyan-500/50 mx-auto animate-bounce" />
                  <div className="space-y-3">
                    <p className="text-cyan-300 text-2xl font-bold">Mempersiapkan Computer Vision</p>
                    <p className="text-cyan-300/80 text-lg">Loading AI Model...</p>
                    <div className="flex gap-2 justify-center mt-4">
                      <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
                      <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                  
                  {/* Loading Tips */}
                  <div className="glass-card border-cyan-400/30 p-6 max-w-md mx-auto mt-6 text-left">
                    <p className="text-cyan-400 font-semibold mb-3">💡 Tips saat menunggu:</p>
                    <ul className="space-y-2 text-cyan-100/70 text-sm">
                      <li>✓ Pastikan backend Python sudah running (port 8000)</li>
                      <li>✓ Loading pertama memakan waktu ~20-30 detik</li>
                      <li>✓ Model YOLOv5 sedang diload untuk hand detection</li>
                      <li>✓ Setelah berhasil, deteksi akan lebih cepat</li>
                    </ul>
                  </div>
                  
                  {/* Connection Status */}
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                    <span className="text-cyan-100/60 text-sm">
                      {isConnected ? 'Connected to backend' : 'Connecting to WebSocket...'}
                    </span>
                  </div>
                </div>
              ) : viewMode === 'cv' && cameraPermission === 'granted' ? (
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
                            <RefreshCw className="w-4 h-4" />
                            <span>Retry Connection</span>
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

          {/* Hand Gesture Instructions - Persistent */}
          {viewMode === 'cv' && cameraPermission === 'granted' && (
            <div className="glass-panel p-5 border-purple-400/20 glow-cyan-soft">
              <div className="flex items-center gap-2 mb-3">
                <Hand className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold text-purple-100">Panduan Gesture</h2>
              </div>
              <div className="space-y-3">
                <div className="glass-card p-3 border-purple-400/20 bg-purple-500/5">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">👉</div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-purple-100 mb-1">Pointing</h3>
                      <p className="text-xs text-purple-300/70 leading-relaxed">Telunjuk lurus untuk hover kimia</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-3 border-purple-400/20 bg-purple-500/5">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🤏</div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-purple-100 mb-1">Pinch</h3>
                      <p className="text-xs text-purple-300/70 leading-relaxed">Jepit untuk tambah kimia</p>
                    </div>
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

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-cyan-400" style={{ backgroundColor: '#0B1120' }}>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
