'use client'

import { useEffect, useState } from 'react'

interface BeakerVisualizationProps {
  phValue: number
  mixtureColor?: string // hex color from backend
  fillPercentage?: number // 0-100
  className?: string
}

export default function BeakerVisualization({ 
  phValue, 
  mixtureColor, 
  fillPercentage = 50,
  className = '' 
}: BeakerVisualizationProps) {
  const [animatedFill, setAnimatedFill] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedFill(fillPercentage), 100)
    return () => clearTimeout(timer)
  }, [fillPercentage])

  // Determine liquid color based on pH if not provided by backend
  const getLiquidColor = (ph: number): string => {
    if (mixtureColor) return mixtureColor
    
    // Chemistry color indicators
    if (ph < 3) return '#dc2626' // Strong acid - red
    if (ph < 5) return '#f97316' // Weak acid - orange
    if (ph < 6.5) return '#fbbf24' // Slightly acidic - yellow
    if (ph < 7.5) return '#22c55e' // Neutral - green
    if (ph < 9) return '#3b82f6' // Slightly basic - blue
    if (ph < 12) return '#6366f1' // Weak base - indigo
    return '#8b5cf6' // Strong base - purple
  }

  const liquidColor = getLiquidColor(phValue)

  return (
    <div className={`relative ${className}`}>
      {/* Beaker container */}
      <svg 
        viewBox="0 0 200 280" 
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
      >
        {/* Beaker glass outline */}
        <path
          d="M 60 20 L 60 200 Q 60 240 100 240 Q 140 240 140 200 L 140 20 Z"
          fill="rgba(255, 255, 255, 0.05)"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="2"
        />
        
        {/* Measurement lines */}
        {[50, 100, 150, 200].map((ml, idx) => (
          <g key={ml}>
            <line
              x1="65"
              y1={220 - idx * 50}
              x2="75"
              y2={220 - idx * 50}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1"
            />
            <text
              x="48"
              y={224 - idx * 50}
              fill="rgba(255, 255, 255, 0.3)"
              fontSize="10"
              fontFamily="monospace"
            >
              {ml}
            </text>
          </g>
        ))}

        {/* Liquid with animated fill */}
        <defs>
          <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={liquidColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor={liquidColor} stopOpacity="1" />
          </linearGradient>
          
          {/* Animated bubbles */}
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          </filter>
        </defs>

        {/* Animated liquid */}
        <path
          d={`M 60 ${220 - (animatedFill * 2)} L 60 200 Q 60 240 100 240 Q 140 240 140 200 L 140 ${220 - (animatedFill * 2)} Z`}
          fill="url(#liquidGradient)"
          style={{ 
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: `drop-shadow(0 0 12px ${liquidColor})`
          }}
        />

        {/* Liquid surface wave effect */}
        <ellipse
          cx="100"
          cy={220 - (animatedFill * 2)}
          rx="40"
          ry="6"
          fill={liquidColor}
          opacity="0.5"
          className="animate-pulse"
        />

        {/* Beaker rim */}
        <rect
          x="55"
          y="15"
          width="90"
          height="10"
          rx="3"
          fill="rgba(255, 255, 255, 0.1)"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="2"
        />
      </svg>

      {/* pH indicator badge */}
      <div 
        className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
        style={{ 
          backgroundColor: `${liquidColor}33`,
          color: liquidColor,
          border: `1px solid ${liquidColor}66`,
          boxShadow: `0 0 8px ${liquidColor}44`
        }}
      >
        pH {phValue.toFixed(1)}
      </div>

      {/* Chemical state indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-cyan-300/60 font-mono">
        {animatedFill}mL
      </div>
    </div>
  )
}
