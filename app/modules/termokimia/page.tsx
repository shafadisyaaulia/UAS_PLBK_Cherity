'use client'

import { useState } from 'react'
import { ArrowLeft, Flame, Thermometer, Zap, FlaskConical, TrendingUp, TrendingDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'

const CONTENT_DATA = {
  enthalpy: {
    title: 'Perubahan Entalpi (ΔH)',
    types: [
      { name: 'Eksoterm', symbol: 'ΔH < 0', desc: 'Melepas panas ke lingkungan', examples: 'Pembakaran, netralisasi', icon: '🔥', color: 'red' },
      { name: 'Endoterm', symbol: 'ΔH > 0', desc: 'Menyerap panas dari lingkungan', examples: 'Fotosintesis, elektrolisis', icon: '❄️', color: 'blue' }
    ],
    standardTypes: [
      { type: 'ΔH°f', name: 'Entalpi Pembentukan', desc: 'Pembentukan 1 mol senyawa dari unsur-unsurnya' },
      { type: 'ΔH°c', name: 'Entalpi Pembakaran', desc: 'Pembakaran sempurna 1 mol zat' },
      { type: 'ΔH°d', name: 'Entalpi Penguraian', desc: 'Penguraian 1 mol senyawa menjadi unsur-unsurnya' },
      { type: 'ΔH°n', name: 'Entalpi Netralisasi', desc: 'Reaksi 1 mol asam dengan 1 mol basa' }
    ]
  },
  hessLaw: {
    title: 'Hukum Hess',
    statement: 'Perubahan entalpi reaksi hanya bergantung pada keadaan awal dan akhir, tidak bergantung pada jalannya reaksi',
    formula: 'ΔH = ΣΔH°f produk - ΣΔH°f reaktan',
    examples: [
      {
        problem: 'Hitung ΔH pembakaran CH₄',
        given: ['ΔH°f CH₄ = -75 kJ/mol', 'ΔH°f CO₂ = -394 kJ/mol', 'ΔH°f H₂O = -286 kJ/mol'],
        reaction: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
        solution: 'ΔH = [(-394) + 2(-286)] - [(-75) + 0] = -891 kJ/mol'
      }
    ]
  },
  calorimetry: {
    title: 'Kalorimetri',
    principle: 'Mengukur kalor reaksi menggunakan kalorimeter',
    formulas: [
      { name: 'Kalor', equation: 'q = m × c × ΔT', vars: 'q=kalor (J), m=massa (g), c=kalor jenis (J/g°C), ΔT=perubahan suhu' },
      { name: 'Entalpi', equation: 'ΔH = -q / n', vars: 'n=mol zat yang bereaksi' }
    ],
    examples: [
      {
        scenario: 'Netralisasi HCl + NaOH',
        data: ['50 mL HCl 1M + 50 mL NaOH 1M', 'T₁ = 25°C, T₂ = 32°C', 'ρ = 1 g/mL, c = 4.2 J/g°C'],
        calculation: 'q = 100g × 4.2 × 7 = 2940 J = 2.94 kJ',
        enthalpy: 'ΔH = -2.94 kJ / 0.05 mol = -58.8 kJ/mol'
      }
    ]
  },
  energyDiagram: {
    title: 'Diagram Tingkat Energi',
    exothermic: {
      desc: 'Energi produk < Energi reaktan',
      activation: 'Butuh energi aktivasi (Ea)',
      result: 'ΔH negatif, melepas panas'
    },
    endothermic: {
      desc: 'Energi produk > Energi reaktan',
      activation: 'Butuh energi aktivasi (Ea)',
      result: 'ΔH positif, menyerap panas'
    }
  }
}

export default function TermokimiaPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'enthalpy' | 'hess' | 'calorimetry' | 'diagram'>('enthalpy')

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-[#0B1120] via-[#1a1f35] to-[#0B1120]">
        <div className="pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <button onClick={() => router.push('/modules')} className="glass-card border-cyan-400/30 px-4 py-2 mb-6 inline-flex items-center gap-2 hover:bg-white/10 transition-all">
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-100">Kembali ke Modul</span>
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-6xl">🔥</div>
              <div>
                <div className="glass-card border-orange-400/30 px-3 py-1 inline-block mb-2">
                  <span className="text-xs font-semibold text-orange-400">SMA</span>
                </div>
                <h1 className="text-5xl font-bold text-gradient mb-2">Termokimia</h1>
                <p className="text-cyan-100/60 text-lg">9 Eksperimen • 4 Sub-Topik • Kalori & Energi</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky top-20 z-40 bg-[#0B1120]/80 backdrop-blur-xl border-b border-cyan-400/20 px-6 py-4">
          <div className="max-w-7xl mx-auto flex gap-4 overflow-x-auto">
            {[
              { id: 'enthalpy', label: 'Entalpi', icon: Flame },
              { id: 'hess', label: 'Hukum Hess', icon: Zap },
              { id: 'calorimetry', label: 'Kalorimetri', icon: Thermometer },
              { id: 'diagram', label: 'Diagram Energi', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white glow-cyan' : 'glass-card border-cyan-400/30 text-cyan-100 hover:bg-white/10'}`}>
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            
            {activeTab === 'enthalpy' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <Flame className="w-20 h-20 text-orange-400 mx-auto mb-6 animate-pulse" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{CONTENT_DATA.enthalpy.title}</h2>
                  <p className="text-cyan-100/60 text-lg">Energi panas yang menyertai reaksi kimia pada tekanan tetap</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {CONTENT_DATA.enthalpy.types.map((type, i) => (
                    <div key={i} className={`glass-panel border-2 border-${type.color}-400/30 p-8 bg-${type.color}-500/5`}>
                      <div className="text-6xl mb-4 text-center">{type.icon}</div>
                      <h3 className="text-3xl font-bold text-cyan-100 mb-3 text-center">{type.name}</h3>
                      <div className="text-2xl font-mono text-center mb-4 text-gradient">{type.symbol}</div>
                      <p className="text-cyan-100/70 mb-4">{type.desc}</p>
                      <div className="glass-card border-cyan-400/30 p-4">
                        <div className="text-sm text-cyan-100/50 mb-1">Contoh:</div>
                        <div className="text-cyan-100">{type.examples}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-cyan-100 mb-6">Jenis-Jenis Entalpi Standar</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {CONTENT_DATA.enthalpy.standardTypes.map((st, i) => (
                      <div key={i} className="glass-panel border-cyan-400/20 p-6">
                        <div className="text-2xl font-mono text-cyan-400 mb-3">{st.type}</div>
                        <h4 className="text-xl font-bold text-cyan-100 mb-2">{st.name}</h4>
                        <p className="text-cyan-100/70">{st.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hess' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <Zap className="w-20 h-20 text-purple-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{CONTENT_DATA.hessLaw.title}</h2>
                  <p className="text-cyan-100/70 text-lg max-w-3xl mx-auto">{CONTENT_DATA.hessLaw.statement}</p>
                </div>

                <div className="glass-panel border-2 border-purple-400/30 p-12 bg-purple-500/5 text-center">
                  <h3 className="text-2xl font-bold text-purple-100 mb-6">Rumus Perhitungan</h3>
                  <div className="text-4xl font-mono text-gradient mb-6">{CONTENT_DATA.hessLaw.formula}</div>
                </div>

                {CONTENT_DATA.hessLaw.examples.map((ex, i) => (
                  <div key={i} className="glass-panel border-2 border-cyan-400/20 p-8">
                    <h4 className="text-2xl font-bold text-cyan-100 mb-6">{ex.problem}</h4>
                    <div className="space-y-4">
                      <div className="glass-card border-cyan-400/30 p-4">
                        <div className="text-sm text-cyan-100/50 mb-2">Diketahui:</div>
                        <ul className="space-y-1">
                          {ex.given.map((g, j) => (<li key={j} className="text-cyan-100">{g}</li>))}
                        </ul>
                      </div>
                      <div className="glass-card border-orange-400/30 p-4 bg-orange-500/5">
                        <div className="text-sm text-orange-100/50 mb-2">Reaksi:</div>
                        <div className="font-mono text-xl text-orange-200">{ex.reaction}</div>
                      </div>
                      <div className="glass-card border-green-400/30 p-4 bg-green-500/5">
                        <div className="text-sm text-green-100/50 mb-2">Penyelesaian:</div>
                        <div className="font-mono text-lg text-green-200">{ex.solution}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'calorimetry' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <Thermometer className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{CONTENT_DATA.calorimetry.title}</h2>
                  <p className="text-cyan-100/60 text-lg">{CONTENT_DATA.calorimetry.principle}</p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-cyan-100 mb-6">Rumus-Rumus</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {CONTENT_DATA.calorimetry.formulas.map((f, i) => (
                      <div key={i} className="glass-panel border-2 border-cyan-400/30 p-8">
                        <h4 className="text-xl font-bold text-cyan-100 mb-4">{f.name}</h4>
                        <div className="font-mono text-3xl text-gradient mb-4 text-center">{f.equation}</div>
                        <p className="text-cyan-100/60 text-sm">{f.vars}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {CONTENT_DATA.calorimetry.examples.map((ex, i) => (
                  <div key={i} className="glass-panel border-2 border-orange-400/20 p-8">
                    <h4 className="text-2xl font-bold text-orange-100 mb-6">Contoh: {ex.scenario}</h4>
                    <div className="space-y-4">
                      <div className="glass-card border-orange-400/30 p-4">
                        <div className="text-sm text-orange-100/50 mb-2">Data:</div>
                        <ul className="space-y-1">
                          {ex.data.map((d, j) => (<li key={j} className="text-cyan-100">{d}</li>))}
                        </ul>
                      </div>
                      <div className="glass-card border-purple-400/30 p-4 bg-purple-500/5">
                        <div className="text-sm text-purple-100/50 mb-2">Perhitungan Kalor:</div>
                        <div className="font-mono text-lg text-purple-200">{ex.calculation}</div>
                      </div>
                      <div className="glass-card border-green-400/30 p-4 bg-green-500/5">
                        <div className="text-sm text-green-100/50 mb-2">Entalpi Reaksi:</div>
                        <div className="font-mono text-xl text-green-200 font-bold">{ex.enthalpy}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'diagram' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <TrendingUp className="w-20 h-20 text-green-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{CONTENT_DATA.energyDiagram.title}</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="glass-panel border-2 border-red-400/30 p-8 bg-red-500/5">
                    <div className="flex items-center gap-3 mb-6">
                      <TrendingDown className="w-8 h-8 text-red-400" />
                      <h3 className="text-2xl font-bold text-red-100">Reaksi Eksoterm</h3>
                    </div>
                    <div className="space-y-4">
                      <p className="text-cyan-100/70">{CONTENT_DATA.energyDiagram.exothermic.desc}</p>
                      <div className="glass-card border-red-400/30 p-4">
                        <div className="text-red-200">{CONTENT_DATA.energyDiagram.exothermic.activation}</div>
                      </div>
                      <div className="glass-card border-red-400/30 p-4 bg-red-500/10">
                        <div className="text-red-100 font-bold">{CONTENT_DATA.energyDiagram.exothermic.result}</div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel border-2 border-blue-400/30 p-8 bg-blue-500/5">
                    <div className="flex items-center gap-3 mb-6">
                      <TrendingUp className="w-8 h-8 text-blue-400" />
                      <h3 className="text-2xl font-bold text-blue-100">Reaksi Endoterm</h3>
                    </div>
                    <div className="space-y-4">
                      <p className="text-cyan-100/70">{CONTENT_DATA.energyDiagram.endothermic.desc}</p>
                      <div className="glass-card border-blue-400/30 p-4">
                        <div className="text-blue-200">{CONTENT_DATA.energyDiagram.endothermic.activation}</div>
                      </div>
                      <div className="glass-card border-blue-400/30 p-4 bg-blue-500/10">
                        <div className="text-blue-100 font-bold">{CONTENT_DATA.energyDiagram.endothermic.result}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-panel border-2 border-cyan-400/30 p-12 text-center">
                  <h3 className="text-3xl font-bold text-cyan-100 mb-4">Ukur Kalor Reaksi di Lab!</h3>
                  <p className="text-cyan-100/60 mb-6">Eksperimen kalorimetri virtual</p>
                  <button onClick={() => router.push('/praktikum/ph-meter')} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all glow-cyan">
                    Mulai Praktikum Virtual
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}
