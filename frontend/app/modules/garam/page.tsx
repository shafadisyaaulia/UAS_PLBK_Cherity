'use client'

import { useState } from 'react'
import { ArrowLeft, Droplet, TestTube, Zap, FlaskConical, BookOpen, Play, CheckCircle, Beaker, Sparkles, Lightbulb } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'

const SALT_FORMATION = {
  title: 'Pembentukan Garam',
  description: 'Garam terbentuk dari reaksi netralisasi asam dan basa',
  reactions: [
    {
      type: 'Asam + Basa → Garam + Air',
      examples: [
        {
          equation: 'HCl + NaOH → NaCl + H₂O',
          name: 'Natrium Klorida',
          uses: 'Garam dapur'
        },
        {
          equation: 'H₂SO₄ + Ca(OH)₂ → CaSO₄ + 2H₂O',
          name: 'Kalsium Sulfat',
          uses: 'Gips untuk bangunan'
        },
        {
          equation: 'HNO₃ + KOH → KNO₃ + H₂O',
          name: 'Kalium Nitrat',
          uses: 'Pupuk tanaman'
        }
      ]
    }
  ],
  properties: [
    {
      title: 'Sifat Fisik Garam',
      items: [
        'Berbentuk kristal padat',
        'Titik leleh dan didih tinggi',
        'Larut dalam air (kebanyakan)',
        'Tidak menghantarkan listrik (padat)',
        'Menghantarkan listrik (larutan/lelehan)'
      ]
    },
    {
      title: 'Jenis-Jenis Garam',
      items: [
        'Garam Normal: NaCl, KBr',
        'Garam Asam: NaHSO₄, NaHCO₃',
        'Garam Basa: Cu(OH)Cl',
        'Garam Rangkap: K₂SO₄·Al₂(SO₄)₃'
      ]
    }
  ]
}

const HYDROLYSIS = {
  title: 'Hidrolisis Garam',
  description: 'Reaksi ion garam dengan air yang mempengaruhi pH larutan',
  types: [
    {
      id: 'acidic',
      title: 'Garam Bersifat Asam',
      icon: '🔴',
      condition: 'Dari Asam Kuat + Basa Lemah',
      ph: 'pH < 7',
      example: {
        salt: 'NH₄Cl (Amonium Klorida)',
        hydrolysis: 'NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺',
        explanation: 'Ion NH₄⁺ bereaksi dengan air menghasilkan H₃O⁺ (asam)',
        uses: 'Pupuk tanaman, elektrolit baterai'
      },
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'basic',
      title: 'Garam Bersifat Basa',
      icon: '🔵',
      condition: 'Dari Asam Lemah + Basa Kuat',
      ph: 'pH > 7',
      example: {
        salt: 'CH₃COONa (Natrium Asetat)',
        hydrolysis: 'CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻',
        explanation: 'Ion CH₃COO⁻ bereaksi dengan air menghasilkan OH⁻ (basa)',
        uses: 'Pengawet makanan, buffer solution'
      },
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'neutral',
      title: 'Garam Bersifat Netral',
      icon: '🟢',
      condition: 'Dari Asam Kuat + Basa Kuat',
      ph: 'pH = 7',
      example: {
        salt: 'NaCl (Natrium Klorida)',
        hydrolysis: 'Tidak terjadi hidrolisis',
        explanation: 'Na⁺ dan Cl⁻ tidak bereaksi dengan air',
        uses: 'Garam dapur, pengawet'
      },
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'both',
      title: 'Hidrolisis Total',
      icon: '🟣',
      condition: 'Dari Asam Lemah + Basa Lemah',
      ph: 'pH ≈ 7 (tergantung Ka dan Kb)',
      example: {
        salt: 'CH₃COONH₄ (Amonium Asetat)',
        hydrolysis: 'Kation dan anion sama-sama terhidrolisis',
        explanation: 'pH ditentukan oleh perbandingan Ka dan Kb',
        uses: 'Buffer solution, laboratorium'
      },
      color: 'from-purple-500 to-pink-500'
    }
  ]
}

