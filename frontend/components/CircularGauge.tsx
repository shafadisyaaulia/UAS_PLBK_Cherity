'use client'

import { useEffect, useState } from 'react'

interface CircularGaugeProps {
  value: number // pH value 0-14
  label?: string
  size?: number
}

export default function CircularGauge({ value, label = 'pH', size = 200 }: CircularGaugeProps) {
  const [displayValue, setDisplayValue] = useState(value)
  
  useEffect(() => {
    // Smooth transition animation
    const interval = setInterval(() => {
      setDisplayValue(prev => {
        const diff = value - prev
        if (Math.abs(diff) < 0.1) return value
        return prev + diff * 0.15
      })
    }, 50)
    return () => clearInterval(interval)
  }, [value])

  // Calculate rotation angle (0-14 pH = 0-270 degrees)
  const rotation = (displayValue / 14) * 270 - 135

  // Get color based on pH
  const getPhColor = (ph: number): string => {
    if (ph < 4) return '#ef4444' // red
    if (ph < 6) return '#f97316' // orange
    if (ph < 8) return '#22c55e' // green
    if (ph < 11) return '#3b82f6' // blue
    return '#8b5cf6' // purple
  }

  const color = getPhColor(displayValue)

  // SVG circle parameters
  const radius = size / 2 - 20
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (displayValue / 14) * (circumference * 0.75)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background glow */}
      <div 
        className="absolute inset-0 rounded-full blur-2xl opacity-30 transition-all duration-500"
        style={{ backgroundColor: color }}
      />
      
      {/* SVG Gauge */}
      <svg width={size} height={size} className="transform -rotate-[135deg]">
        {/* Background arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="12"
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
        />
        
        {/* Animated progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div 
          className="text-6xl font-bold transition-all duration-500"
          style={{ color }}
        >
          {displayValue.toFixed(1)}
        </div>
        <div className="text-sm text-cyan-300/70 font-semibold mt-1">{label}</div>
        <div className="text-xs text-cyan-400/50 mt-1">
          {displayValue < 7 ? 'ACIDIC' : displayValue > 7 ? 'BASIC' : 'NEUTRAL'}
        </div>
      </div>

      {/* Animated needle pointer */}
      <div 
        className="absolute transition-transform duration-500 ease-out"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center',
        }}
      >
        <div 
          className="w-1 rounded-full"
          style={{ 
            height: radius - 10,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}`,
            marginLeft: size / 2 - 0.5
          }}
        />
      </div>
      
      {/* Center dot */}
      <div 
        className="absolute w-4 h-4 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
      />
    </div>
  )
}
