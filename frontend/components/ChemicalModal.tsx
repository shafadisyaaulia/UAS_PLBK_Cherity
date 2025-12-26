'use client'

import { X, AlertTriangle, Droplet, Beaker, Shield, Trash2, Heart } from 'lucide-react'
import { ChemicalDetail } from '../app/data/chemicalInfo'

interface ChemicalModalProps {
  chemical: ChemicalDetail
  isOpen: boolean
  onClose: () => void
}

export default function ChemicalModal({ chemical, isOpen, onClose }: ChemicalModalProps) {
  if (!isOpen) return null

  const getDifficultyColor = (type: string) => {
    const colors = {
      strong_acid: 'from-red-500 to-orange-500',
      weak_acid: 'from-yellow-500 to-orange-400',
      strong_base: 'from-blue-500 to-indigo-500',
      weak_base: 'from-cyan-500 to-blue-400',
      neutral_salt: 'from-gray-400 to-gray-500'
    }
    return colors[type as keyof typeof colors] || 'from-gray-400 to-gray-600'
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
      <div className="glass-panel p-8 max-w-4xl w-full relative border-2 border-cyan-400/30 glow-cyan-soft my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cyan-300/60 hover:text-cyan-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-6 mb-8">
          <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${getDifficultyColor(chemical.type)} flex items-center justify-center text-4xl`}>
            {chemical.id}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-cyan-100 mb-2">{chemical.fullName}</h2>
            <p className="text-cyan-300/70 text-lg mb-3">{chemical.formula} • {chemical.molecularWeight} g/mol</p>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getDifficultyColor(chemical.type)} text-white`}>
                {chemical.type.replace('_', ' ').toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                pH: {chemical.pH}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                {chemical.state.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="glass-card p-4 mb-6 border-cyan-400/20">
          <p className="text-cyan-100/80 leading-relaxed">{chemical.description}</p>
        </div>

        {/* Properties */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="glass-card p-5 border-cyan-400/20">
            <div className="flex items-center gap-2 mb-4">
              <Beaker className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-cyan-100">Properties</h3>
            </div>
            <ul className="space-y-2">
              {chemical.properties.map((prop, idx) => (
                <li key={idx} className="text-cyan-200/70 text-sm flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>{prop}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-5 border-cyan-400/20">
            <div className="flex items-center gap-2 mb-4">
              <Droplet className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-cyan-100">Common Uses</h3>
            </div>
            <ul className="space-y-2">
              {chemical.uses.map((use, idx) => (
                <li key={idx} className="text-cyan-200/70 text-sm flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>{use}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Safety Information */}
        <div className="glass-card p-6 border-red-400/30 bg-red-500/5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h3 className="text-xl font-bold text-red-100">Safety Information</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Hazards */}
            <div>
              <h4 className="text-red-300 font-semibold mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Hazards
              </h4>
              <ul className="space-y-1">
                {chemical.safetyInfo.hazards.map((hazard, idx) => (
                  <li key={idx} className="text-red-200/70 text-sm flex items-start gap-2">
                    <span className="text-red-400 mt-1">⚠</span>
                    <span>{hazard}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Handling */}
            <div>
              <h4 className="text-yellow-300 font-semibold mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Safe Handling
              </h4>
              <ul className="space-y-1">
                {chemical.safetyInfo.handling.map((handle, idx) => (
                  <li key={idx} className="text-yellow-200/70 text-sm flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">✓</span>
                    <span>{handle}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* First Aid */}
            <div>
              <h4 className="text-green-300 font-semibold mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                First Aid
              </h4>
              <ul className="space-y-1">
                {chemical.safetyInfo.firstAid.map((aid, idx) => (
                  <li key={idx} className="text-green-200/70 text-sm flex items-start gap-2">
                    <span className="text-green-400 mt-1">+</span>
                    <span>{aid}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disposal */}
            <div>
              <h4 className="text-purple-300 font-semibold mb-2 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Disposal
              </h4>
              <ul className="space-y-1">
                {chemical.safetyInfo.disposal.map((disp, idx) => (
                  <li key={idx} className="text-purple-200/70 text-sm flex items-start gap-2">
                    <span className="text-purple-400 mt-1">♻</span>
                    <span>{disp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Reactions */}
        {chemical.reactions.length > 0 && (
          <div className="glass-card p-5 border-cyan-400/20">
            <h3 className="text-lg font-bold text-cyan-100 mb-4">Common Reactions</h3>
            <div className="space-y-3">
              {chemical.reactions.map((reaction, idx) => (
                <div key={idx} className="glass-card p-3 border-cyan-400/10">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-cyan-200 font-mono text-sm">
                        {chemical.formula} + {reaction.with} → {reaction.produces}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      reaction.type === 'exothermic' ? 'bg-red-500/20 text-red-300' :
                      reaction.type === 'endothermic' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {reaction.type === 'exothermic' ? '🔥 Exothermic' :
                       reaction.type === 'endothermic' ? '❄️ Endothermic' : 'Neutral'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
        >
          Close
        </button>
      </div>
    </div>
  )
}