const ELECTROLYTES = {
  title: 'Larutan Elektrolit',
  description: 'Larutan yang dapat menghantarkan arus listrik',
  comparison: [
    {
      type: 'Elektrolit Kuat',
      icon: '⚡⚡⚡',
      characteristics: [
        'Terionisasi sempurna dalam air',
        'Lampu terang, gelembung banyak',
        'Derajat ionisasi (α) = 1'
      ],
      examples: [
        { compound: 'HCl, H₂SO₄, HNO₃', category: 'Asam kuat' },
        { compound: 'NaOH, KOH, Ca(OH)₂', category: 'Basa kuat' },
        { compound: 'NaCl, KBr, Na₂SO₄', category: 'Garam' }
      ],
      color: 'from-yellow-500 to-orange-500'
    },
    {
      type: 'Elektrolit Lemah',
      icon: '⚡',
      characteristics: [
        'Terionisasi sebagian dalam air',
        'Lampu redup, gelembung sedikit',
        'Derajat ionisasi (α) < 1'
      ],
      examples: [
        { compound: 'CH₃COOH, HF, H₂CO₃', category: 'Asam lemah' },
        { compound: 'NH₃, NH₄OH', category: 'Basa lemah' },
        { compound: 'Garam yang terhidrolisis', category: 'Garam tertentu' }
      ],
      color: 'from-cyan-500 to-blue-500'
    },
    {
      type: 'Non-Elektrolit',
      icon: '⚪',
      characteristics: [
        'Tidak terionisasi dalam air',
        'Lampu mati, tidak ada gelembung',
        'Tetap molekul utuh'
      ],
      examples: [
        { compound: 'C₁₂H₂₂O₁₁ (gula)', category: 'Gula' },
        { compound: 'C₂H₅OH (etanol)', category: 'Alkohol' },
        { compound: 'CO(NH₂)₂ (urea)', category: 'Urea' }
      ],
      color: 'from-gray-500 to-slate-500'
    }
  ],
  testProcedure: {
    title: 'Cara Menguji Elektrolit',
    steps: [
      'Siapkan rangkaian uji elektrolit (baterai, lampu, elektroda)',
      'Masukkan elektroda ke dalam larutan yang diuji',
      'Amati nyala lampu dan gelembung gas',
      'Terang & banyak gelembung = Elektrolit Kuat',
      'Redup & sedikit gelembung = Elektrolit Lemah',
      'Mati & tidak ada gelembung = Non-Elektrolit'
    ]
  }
}

const COLLOIDS = {
  title: 'Sistem Koloid',
  description: 'Campuran antara larutan dan suspensi dengan ukuran partikel 1-100 nm',
  types: [
    {
      name: 'Sol',
      phase: 'Padat dalam Cair',
      examples: 'Cat, tinta, lumpur',
      icon: '🎨'
    },
    {
      name: 'Emulsi',
      phase: 'Cair dalam Cair',
      examples: 'Susu, mayones, santan',
      icon: '🥛'
    },
    {
      name: 'Busa',
      phase: 'Gas dalam Cair',
      examples: 'Sabun, krim kocok',
      icon: '🫧'
    },
    {
      name: 'Aerosol Cair',
      phase: 'Cair dalam Gas',
      examples: 'Kabut, awan, hairspray',
      icon: '☁️'
    },
    {
      name: 'Aerosol Padat',
      phase: 'Padat dalam Gas',
      examples: 'Asap, debu',
      icon: '💨'
    },
    {
      name: 'Gel',
      phase: 'Cair dalam Padat',
      examples: 'Agar-agar, jeli, keju',
      icon: '🧊'
    }
  ],
  properties: [
    {
      name: 'Efek Tyndall',
      description: 'Menghamburkan cahaya',
      demo: 'Sorot laser pada susu → terlihat jalur cahaya'
    },
    {
      name: 'Gerak Brown',
      description: 'Partikel bergerak acak terus-menerus',
      demo: 'Amati koloid di mikroskop → partikel bergerak zig-zag'
    },
    {
      name: 'Elektroforesis',
      description: 'Partikel bermuatan bergerak dalam medan listrik',
      demo: 'Koloid dalam medan listrik → bergerak ke elektroda'
    },
    {
      name: 'Adsorpsi',
      description: 'Menyerap zat lain di permukaan',
      demo: 'Karbon aktif menyerap racun dan bau'
    }
  ]
}

