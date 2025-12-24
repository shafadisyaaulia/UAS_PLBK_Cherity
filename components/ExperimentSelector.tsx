'use client'

import { X, Beaker, Clock, TrendingUp, BookOpen, Play, Info } from 'lucide-react'
import { Experiment, EXPERIMENTS } from '../app/data/experiments'
import { useState } from 'react'

interface ExperimentSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectExperiment: (experiment: Experiment) => void
}

export default function ExperimentSelector({ isOpen, onClose, onSelectExperiment }: ExperimentSelectorProps) {
  const [selectedExp, setSelectedExp] = useState<Experiment | null>(null)
  const [filter, setFilter] = useState<'all' | 'basic' | 'intermediate' | 'advanced'>('all')

  if (!isOpen) return null

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic':
        return 'from-green-500 to-emerald-500'
      case 'intermediate':
        return 'from-yellow-500 to-orange-500'
      case 'advanced':
        return 'from-red-500 to-pink-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const filteredExperiments = filter === 'all' 
    ? EXPERIMENTS 
    : EXPERIMENTS.filter(exp => exp.difficulty === filter)

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
      <div className="glass-panel p-8 max-w-6xl w-full relative border-2 border-purple-400/30 glow-cyan-soft my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-300/60 hover:text-purple-300 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4 border-2 border-purple-400/50">
            <Beaker className="w-10 h-10 text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold text-purple-100 mb-2">🧪 Praktikum Kimia</h2>
          <p className="text-purple-200/70">Pilih eksperimen untuk memulai praktikum terpandu</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 justify-center flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
              filter === 'all' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                : 'glass-card text-purple-300/60 hover:text-purple-300'
            }`}
          >
            All ({EXPERIMENTS.length})
          </button>
          <button
            onClick={() => setFilter('basic')}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
              filter === 'basic' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                : 'glass-card text-green-300/60 hover:text-green-300'
            }`}
          >
            Basic
          </button>
          <button
            onClick={() => setFilter('intermediate')}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
              filter === 'intermediate' 
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' 
                : 'glass-card text-yellow-300/60 hover:text-yellow-300'
            }`}
          >
            Intermediate
          </button>
          <button
            onClick={() => setFilter('advanced')}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
              filter === 'advanced' 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' 
                : 'glass-card text-red-300/60 hover:text-red-300'
            }`}
          >
            Advanced
          </button>
        </div>

        {/* Experiment Grid */}
        {!selectedExp ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
            {filteredExperiments.map((exp) => (
              <div
                key={exp.id}
                onClick={() => setSelectedExp(exp)}
                className="glass-card p-5 border-purple-400/20 hover:border-purple-400/50 transition-all cursor-pointer hover:scale-105 group"
              >
                <div className="text-4xl mb-3">{exp.icon}</div>
                <h3 className="text-lg font-bold text-purple-100 mb-2 group-hover:text-purple-300 transition-colors">
                  {exp.name}
                </h3>
                <p className="text-purple-200/60 text-sm mb-3 line-clamp-2">
                  {exp.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getDifficultyColor(exp.difficulty)} text-white`}>
                    {exp.difficulty}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {exp.duration}m
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Experiment Details */
          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
            <button
              onClick={() => setSelectedExp(null)}
              className="text-purple-300 hover:text-purple-200 flex items-center gap-2 text-sm"
            >
              ← Back to list
            </button>

            <div className="glass-card p-6 border-purple-400/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-5xl">{selectedExp.icon}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-purple-100 mb-2">{selectedExp.name}</h3>
                  <p className="text-purple-200/70 mb-3">{selectedExp.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getDifficultyColor(selectedExp.difficulty)} text-white`}>
                      {selectedExp.difficulty.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                      {selectedExp.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedExp.duration} minutes
                    </span>
                  </div>
                </div>
              </div>

              {/* Objective */}
              <div className="glass-card p-4 border-cyan-400/20 bg-cyan-500/5 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-bold text-cyan-100">Objective</h4>
                </div>
                <p className="text-cyan-200/70 text-sm">{selectedExp.objective}</p>
              </div>

              {/* Theory */}
              <div className="glass-card p-4 border-blue-400/20 bg-blue-500/5 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <h4 className="font-bold text-blue-100">Theory</h4>
                </div>
                <p className="text-blue-200/70 text-sm">{selectedExp.theory}</p>
              </div>

              {/* Steps */}
              <div className="glass-card p-4 border-purple-400/20 mb-4">
                <h4 className="font-bold text-purple-100 mb-3">Experiment Steps</h4>
                <div className="space-y-3">
                  {selectedExp.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 border border-purple-400/30">
                        <span className="text-purple-300 font-bold text-sm">{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-purple-100 font-semibold text-sm mb-1">
                          {step.chemical_id} - {step.volume}mL ({step.molarity}M)
                        </p>
                        <p className="text-purple-200/60 text-xs">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Result */}
              <div className="glass-card p-4 border-green-400/20 bg-green-500/5 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-green-400" />
                  <h4 className="font-bold text-green-100">Expected Results</h4>
                </div>
                <ul className="space-y-1 text-sm">
                  <li className="text-green-200/70">
                    <span className="text-green-300 font-semibold">pH Range:</span> {selectedExp.expectedResult.phRange[0]} - {selectedExp.expectedResult.phRange[1]}
                  </li>
                  <li className="text-green-200/70">
                    <span className="text-green-300 font-semibold">Color:</span> {selectedExp.expectedResult.color}
                  </li>
                  <li className="text-green-200/70">
                    <span className="text-green-300 font-semibold">Observation:</span> {selectedExp.expectedResult.observation}
                  </li>
                </ul>
              </div>

              {/* Safety Notes */}
              <div className="glass-card p-4 border-red-400/20 bg-red-500/5">
                <h4 className="font-bold text-red-100 mb-2 flex items-center gap-2">
                  ⚠️ Safety Notes
                </h4>
                <ul className="space-y-1">
                  {selectedExp.safetyNotes.map((note, idx) => (
                    <li key={idx} className="text-red-200/70 text-sm flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => onSelectExperiment(selectedExp)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-3 glow-cyan"
            >
              <Play className="w-5 h-5" />
              Start This Experiment
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
