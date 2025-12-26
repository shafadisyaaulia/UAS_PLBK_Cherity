'use client'

import { useState } from 'react'
import { ArrowLeft, Battery, Zap, Droplet, Shield, FlaskConical, AlertTriangle, Play, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'

const VOLTAIC_CELLS = {
  title: 'Sel Volta (Sel Galvani)',
  description: 'Sel elektrokimia yang mengubah energi kimia menjadi energi listrik spontan',
  components: [
    { name: 'Anoda (-)', description: 'Elektroda tempat oksidasi (kehilangan elektron)', example: 'Zn → Zn²⁺ + 2e⁻' },
    { name: 'Katoda (+)', description: 'Elektroda tempat reduksi (menerima elektron)', example: 'Cu²⁺ + 2e⁻ → Cu' },
    { name: 'Jembatan Garam', description: 'Menjaga netralitas muatan larutan', function: 'KCl, NH₄NO₃' },
    { name: 'Kawat Konduktor', description: 'Mengalirkan elektron dari anoda ke katoda', flow: 'e⁻ flow' }
  ],
  examples: [
    {
      name: 'Sel Daniell',
      anoda: 'Zn/Zn²⁺',
      katoda: 'Cu/Cu²⁺',
      notation: 'Zn | Zn²⁺ || Cu²⁺ | Cu',
      voltage: 'E°sel = +1.10 V',
      reactions: {
        oxidation: 'Zn(s) → Zn²⁺(aq) + 2e⁻   (E° = +0.76 V)',
        reduction: 'Cu²⁺(aq) + 2e⁻ → Cu(s)  (E° = +0.34 V)',
        overall: 'Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)'
      }
    },
    {
      name: 'Sel Leclanche (Baterai Kering)',
      anoda: 'Zn',
      katoda: 'MnO₂ + C',
      notation: 'Zn | NH₄Cl | MnO₂, C',
      voltage: 'E°sel ≈ 1.5 V',
      uses: 'Remote TV, jam dinding, senter'
    }
  ]
}

const ELECTROLYSIS = {
  title: 'Elektrolisis',
  description: 'Reaksi kimia tidak spontan yang memerlukan energi listrik dari luar',
  principles: [
    'Memerlukan arus listrik DC (searah)',
    'Terjadi pada larutan elektrolit atau lelehan',
    'Anoda (+) mengalami oksidasi',
    'Katoda (-) mengalami reduksi',
    'Mengikuti Hukum Faraday'
  ],
  types: [
    {
      type: 'Elektrolisis Larutan',
      examples: [
        {
          name: 'Elektrolisis Air',
          solution: 'H₂O + H₂SO₄ (elektrolit)',
          anoda: '2H₂O → O₂ + 4H⁺ + 4e⁻',
          katoda: '4H₂O + 4e⁻ → 2H₂ + 4OH⁻',
          result: 'Gas H₂ dan O₂ (2:1)',
          uses: 'Produksi H₂ untuk fuel cells'
        },
        {
          name: 'Elektrolisis NaCl',
          solution: 'Larutan NaCl (air garam)',
          anoda: '2Cl⁻ → Cl₂ + 2e⁻',
          katoda: '2H₂O + 2e⁻ → H₂ + 2OH⁻',
          result: 'Gas Cl₂, H₂, dan NaOH',
          uses: 'Industri klor-alkali'
        }
      ]
    },
    {
      type: 'Elektrolisis Lelehan',
      examples: [
        {
          name: 'Elektrolisis NaCl Cair',
          solution: 'NaCl(l) - lelehan garam',
          anoda: '2Cl⁻ → Cl₂ + 2e⁻',
          katoda: 'Na⁺ + e⁻ → Na',
          result: 'Logam Na dan gas Cl₂',
          uses: 'Produksi logam natrium'
        },
        {
          name: 'Elektrolisis Al₂O₃',
          solution: 'Bauksit dalam kriolit cair',
          anoda: '2O²⁻ → O₂ + 4e⁻',
          katoda: 'Al³⁺ + 3e⁻ → Al',
          result: 'Logam aluminium',
          uses: 'Industri aluminium (Hall-Héroult)'
        }
      ]
    }
  ],
  faradayLaws: [
    {
      law: 'Hukum Faraday I',
      statement: 'Massa zat yang dihasilkan sebanding dengan jumlah muatan listrik',
      formula: 'm = (Q × Ar) / (n × F)',
      variables: 'm = massa (g), Q = muatan (C), Ar = massa atom relatif, n = jumlah elektron, F = konstanta Faraday (96500 C/mol)'
    },
    {
      law: 'Hukum Faraday II',
      statement: 'Massa zat yang dihasilkan sebanding dengan massa ekuivalen',
      formula: 'm₁/m₂ = (Ar₁/n₁) / (Ar₂/n₂)'
    }
  ]
}

const CORROSION = {
  title: 'Korosi Logam',
  description: 'Perusakan logam akibat reaksi redoks spontan dengan lingkungan',
  mechanism: {
    title: 'Mekanisme Korosi Besi',
    steps: [
      { step: 1, process: 'Oksidasi Besi', equation: 'Fe(s) → Fe²⁺(aq) + 2e⁻', location: 'Anoda' },
      { step: 2, process: 'Reduksi Oksigen', equation: 'O₂(g) + 4H⁺(aq) + 4e⁻ → 2H₂O(l)', location: 'Katoda' },
      { step: 3, process: 'Pembentukan Karat', equation: '4Fe²⁺ + O₂ + 4H₂O → 2Fe₂O₃·H₂O (karat)', result: 'Karat coklat kemerahan' }
    ],
    factors: [
      'Kelembaban udara tinggi (H₂O)',
      'Adanya oksigen (O₂)',
      'Adanya elektrolit (garam, asam)',
      'Suhu tinggi (mempercepat reaksi)',
      'pH rendah (asam)',
      'Kontak dengan logam lain (korosi galvanik)'
    ]
  },
  prevention: [
    {
      method: 'Pelapisan (Coating)',
      techniques: [
        { name: 'Pengecatan', description: 'Mencegah kontak dengan O₂ dan H₂O', examples: 'Cat anti karat' },
        { name: 'Pelumasan', description: 'Lapisan oli/gemuk', examples: 'Oli pada rantai motor' },
        { name: 'Pelapisan Plastik', description: 'PVC coating', examples: 'Pipa besi berlapis plastik' }
      ]
    },
    {
      method: 'Galvanisasi',
      techniques: [
        { name: 'Pelapisan Seng (Zn)', description: 'Zn lebih reaktif, melindungi Fe', examples: 'Paku berlapis seng' },
        { name: 'Tin Plating', description: 'Pelapisan timah (Sn)', examples: 'Kaleng makanan' },
        { name: 'Chromium Plating', description: 'Krom untuk estetika', examples: 'Bemper mobil' }
      ]
    },
    {
      method: 'Perlindungan Katodik',
      techniques: [
        { name: 'Sacrificial Anode', description: 'Logam lebih reaktif dikorbankan', examples: 'Mg/Zn pada kapal laut' },
        { name: 'Impressed Current', description: 'Arus listrik eksternal', examples: 'Pipa bawah tanah' }
      ]
    },
    {
      method: 'Paduan Logam (Alloy)',
      techniques: [
        { name: 'Stainless Steel', description: 'Fe + Cr + Ni (tahan karat)', examples: 'Peralatan dapur' },
        { name: 'Bronze', description: 'Cu + Sn (tahan korosi)', examples: 'Patung, perhiasan' }
      ]
    }
  ]
}

const ELECTRODE_POTENTIAL = {
  title: 'Potensial Elektroda Standar',
  description: 'Kecenderungan suatu elektroda untuk mengalami reduksi',
  series: [
    { element: 'Li⁺/Li', potential: -3.05, note: 'Reduktor kuat' },
    { element: 'K⁺/K', potential: -2.93 },
    { element: 'Ca²⁺/Ca', potential: -2.87 },
    { element: 'Na⁺/Na', potential: -2.71 },
    { element: 'Mg²⁺/Mg', potential: -2.37 },
    { element: 'Al³⁺/Al', potential: -1.66 },
    { element: 'Zn²⁺/Zn', potential: -0.76 },
    { element: 'Fe²⁺/Fe', potential: -0.44 },
    { element: 'Ni²⁺/Ni', potential: -0.25 },
    { element: 'Sn²⁺/Sn', potential: -0.14 },
    { element: 'Pb²⁺/Pb', potential: -0.13 },
    { element: 'H⁺/H₂', potential: 0.00, note: 'Standar referensi' },
    { element: 'Cu²⁺/Cu', potential: +0.34 },
    { element: 'Ag⁺/Ag', potential: +0.80 },
    { element: 'Hg²⁺/Hg', potential: +0.85 },
    { element: 'Pt²⁺/Pt', potential: +1.20 },
    { element: 'Au³⁺/Au', potential: +1.50, note: 'Oksidator kuat' }
  ],
  applications: [
    'Menentukan reaksi spontan (E°sel > 0)',
    'Menghitung tegangan sel',
    'Memilih bahan anoda dan katoda',
    'Memprediksi korosi galvanik'
  ]
}

export default function ElektrokimiaPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'volta' | 'electrolysis' | 'corrosion' | 'potential'>('volta')
  const [selectedExample, setSelectedExample] = useState<number>(0)

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
              <div className="text-6xl">🔋</div>
              <div>
                <div className="glass-card border-yellow-400/30 px-3 py-1 inline-block mb-2">
                  <span className="text-xs font-semibold text-yellow-400">SMA</span>
                </div>
                <h1 className="text-5xl font-bold text-gradient mb-2">Elektrokimia</h1>
                <p className="text-cyan-100/60 text-lg">10 Eksperimen • 4 Sub-Topik • Advanced</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky top-20 z-40 bg-[#0B1120]/80 backdrop-blur-xl border-b border-cyan-400/20 px-6 py-4">
          <div className="max-w-7xl mx-auto flex gap-4 overflow-x-auto">
            {[
              { id: 'volta', label: 'Sel Volta', icon: Battery },
              { id: 'electrolysis', label: 'Elektrolisis', icon: Zap },
              { id: 'corrosion', label: 'Korosi', icon: Shield },
              { id: 'potential', label: 'Potensial Elektroda', icon: FlaskConical }
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
            
            {activeTab === 'volta' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <Battery className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{VOLTAIC_CELLS.title}</h2>
                  <p className="text-cyan-100/60 text-lg max-w-3xl mx-auto">{VOLTAIC_CELLS.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {VOLTAIC_CELLS.components.map((comp, i) => (
                    <div key={i} className="glass-panel border-yellow-400/20 p-6">
                      <h3 className="text-xl font-bold text-yellow-100 mb-3">{comp.name}</h3>
                      <p className="text-cyan-100/70 mb-3">{comp.description}</p>
                      {comp.example && <div className="glass-card border-yellow-400/30 p-3 bg-yellow-500/5 font-mono text-sm text-yellow-200">{comp.example}</div>}
                    </div>
                  ))}
                </div>

                <div className="space-y-8">
                  {VOLTAIC_CELLS.examples.map((ex, i) => (
                    <div key={i} className="glass-panel border-2 border-cyan-400/20 p-8">
                      <h3 className="text-3xl font-bold text-cyan-100 mb-6">{ex.name}</h3>
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="glass-card border-cyan-400/30 p-4">
                          <div className="text-sm text-cyan-100/50 mb-2">Notasi Sel:</div>
                          <div className="font-mono text-lg text-cyan-100">{ex.notation}</div>
                        </div>
                        <div className="glass-card border-green-400/30 p-4 bg-green-500/5">
                          <div className="text-sm text-green-100/50 mb-2">Tegangan:</div>
                          <div className="font-mono text-2xl text-green-100 font-bold">{ex.voltage}</div>
                        </div>
                      </div>
                      {ex.reactions && (
                        <div className="space-y-3">
                          <div className="glass-card border-red-400/30 p-4 bg-red-500/5">
                            <div className="text-sm text-red-100/50 mb-1">Oksidasi (Anoda):</div>
                            <div className="font-mono text-red-200">{ex.reactions.oxidation}</div>
                          </div>
                          <div className="glass-card border-blue-400/30 p-4 bg-blue-500/5">
                            <div className="text-sm text-blue-100/50 mb-1">Reduksi (Katoda):</div>
                            <div className="font-mono text-blue-200">{ex.reactions.reduction}</div>
                          </div>
                          <div className="glass-card border-green-400/30 p-4 bg-green-500/5">
                            <div className="text-sm text-green-100/50 mb-1">Reaksi Total:</div>
                            <div className="font-mono text-green-200 text-lg font-bold">{ex.reactions.overall}</div>
                          </div>
                        </div>
                      )}
                      {ex.uses && <div className="mt-4 text-cyan-100/60 text-sm">💡 Kegunaan: {ex.uses}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'electrolysis' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <Zap className="w-20 h-20 text-purple-400 mx-auto mb-6 animate-pulse" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{ELECTROLYSIS.title}</h2>
                  <p className="text-cyan-100/60 text-lg max-w-3xl mx-auto">{ELECTROLYSIS.description}</p>
                </div>

                <div className="glass-panel border-2 border-purple-400/30 p-8 bg-purple-500/5">
                  <h3 className="text-2xl font-bold text-purple-100 mb-6">Prinsip Dasar</h3>
                  <ul className="space-y-3">
                    {ELECTROLYSIS.principles.map((p, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                        <span className="text-cyan-100/70">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {ELECTROLYSIS.types.map((type, i) => (
                  <div key={i}>
                    <h3 className="text-3xl font-bold text-cyan-100 mb-6">{type.type}</h3>
                    <div className="grid gap-6">
                      {type.examples.map((ex, j) => (
                        <div key={j} className="glass-panel border-cyan-400/20 p-8">
                          <h4 className="text-2xl font-bold text-cyan-100 mb-4">{ex.name}</h4>
                          <div className="space-y-3 mb-4">
                            <div className="glass-card border-cyan-400/30 p-3">
                              <span className="text-cyan-100/50 text-sm">Larutan: </span>
                              <span className="text-cyan-100 font-semibold">{ex.solution}</span>
                            </div>
                            <div className="glass-card border-red-400/30 p-3 bg-red-500/5">
                              <div className="text-red-100/50 text-sm mb-1">Anoda (+):</div>
                              <div className="font-mono text-red-200">{ex.anoda}</div>
                            </div>
                            <div className="glass-card border-blue-400/30 p-3 bg-blue-500/5">
                              <div className="text-blue-100/50 text-sm mb-1">Katoda (-):</div>
                              <div className="font-mono text-blue-200">{ex.katoda}</div>
                            </div>
                            <div className="glass-card border-green-400/30 p-3 bg-green-500/5">
                              <div className="text-green-100/50 text-sm mb-1">Hasil:</div>
                              <div className="text-green-100 font-semibold">{ex.result}</div>
                            </div>
                          </div>
                          <div className="text-cyan-100/60 text-sm">🏭 Aplikasi: {ex.uses}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="glass-panel border-2 border-orange-400/30 p-8 bg-orange-500/5">
                  <h3 className="text-2xl font-bold text-orange-100 mb-6">Hukum Faraday</h3>
                  <div className="space-y-6">
                    {ELECTROLYSIS.faradayLaws.map((law, i) => (
                      <div key={i} className="glass-card border-orange-400/30 p-6">
                        <h4 className="text-xl font-bold text-orange-100 mb-3">{law.law}</h4>
                        <p className="text-cyan-100/70 mb-4">{law.statement}</p>
                        <div className="font-mono text-xl text-orange-200 bg-black/30 p-4 rounded-lg mb-3">{law.formula}</div>
                        {law.variables && <p className="text-cyan-100/50 text-sm">{law.variables}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'corrosion' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <Shield className="w-20 h-20 text-red-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{CORROSION.title}</h2>
                  <p className="text-cyan-100/60 text-lg max-w-3xl mx-auto">{CORROSION.description}</p>
                </div>

                <div className="glass-panel border-2 border-red-400/30 p-8 bg-red-500/5">
                  <h3 className="text-2xl font-bold text-red-100 mb-6">{CORROSION.mechanism.title}</h3>
                  <div className="space-y-4 mb-8">
                    {CORROSION.mechanism.steps.map((s, i) => (
                      <div key={i} className="glass-card border-red-400/30 p-6">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">{s.step}</div>
                          <h4 className="text-xl font-bold text-red-100">{s.process}</h4>
                        </div>
                        <div className="font-mono text-red-200 bg-black/30 p-3 rounded mb-2">{s.equation}</div>
                        {s.result && <p className="text-red-100/70 text-sm">→ {s.result}</p>}
                        <div className="text-xs text-red-100/50 mt-2">Lokasi: {s.location}</div>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-xl font-bold text-red-100 mb-4">Faktor yang Mempengaruhi:</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {CORROSION.mechanism.factors.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 glass-card border-red-400/20 p-3">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                        <span className="text-cyan-100/70 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-cyan-100 mb-6">Pencegahan Korosi</h3>
                  <div className="space-y-8">
                    {CORROSION.prevention.map((method, i) => (
                      <div key={i} className="glass-panel border-2 border-green-400/20 p-8">
                        <h4 className="text-2xl font-bold text-green-100 mb-6">{method.method}</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {method.techniques.map((tech, j) => (
                            <div key={j} className="glass-card border-green-400/30 p-5 bg-green-500/5">
                              <h5 className="text-lg font-bold text-green-100 mb-2">{tech.name}</h5>
                              <p className="text-cyan-100/70 text-sm mb-3">{tech.description}</p>
                              <div className="text-green-100/60 text-xs">💡 {tech.examples}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'potential' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <FlaskConical className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{ELECTRODE_POTENTIAL.title}</h2>
                  <p className="text-cyan-100/60 text-lg max-w-3xl mx-auto">{ELECTRODE_POTENTIAL.description}</p>
                </div>

                <div className="glass-panel border-2 border-cyan-400/30 p-8">
                  <h3 className="text-2xl font-bold text-cyan-100 mb-6">Deret Volta (E° dalam Volt)</h3>
                  <div className="space-y-2">
                    {ELECTRODE_POTENTIAL.series.map((item, i) => (
                      <div key={i} className={`glass-card p-4 flex items-center justify-between ${item.note ? 'border-yellow-400/30 bg-yellow-500/5' : 'border-cyan-400/20'}`}>
                        <span className="font-mono text-cyan-100 font-semibold">{item.element}</span>
                        <div className="flex items-center gap-4">
                          <span className={`font-mono text-xl font-bold ${item.potential < 0 ? 'text-red-300' : 'text-green-300'}`}>{item.potential.toFixed(2)} V</span>
                          {item.note && <span className="text-yellow-400 text-sm">{item.note}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-panel border-2 border-purple-400/30 p-8 bg-purple-500/5">
                  <h3 className="text-2xl font-bold text-purple-100 mb-6">Aplikasi</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {ELECTRODE_POTENTIAL.applications.map((app, i) => (
                      <div key={i} className="flex items-start gap-3 glass-card border-purple-400/20 p-4">
                        <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                        <span className="text-cyan-100/70">{app}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-panel border-2 border-cyan-400/30 p-12 text-center">
                  <h3 className="text-3xl font-bold text-cyan-100 mb-4">Praktikkan di Lab Virtual!</h3>
                  <p className="text-cyan-100/60 mb-6">Buat sel volta dan amati tegangan yang dihasilkan</p>
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