export default function GaramPage() {
  const router = useRouter()
  const [selectedHydrolysis, setSelectedHydrolysis] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'formation' | 'hydrolysis' | 'electrolyte' | 'colloid'>('formation')

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-[#0B1120] via-[#1a1f35] to-[#0B1120]">
        
        {/* Header */}
        <div className="pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.push('/modules')}
              className="glass-card border-cyan-400/30 px-4 py-2 mb-6 inline-flex items-center gap-2 hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-100">Kembali ke Modul</span>
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="text-6xl">💎</div>
              <div>
                <div className="glass-card border-blue-400/30 px-3 py-1 inline-block mb-2">
                  <span className="text-xs font-semibold text-blue-400">SMP</span>
                </div>
                <h1 className="text-5xl font-bold text-gradient mb-2">Garam & Larutan</h1>
                <p className="text-cyan-100/60 text-lg">8 Eksperimen • 4 Sub-Topik • Lengkap</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="sticky top-20 z-40 bg-[#0B1120]/80 backdrop-blur-xl border-b border-cyan-400/20 px-6 py-4">
          <div className="max-w-7xl mx-auto flex gap-4 overflow-x-auto">
            {[
              { id: 'formation', label: 'Pembentukan Garam', icon: Sparkles },
              { id: 'hydrolysis', label: 'Hidrolisis', icon: Droplet },
              { id: 'electrolyte', label: 'Elektrolit', icon: Zap },
              { id: 'colloid', label: 'Koloid', icon: FlaskConical }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white glow-cyan'
                      : 'glass-card border-cyan-400/30 text-cyan-100 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            
            {/* Tab: Pembentukan Garam */}
            {activeTab === 'formation' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <Sparkles className="w-20 h-20 text-blue-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{SALT_FORMATION.title}</h2>
                  <p className="text-cyan-100/60 text-lg max-w-3xl mx-auto">{SALT_FORMATION.description}</p>
                </div>

                {/* Reaction Formula */}
                <div className="glass-panel border-2 border-blue-400/30 p-12 text-center bg-blue-500/5">
                  <div className="text-4xl font-mono text-gradient mb-6">
                    Asam + Basa → Garam + Air
                  </div>
                  <p className="text-cyan-100/60">Reaksi Netralisasi</p>
                </div>

                {/* Examples */}
                <div>
                  <h3 className="text-3xl font-bold text-cyan-100 mb-6">Contoh Pembentukan Garam</h3>
                  <div className="space-y-6">
                    {SALT_FORMATION.reactions[0].examples.map((example, i) => (
                      <div key={i} className="glass-panel border-cyan-400/20 p-8">
                        <div className="grid md:grid-cols-3 gap-6 items-center">
                          <div className="md:col-span-2">
                            <div className="font-mono text-2xl text-cyan-100 mb-4 bg-black/30 p-4 rounded-lg">
                              {example.equation}
                            </div>
                            <div className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                              <div>
                                <div className="text-green-100 font-semibold mb-1">{example.name}</div>
                                <div className="text-cyan-100/60 text-sm">Kegunaan: {example.uses}</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-6xl">💎</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Properties */}
                <div className="grid md:grid-cols-2 gap-8">
                  {SALT_FORMATION.properties.map((prop, i) => (
                    <div key={i} className="glass-panel border-2 border-cyan-400/20 p-8">
                      <h3 className="text-2xl font-bold text-cyan-100 mb-6">{prop.title}</h3>
                      <ul className="space-y-3">
                        {prop.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2" />
                            <span className="text-cyan-100/70">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Hidrolisis */}
            {activeTab === 'hydrolysis' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <Droplet className="w-20 h-20 text-purple-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{HYDROLYSIS.title}</h2>
                  <p className="text-cyan-100/70 text-lg max-w-3xl mx-auto">{HYDROLYSIS.description}</p>
                </div>

                <div className="grid gap-8">
                  {HYDROLYSIS.types.map((type) => (
                    <div
                      key={type.id}
                      className={`glass-panel border-2 p-8 cursor-pointer transition-all ${
                        selectedHydrolysis === type.id
                          ? 'border-cyan-400/50 bg-cyan-500/10'
                          : 'border-cyan-400/20 hover:border-cyan-400/40'
                      }`}
                      onClick={() => setSelectedHydrolysis(selectedHydrolysis === type.id ? null : type.id)}
                    >
                      <div className="flex items-start gap-6">
                        <div className="text-6xl">{type.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-3xl font-bold text-cyan-100 mb-3">{type.title}</h3>
                          
                          <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div className="glass-card border-cyan-400/30 p-4">
                              <div className="text-sm text-cyan-100/50 mb-1">Kondisi:</div>
                              <div className="text-cyan-100 font-semibold">{type.condition}</div>
                            </div>
                            <div className="glass-card border-cyan-400/30 p-4">
                              <div className="text-sm text-cyan-100/50 mb-1">Sifat Larutan:</div>
                              <div className="text-cyan-100 font-semibold text-xl">{type.ph}</div>
                            </div>
                          </div>

                          {selectedHydrolysis === type.id && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                              <div className="glass-card border-purple-400/30 p-6 bg-purple-500/5">
                                <div className="text-lg font-bold text-purple-100 mb-4">Contoh: {type.example.salt}</div>
                                <div className="space-y-3">
                                  <div>
                                    <div className="text-sm text-purple-100/50 mb-1">Persamaan Hidrolisis:</div>
                                    <div className="font-mono text-lg text-purple-200 bg-black/30 p-3 rounded">
                                      {type.example.hydrolysis}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-purple-100/50 mb-1">Penjelasan:</div>
                                    <p className="text-purple-100/80">{type.example.explanation}</p>
                                  </div>
                                  <div>
                                    <div className="text-sm text-purple-100/50 mb-1">Kegunaan:</div>
                                    <p className="text-purple-100 font-semibold">{type.example.uses}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Elektrolit */}
            {activeTab === 'electrolyte' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <Zap className="w-20 h-20 text-yellow-400 mx-auto mb-6 animate-pulse" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{ELECTROLYTES.title}</h2>
                  <p className="text-cyan-100/60 text-lg max-w-3xl mx-auto">{ELECTROLYTES.description}</p>
                </div>

                <div className="grid gap-8">
                  {ELECTROLYTES.comparison.map((elec, i) => (
                    <div key={i} className={`glass-panel border-2 border-cyan-400/20 p-8 bg-gradient-to-br ${elec.color} bg-opacity-5`}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="text-5xl">{elec.icon}</div>
                        <h3 className="text-3xl font-bold text-cyan-100">{elec.type}</h3>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-cyan-100 mb-3">Ciri-Ciri:</h4>
                        <ul className="space-y-2">
                          {elec.characteristics.map((char, j) => (
                            <li key={j} className="flex items-start gap-3 glass-card border-cyan-400/20 p-3">
                              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                              <span className="text-cyan-100/70">{char}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-cyan-100 mb-3">Contoh Senyawa:</h4>
                        <div className="grid gap-3">
                          {elec.examples.map((ex, j) => (
                            <div key={j} className="glass-card border-cyan-400/30 p-4">
                              <div className="text-cyan-100 font-mono mb-1">{ex.compound}</div>
                              <div className="text-cyan-100/50 text-sm">{ex.category}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Test Procedure */}
                <div className="glass-panel border-2 border-green-400/30 p-8 bg-green-500/5">
                  <div className="flex items-center gap-3 mb-6">
                    <Beaker className="w-8 h-8 text-green-400" />
                    <h3 className="text-2xl font-bold text-green-100">{ELECTROLYTES.testProcedure.title}</h3>
                  </div>
                  <ol className="space-y-4">
                    {ELECTROLYTES.testProcedure.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-green-100/80 pt-1">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* Tab: Koloid */}
            {activeTab === 'colloid' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <FlaskConical className="w-20 h-20 text-pink-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{COLLOIDS.title}</h2>
                  <p className="text-cyan-100/60 text-lg max-w-3xl mx-auto">{COLLOIDS.description}</p>
                </div>

                {/* Types */}
                <div>
                  <h3 className="text-3xl font-bold text-cyan-100 mb-6">Jenis-Jenis Koloid</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {COLLOIDS.types.map((type, i) => (
                      <div key={i} className="glass-panel border-2 border-pink-400/20 p-6 hover:border-pink-400/40 transition-all text-center">
                        <div className="text-5xl mb-4">{type.icon}</div>
                        <h4 className="text-xl font-bold text-pink-100 mb-2">{type.name}</h4>
                        <div className="glass-card border-pink-400/30 p-3 mb-3 bg-pink-500/5">
                          <div className="text-sm text-pink-200 font-mono">{type.phase}</div>
                        </div>
                        <p className="text-cyan-100/60 text-sm">{type.examples}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Properties */}
                <div>
                  <h3 className="text-3xl font-bold text-cyan-100 mb-6">Sifat-Sifat Koloid</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {COLLOIDS.properties.map((prop, i) => (
                      <div key={i} className="glass-panel border-2 border-cyan-400/20 p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <Lightbulb className="w-6 h-6 text-yellow-400" />
                          <h4 className="text-xl font-bold text-cyan-100">{prop.name}</h4>
                        </div>
                        <p className="text-cyan-100/70 mb-4">{prop.description}</p>
                        <div className="glass-card border-yellow-400/30 p-4 bg-yellow-500/5">
                          <div className="text-sm text-yellow-100/50 mb-1">Demo:</div>
                          <p className="text-yellow-100 text-sm">{prop.demo}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="glass-panel border-2 border-cyan-400/30 p-12 text-center">
                  <h3 className="text-3xl font-bold text-cyan-100 mb-4">Coba Eksperimen Elektrolit!</h3>
                  <p className="text-cyan-100/60 mb-6">Uji berbagai larutan di lab virtual</p>
                  <button
                    onClick={() => router.push('/praktikum/ph-meter')}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all glow-cyan"
                  >
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
