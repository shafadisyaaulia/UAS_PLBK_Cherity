'use client'

import { AlertTriangle, X } from 'lucide-react'

interface SafetyWarningProps {
  isOpen: boolean
  onClose: () => void
  warning: {
    type: 'extreme_ph' | 'dangerous_mix' | 'high_volume'
    title: string
    message: string
    severity: 'warning' | 'danger' | 'critical'
  }
}

export default function SafetyWarning({ isOpen, onClose, warning }: SafetyWarningProps) {
  if (!isOpen) return null

  const getSeverityColor = () => {
    switch (warning.severity) {
      case 'critical':
        return 'from-red-600 to-red-800'
      case 'danger':
        return 'from-orange-500 to-red-500'
      case 'warning':
        return 'from-yellow-500 to-orange-500'
      default:
        return 'from-gray-500 to-gray-700'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
      <div className={`glass-panel p-8 max-w-md w-full relative border-2 border-red-400/50 bg-gradient-to-br ${getSeverityColor()} bg-opacity-10`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-300/60 hover:text-red-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto animate-pulse border-2 border-red-400/50">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-red-100 mb-2">{warning.title}</h2>
            <p className="text-red-200/70 leading-relaxed">{warning.message}</p>
          </div>

          <div className="glass-card p-4 border-red-400/30 bg-red-500/10">
            <p className="text-red-100/80 text-sm font-semibold">
              ⚠️ Please ensure proper safety equipment and procedures before continuing
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-red-500/20 border-2 border-red-400/50 text-red-200 px-6 py-3 rounded-xl font-bold hover:bg-red-500/30 transition-all"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
