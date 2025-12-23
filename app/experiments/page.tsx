'use client'

import Link from 'next/link'

export default function Experiments() {
  const experiments = [
    {
      id: 1,
      title: 'Acid-Base Titration',
      icon: '🧪',
      description: 'Master the fundamentals of titration by determining the concentration of acids and bases using pH indicators.',
      difficulty: 'Beginner',
      duration: '30 min'
    },
    {
      id: 2,
      title: 'Redox Reactions',
      icon: '⚡',
      description: 'Explore oxidation-reduction reactions and electron transfer in electrochemical cells.',
      difficulty: 'Intermediate',
      duration: '45 min'
    },
    {
      id: 3,
      title: 'Organic Synthesis',
      icon: '🔬',
      description: 'Synthesize organic compounds and learn reaction mechanisms in a safe virtual environment.',
      difficulty: 'Advanced',
      duration: '60 min'
    },
    {
      id: 4,
      title: 'Polymerization',
      icon: '🧬',
      description: 'Create polymers from monomers and study the chemistry of macromolecules.',
      difficulty: 'Intermediate',
      duration: '50 min'
    },
    {
      id: 5,
      title: 'Spectroscopy Analysis',
      icon: '🌈',
      description: 'Identify chemical compounds using UV-Vis, IR, and NMR spectroscopy techniques.',
      difficulty: 'Advanced',
      duration: '40 min'
    },
    {
      id: 6,
      title: 'Chemical Kinetics',
      icon: '⏱️',
      description: 'Measure reaction rates and determine rate laws for various chemical reactions.',
      difficulty: 'Intermediate',
      duration: '35 min'
    }
  ]

  return (
    <div className="min-h-[calc(100vh-8rem)] relative overflow-hidden">
      {/* High-Tech Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900">
        {/* Circuit Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300d4ff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent mb-4">
            Virtual Experiments
          </h1>
          <p className="text-cyan-100/70 text-lg max-w-2xl mx-auto">
            Choose from our collection of interactive chemistry experiments and start learning
          </p>
        </div>

        {/* Experiments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
          {experiments.map((experiment) => (
            <div 
              key={experiment.id}
              className="bg-blue-950/30 backdrop-blur-xl border-2 border-cyan-400/30 rounded-xl p-6 hover:bg-blue-900/40 hover:border-cyan-400/60 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(0,212,255,0.1)] hover:shadow-[0_0_50px_rgba(0,212,255,0.3)] group"
            >
              {/* Icon */}
              <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">
                {experiment.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-3 text-center">
                {experiment.title}
              </h3>

              {/* Description */}
              <p className="text-cyan-100/70 text-sm mb-4 text-center leading-relaxed">
                {experiment.description}
              </p>

              {/* Meta Info */}
              <div className="flex justify-between items-center mb-4 text-xs">
                <span className={`px-3 py-1 rounded-full font-semibold ${
                  experiment.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-300 border border-green-400/40' :
                  experiment.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/40' :
                  'bg-red-500/20 text-red-300 border border-red-400/40'
                }`}>
                  {experiment.difficulty}
                </span>
                <span className="text-cyan-300/70 flex items-center gap-1">
                  <span>⏱️</span>
                  {experiment.duration}
                </span>
              </div>

              {/* Start Button */}
              <Link
                href="/dashboard"
                className="block w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 rounded-lg shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_40px_rgba(0,212,255,0.5)] hover:scale-105 transition-all duration-300 border-2 border-cyan-400/50 text-center"
              >
                Start
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
