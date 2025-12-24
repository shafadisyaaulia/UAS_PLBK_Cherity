'use client'

import { Thermometer } from 'lucide-react'

interface TemperatureGaugeProps {
  temperature: number
  size?: number
  showLabel?: boolean
}

export default function TemperatureGauge({ temperature, size = 180, showLabel = true }: TemperatureGaugeProps) {
  const getTemperatureColor = (temp: number) => {
    if (temp < 15) return '#3b82f6' // Cold - Blue
    if (temp < 25) return '#22d3ee' // Cool - Cyan
    if (temp < 35) return '#84cc16' // Normal - Green
    if (temp < 45) return '#f59e0b' // Warm - Orange
    if (temp < 60) return '#f97316' // Hot - Deep Orange
    return '#ef4444' // Very Hot - Red
  }

  const getTemperatureStatus = (temp: number) => {
    if (temp < 15) return 'Very Cold ❄️'
    if (temp < 25) return 'Cold 🧊'
    if (temp < 35) return 'Normal 🌡️'
    if (temp < 45) return 'Warm 🔥'
    if (temp < 60) return 'Hot 🔥🔥'
    return 'Very Hot 🔥🔥🔥'
  }

  const color = getTemperatureColor(temperature)
  const status = getTemperatureStatus(temperature)
  
  // Calculate percentage (0-100°C scale)
  const percentage = Math.min(Math.max(temperature / 100, 0), 1) * 100
  const rotation = (percentage / 100) * 270 - 135 // -135° to +135°

  return (
    <div className="flex flex-col items-center">
      {showLabel && (
        <div className="text-center mb-2">
          <span className="text-cyan-300 text-xs font-semibold">Temperature</span>
        </div>
      )}
      
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer Circle */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          className="transform -rotate-90"
        >
          {/* Background Arc */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
            strokeDasharray="534"
            strokeDashoffset="67"
          />
          
          {/* Temperature Arc */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="534"
            strokeDashoffset={534 - (534 * 0.75 * (percentage / 100))}
            className="transition-all duration-500"
            style={{
              filter: `drop-shadow(0 0 8px ${color})`
            }}
          />

          {/* Gradient for temperature arc */}
          <defs>
            <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="33%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#84cc16" />
              <stop offset="66%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Thermometer 
            className="w-8 h-8 mb-2 transition-colors duration-500" 
            style={{ color }}
          />
          <div className="text-center">
            <div 
              className="text-4xl font-bold transition-colors duration-500"
              style={{ color }}
            >
              {temperature.toFixed(1)}
            </div>
            <div className="text-xs text-cyan-300/60">°C</div>
            <div className="text-xs font-semibold mt-1" style={{ color }}>
              {status}
            </div>
          </div>
        </div>

        {/* Temperature Markers */}
        <div className="absolute inset-0">
          {[0, 25, 50, 75, 100].map((temp, idx) => {
            const angle = (temp / 100) * 270 - 135
            const radian = (angle * Math.PI) / 180
            const x = 100 + 75 * Math.cos(radian)
            const y = 100 + 75 * Math.sin(radian)
            
            return (
              <div
                key={temp}
                className="absolute text-[10px] text-cyan-300/40 font-mono"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {temp}
              </div>
            )
          })}
        </div>
      </div>

      {/* Temperature Scale Legend */}
      {showLabel && (
        <div className="mt-4 flex gap-1">
          {[
            { color: '#3b82f6', label: '0' },
            { color: '#22d3ee', label: '25' },
            { color: '#84cc16', label: '50' },
            { color: '#f59e0b', label: '75' },
            { color: '#ef4444', label: '100' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className="w-6 h-2 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[8px] text-cyan-300/40 mt-1">{item.label}°</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
