'use client'

import { useEffect, useRef } from 'react'

interface SoundEffects {
  click: () => void
  addChemical: () => void
  reaction: () => void
  warning: () => void
  success: () => void
  bubble: () => void
}

export function useSound(): SoundEffects {
  const audioContext = useRef<AudioContext | null>(null)

  useEffect(() => {
    // Initialize Web Audio API
    if (typeof window !== 'undefined') {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    
    return () => {
      audioContext.current?.close()
    }
  }, [])

  const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!audioContext.current) return

    const oscillator = audioContext.current.createOscillator()
    const gainNode = audioContext.current.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.current.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    gainNode.gain.setValueAtTime(0.3, audioContext.current.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration)

    oscillator.start(audioContext.current.currentTime)
    oscillator.stop(audioContext.current.currentTime + duration)
  }

  const click = () => {
    playTone(800, 0.1, 'square')
  }

  const addChemical = () => {
    // Splash sound effect
    if (!audioContext.current) return
    
    const times = [0, 0.05, 0.1, 0.15]
    const frequencies = [400, 300, 250, 200]
    
    times.forEach((time, i) => {
      setTimeout(() => playTone(frequencies[i], 0.1, 'sine'), time * 1000)
    })
  }

  const reaction = () => {
    // Bubbling reaction sound
    if (!audioContext.current) return
    
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const freq = 200 + Math.random() * 200
        playTone(freq, 0.15, 'triangle')
      }, i * 100)
    }
  }

  const warning = () => {
    // Alert sound
    playTone(600, 0.1, 'square')
    setTimeout(() => playTone(600, 0.1, 'square'), 150)
  }

  const success = () => {
    // Success melody
    const melody = [523, 659, 784, 1047] // C, E, G, C
    melody.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.15, 'sine'), i * 100)
    })
  }

  const bubble = () => {
    const freq = 300 + Math.random() * 300
    playTone(freq, 0.2, 'sine')
  }

  return {
    click,
    addChemical,
    reaction,
    warning,
    success,
    bubble
  }
}
