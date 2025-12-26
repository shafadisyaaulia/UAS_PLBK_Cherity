'use client'

import { useState } from 'react'
import { ArrowLeft, Droplet, TestTube2, Beaker, FlaskConical, Thermometer, AlertCircle, CheckCircle, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'

const PH_SCALE = {
  title: 'Skala pH (0-14)',
  description: 'Mengukur tingkat keasaman atau kebasaan suatu larutan',
  ranges: [
    { range: '0-3', type: 'Asam Kuat', color: 'bg-red-600', examples: ['HCl, H₂SO₄, HNO₃', 'Asam lambung (pH 1-2)', 'Cairan aki'], icon: '🔴' },
    { range: '4-6', type: 'Asam Lemah', color: 'bg-orange-500', examples: ['Cuka (pH 3)', 'Jus jeruk (pH 4)', 'Hujan asam (pH 5)'], icon: '🟠' },
    { range: '7', type: 'Netral', color: 'bg-green-500', examples: ['Air murni', 'Air garam', 'Darah (pH 7.4)'], icon: '🟢' },
    { range: '8-10', type: 'Basa Lemah', color: 'bg-blue-500', examples: ['Air laut (pH 8)', 'Pasta gigi (pH 9)', 'Sabun'], icon: '🔵' },
    { range: '11-14', type: 'Basa Kuat', color: 'bg-purple-600', examples: ['NaOH, KOH', 'Pemutih (pH 12)', 'Pembersih saluran'], icon: '🟣' }
  ],
  formula: {
    pH: 'pH = -log[H⁺]',
    pOH: 'pOH = -log[OH⁻]',
    relation: 'pH + pOH = 14',
    water: '[H⁺] × [OH⁻] = 10⁻¹⁴'
  }
}

const INDICATORS = {
  title: 'Indikator Asam-Basa',
  description: 'Zat yang berubah warna berdasarkan pH larutan',
  types: [
    {
      name: 'Kertas Lakmus',
      types: [
        { color: 'Lakmus Merah', asam: 'Merah', netral: 'Merah', basa: 'Biru', range: '5-8' },
        { color: 'Lakmus Biru', asam: 'Merah', netral: 'Biru', basa: 'Biru', range: '5-8' }
      ]
    },
    {
      name: 'Indikator Universal',
      description: 'Campuran beberapa indikator untuk range pH 1-14',
      colors: [
        { pH: '1-3', color: 'Merah', desc: 'Asam kuat' },
        { pH: '4-6', color: 'Oranye-Kuning', desc: 'Asam lemah' },
        { pH: '7', color: 'Hijau', desc: 'Netral' },
        { pH: '8-10', color: 'Biru', desc: 'Basa lemah' },
        { pH: '11-14', color: 'Ungu', desc: 'Basa kuat' }
      ]
    },
    {
      name: 'Indikator Alami',
      sources: [
        { source: 'Kubis Ungu', asam: 'Merah/Pink', basa: 'Hijau/Kuning', extract: 'Antosianin' },
        { source: 'Kunyit', asam: 'Kuning', basa: 'Merah', extract: 'Kurkumin' },
        { source: 'Bunga Sepatu', asam: 'Pink', basa: 'Hijau', extract: 'Antosianin' }
      ]
    },
    {
      name: 'Indikator Kimia',
      list: [
        { name: 'Fenolftalein (PP)', range: '8.2-10.0', asam: 'Tidak berwarna', basa: 'Pink/Merah muda' },
        { name: 'Metil Oranye (MO)', range: '3.1-4.4', asam: 'Merah', basa: 'Kuning' },
        { name: 'Metil Merah (MM)', range: '4.4-6.2', asam: 'Merah', basa: 'Kuning' },
        { name: 'Bromtimol Biru (BTB)', range: '6.0-7.6', asam: 'Kuning', basa: 'Biru' }
      ]
    }
  ]
}

const NEUTRALIZATION = {
  title: 'Reaksi Netralisasi',
  description: 'Reaksi antara asam dan basa menghasilkan garam dan air',
  equation: 'Asam + Basa → Garam + Air',
  generalFormula: 'HₓA + B(OH)ₓ → BAₓ + xH₂O',
  examples: [
    {
      name: 'Netralisasi Sempurna',
      equation: 'HCl + NaOH → NaCl + H₂O',
      type: 'Asam kuat + Basa kuat',
      result: 'pH = 7 (netral)',
      application: 'Obat maag (menetralkan asam lambung)',
      explanation: 'Ion H⁺ dari asam bereaksi dengan ion OH⁻ dari basa membentuk air'
    },
    {
      name: 'Netralisasi Sulfat',
      equation: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',
      type: 'Asam diprotik + Basa',
      result: 'Natrium sulfat + air',
      application: 'Industri deterjen',
      explanation: 'Setiap molekul H₂SO₄ melepas 2 ion H⁺, perlu 2 molekul NaOH'
    },
    {
      name: 'Netralisasi Karbonat',
      equation: '2HCl + Ca(OH)₂ → CaCl₂ + 2H₂O',
      type: 'Asam + Basa bervalensi 2',
      result: 'Kalsium klorida + air',
      application: 'Pengolahan air',
      explanation: 'Ca(OH)₂ menyediakan 2 ion OH⁻ untuk menetralisir 2 ion H⁺'
    }
  ],
  applications: [
    'Mengobati sengatan lebah (basa) dengan cuka (asam)',
    'Obat maag menetralkan kelebihan asam lambung',
    'Kapur tohor menetralkan tanah asam',
    'Menetralkan tumpahan asam/basa di laboratorium'
  ]
}

const TITRATION = {
  title: 'Titrasi Asam-Basa',
  description: 'Metode analisis kuantitatif untuk menentukan konsentrasi larutan',
  procedure: [
    { step: 1, action: 'Mengisi buret', detail: 'Isi buret dengan larutan standar (titran) hingga angka 0' },
    { step: 2, action: 'Menyiapkan analit', detail: 'Pipet larutan yang dianalisis (analit) ke erlenmeyer, tambahkan indikator' },
    { step: 3, action: 'Mentitrasi', detail: 'Teteskan titran sambil mengaduk hingga terjadi perubahan warna (titik ekuivalen)' },
    { step: 4, action: 'Mencatat volume', detail: 'Catat volume titran yang digunakan' },
    { step: 5, action: 'Menghitung', detail: 'Gunakan rumus: M₁V₁/n₁ = M₂V₂/n₂' }
  ],
  types: [
    {
      type: 'Asam Kuat vs Basa Kuat',
      example: 'HCl + NaOH',
      indicator: 'Fenolftalein / Metil Oranye',
      pHTitikEkuivalen: '7',
      curve: 'Lompatan besar di pH 7'
    },
    {
      type: 'Asam Lemah vs Basa Kuat',
      example: 'CH₃COOH + NaOH',
      indicator: 'Fenolftalein',
      pHTitikEkuivalen: '> 7 (8-9)',
      curve: 'Lompatan di pH basa'
    },
    {
      type: 'Asam Kuat vs Basa Lemah',
      example: 'HCl + NH₃',
      indicator: 'Metil Oranye',
      pHTitikEkuivalen: '< 7 (5-6)',
      curve: 'Lompatan di pH asam'
    }
  ],
  calculations: {
    formula: 'M₁ × V₁ × n₁ = M₂ × V₂ × n₂',
    variables: 'M = Molaritas, V = Volume, n = valensi',
    example: {
      problem: '25 mL HCl dititrasi dengan NaOH 0.1 M. Titik ekuivalen tercapai pada 30 mL. Hitung [HCl]!',
      solution: 'M₁ × 25 × 1 = 0.1 × 30 × 1\nM₁ = 3/25 = 0.12 M'
    }
  }
}

const BUFFER = {
  title: 'Larutan Penyangga (Buffer)',
  description: 'Larutan yang dapat mempertahankan pH relatif tetap meski ditambah sedikit asam/basa',
  types: [
    {
      type: 'Buffer Asam',
      composition: 'Asam lemah + Garamnya (basa konjugasi)',
      example: 'CH₃COOH + CH₃COONa',
      pHRange: 'pH < 7',
      mechanism: {
        addAcid: 'H⁺ + CH₃COO⁻ → CH₃COOH (ion asetat mengikat H⁺)',
        addBase: 'OH⁻ + CH₃COOH → CH₃COO⁻ + H₂O (asam asetat menetralkan OH⁻)'
      },
      applications: ['Aspirin (pH 4-5)', 'Obat tetes mata']
    },
    {
      type: 'Buffer Basa',
      composition: 'Basa lemah + Garamnya (asam konjugasi)',
      example: 'NH₃ + NH₄Cl',
      pHRange: 'pH > 7',
      mechanism: {
        addAcid: 'H⁺ + NH₃ → NH₄⁺ (amonia mengikat H⁺)',
        addBase: 'OH⁻ + NH₄⁺ → NH₃ + H₂O (ion amonium menetralkan OH⁻)'
      },
      applications: ['Shampo (pH 9-10)', 'Pembersih']
    }
  ],
  biologicalBuffers: [
    {
      system: 'Buffer Darah (H₂CO₃/HCO₃⁻)',
      pH: '7.35 - 7.45',
      importance: 'Menjaga pH darah agar enzim bekerja optimal',
      disease: 'Asidosis (pH < 7.35), Alkalosis (pH > 7.45)'
    },
    {
      system: 'Buffer Fosfat (H₂PO₄⁻/HPO₄²⁻)',
      pH: '6.8 - 7.4',
      importance: 'Mengatur pH cairan intraseluler',
      location: 'Dalam sel dan urin'
    }
  ],
  calculations: {
    hendersonHasselbalch: 'pH = pKa + log([A⁻]/[HA])',
    forAcid: 'pH = pKa + log([garam]/[asam])',
    forBase: 'pOH = pKb + log([garam]/[basa])'
  }
}

const PROPERTIES = {
  acids: {
    title: 'Sifat-Sifat Asam',
    taste: 'Rasa asam/masam',
    litmus: 'Merubah lakmus biru → merah',
    properties: [
      'Melepaskan ion H⁺ dalam air',
      'pH < 7',
      'Korosif terhadap logam (menghasilkan H₂)',
      'Konduktor listrik',
      'Bereaksi dengan basa membentuk garam'
    ],
    examples: [
      { name: 'Asam Klorida (HCl)', uses: 'Pembersih toilet, industri' },
      { name: 'Asam Sulfat (H₂SO₄)', uses: 'Aki mobil, pupuk' },
      { name: 'Asam Asetat (CH₃COOH)', uses: 'Cuka makan' },
      { name: 'Asam Sitrat', uses: 'Jus lemon, vitamin C' }
    ]
  },
  bases: {
    title: 'Sifat-Sifat Basa',
    taste: 'Rasa pahit, licin',
    litmus: 'Merubah lakmus merah → biru',
    properties: [
      'Melepaskan ion OH⁻ dalam air',
      'pH > 7',
      'Korosif terhadap kulit dan jaringan',
      'Konduktor listrik',
      'Bereaksi dengan asam membentuk garam'
    ],
    examples: [
      { name: 'Natrium Hidroksida (NaOH)', uses: 'Sabun, pembersih' },
      { name: 'Kalium Hidroksida (KOH)', uses: 'Baterai alkalin' },
      { name: 'Amonia (NH₃)', uses: 'Pupuk, pembersih kaca' },
      { name: 'Kalsium Hidroksida (Ca(OH)₂)', uses: 'Kapur tohor' }
    ]
  }
}

export default function AsamBasaPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'ph' | 'indicator' | 'neutralization' | 'titration' | 'buffer'>('ph')
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null)

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
              <div className="text-6xl">🧪</div>
              <div>
                <div className="glass-card border-red-400/30 px-3 py-1 inline-block mb-2">
                  <span className="text-xs font-semibold text-red-400">SMP - SMA</span>
                </div>
                <h1 className="text-5xl font-bold text-gradient mb-2">Asam & Basa</h1>
                <p className="text-cyan-100/60 text-lg">12 Eksperimen • 5 Sub-Topik • pH & Indikator</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky top-20 z-40 bg-[#0B1120]/80 backdrop-blur-xl border-b border-cyan-400/20 px-6 py-4">
          <div className="max-w-7xl mx-auto flex gap-4 overflow-x-auto">
            {[
              { id: 'ph', label: 'Skala pH', icon: Droplet },
              { id: 'indicator', label: 'Indikator', icon: TestTube2 },
              { id: 'neutralization', label: 'Netralisasi', icon: Sparkles },
              { id: 'titration', label: 'Titrasi', icon: Beaker },
              { id: 'buffer', label: 'Buffer', icon: FlaskConical }
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
            
            {activeTab === 'ph' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <Droplet className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{PH_SCALE.title}</h2>
                  <p className="text-cyan-100/60 text-lg max-w-3xl mx-auto">{PH_SCALE.description}</p>
                </div>

                {/* pH Scale Visual */}
                <div className="glass-panel border-2 border-cyan-400/30 p-8">
                  <div className="space-y-4">
                    {PH_SCALE.ranges.map((range, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className={`w-32 h-16 ${range.color} rounded-lg flex items-center justify-center text-white font-bold text-xl`}>
                          pH {range.range}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">{range.icon}</span>
                            <h3 className="text-2xl font-bold text-cyan-100">{range.type}</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {range.examples.map((ex, j) => (
                              <span key={j} className="glass-card border-cyan-400/30 px-3 py-1 text-sm text-cyan-100/70">{ex}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formulas */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="glass-panel border-2 border-purple-400/30 p-8 bg-purple-500/5">
                    <h3 className="text-2xl font-bold text-purple-100 mb-6">Rumus pH</h3>
                    <div className="space-y-4">
                      {Object.entries(PH_SCALE.formula).map(([key, value], i) => (
                        <div key={i} className="glass-card border-purple-400/30 p-4">
                          <div className="font-mono text-2xl text-purple-200 text-center">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-panel border-2 border-cyan-400/30 p-8">
                    <h3 className="text-2xl font-bold text-cyan-100 mb-6">Sifat Asam & Basa</h3>
                    <div className="space-y-6">
                      <div className="glass-card border-red-400/30 p-4 bg-red-500/5">
                        <h4 className="text-lg font-bold text-red-100 mb-3">{PROPERTIES.acids.title}</h4>
                        <ul className="space-y-2">
                          {PROPERTIES.acids.properties.slice(0, 3).map((prop, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-cyan-100/70">
                              <CheckCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                              {prop}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="glass-card border-blue-400/30 p-4 bg-blue-500/5">
                        <h4 className="text-lg font-bold text-blue-100 mb-3">{PROPERTIES.bases.title}</h4>
                        <ul className="space-y-2">
                          {PROPERTIES.bases.properties.slice(0, 3).map((prop, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-cyan-100/70">
                              <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                              {prop}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'indicator' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <TestTube2 className="w-20 h-20 text-pink-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{INDICATORS.title}</h2>
                  <p className="text-cyan-100/60 text-lg max-w-3xl mx-auto">{INDICATORS.description}</p>
                </div>

                {INDICATORS.types.map((indicator, i) => (
                  <div key={i} className="glass-panel border-2 border-pink-400/20 p-8">
                    <h3 className="text-3xl font-bold text-pink-100 mb-6">{indicator.name}</h3>
                    
                    {indicator.types && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {indicator.types.map((type, j) => (
                          <div key={j} className="glass-card border-pink-400/30 p-6 bg-pink-500/5">
                            <h4 className="text-xl font-bold text-pink-100 mb-4">{type.color}</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-cyan-100/50">Asam:</span>
                                <span className="text-red-300 font-semibold">{type.asam}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-cyan-100/50">Netral:</span>
                                <span className="text-green-300 font-semibold">{type.netral}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-cyan-100/50">Basa:</span>
                                <span className="text-blue-300 font-semibold">{type.basa}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {indicator.colors && (
                      <>
                        <p className="text-cyan-100/70 mb-6">{indicator.description}</p>
                        <div className="grid md:grid-cols-3 gap-4">
                          {indicator.colors.map((item, j) => (
                            <div key={j} className="glass-card border-pink-400/30 p-4 text-center">
                              <div className="text-2xl font-mono text-pink-200 mb-2">pH {item.pH}</div>
                              <div className="text-lg font-semibold text-cyan-100 mb-1">{item.color}</div>
                              <div className="text-sm text-cyan-100/50">{item.desc}</div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {indicator.sources && (
                      <div className="grid md:grid-cols-3 gap-4">
                        {indicator.sources.map((src, j) => (
                          <div key={j} className="glass-card border-green-400/30 p-6 bg-green-500/5">
                            <h4 className="text-lg font-bold text-green-100 mb-3">{src.source}</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-cyan-100/50">Asam:</span>
                                <span className="text-red-300">{src.asam}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-cyan-100/50">Basa:</span>
                                <span className="text-blue-300">{src.basa}</span>
                              </div>
                              <div className="text-cyan-100/50 text-xs pt-2">Kandungan: {src.extract}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {indicator.list && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {indicator.list.map((item, j) => (
                          <div key={j} className="glass-card border-purple-400/30 p-5 bg-purple-500/5">
                            <h4 className="text-lg font-bold text-purple-100 mb-3">{item.name}</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-cyan-100/50">Range pH:</span>
                                <span className="text-cyan-100 font-mono">{item.range}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-cyan-100/50">Asam:</span>
                                <span className="text-red-300">{item.asam}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-cyan-100/50">Basa:</span>
                                <span className="text-blue-300">{item.basa}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'neutralization' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <Sparkles className="w-20 h-20 text-yellow-400 mx-auto mb-6 animate-pulse" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{NEUTRALIZATION.title}</h2>
                  <p className="text-cyan-100/60 text-lg max-w-3xl mx-auto mb-6">{NEUTRALIZATION.description}</p>
                  <div className="glass-panel border-2 border-yellow-400/30 p-8 inline-block bg-yellow-500/5">
                    <div className="text-4xl font-mono text-gradient mb-2">{NEUTRALIZATION.equation}</div>
                    <div className="text-cyan-100/50 text-sm">{NEUTRALIZATION.generalFormula}</div>
                  </div>
                </div>

                <div className="space-y-8">
                  {NEUTRALIZATION.examples.map((ex, i) => (
                    <div key={i} className="glass-panel border-2 border-cyan-400/20 p-8">
                      <h3 className="text-2xl font-bold text-cyan-100 mb-4">{ex.name}</h3>
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-3">
                          <div className="glass-card border-orange-400/30 p-4 bg-orange-500/5">
                            <div className="text-sm text-orange-100/50 mb-2">Persamaan Reaksi:</div>
                            <div className="font-mono text-xl text-orange-200">{ex.equation}</div>
                          </div>
                          <div className="glass-card border-purple-400/30 p-4 bg-purple-500/5">
                            <div className="text-sm text-purple-100/50 mb-1">Tipe:</div>
                            <div className="text-purple-100 font-semibold">{ex.type}</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="glass-card border-green-400/30 p-4 bg-green-500/5">
                            <div className="text-sm text-green-100/50 mb-1">Hasil:</div>
                            <div className="text-green-100 font-bold text-lg">{ex.result}</div>
                          </div>
                          <div className="glass-card border-blue-400/30 p-4 bg-blue-500/5">
                            <div className="text-sm text-blue-100/50 mb-1">Aplikasi:</div>
                            <div className="text-blue-100">{ex.application}</div>
                          </div>
                        </div>
                      </div>
                      <div className="glass-card border-cyan-400/30 p-4">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <p className="text-cyan-100/70">{ex.explanation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="glass-panel border-2 border-green-400/30 p-8 bg-green-500/5">
                  <h3 className="text-2xl font-bold text-green-100 mb-6">Aplikasi Netralisasi</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {NEUTRALIZATION.applications.map((app, i) => (
                      <div key={i} className="flex items-start gap-3 glass-card border-green-400/30 p-4">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-cyan-100/70">{app}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'titration' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <Beaker className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{TITRATION.title}</h2>
                  <p className="text-cyan-100/60 text-lg max-w-3xl mx-auto">{TITRATION.description}</p>
                </div>

                {/* Procedure */}
                <div className="glass-panel border-2 border-cyan-400/30 p-8">
                  <h3 className="text-2xl font-bold text-cyan-100 mb-6">Prosedur Titrasi</h3>
                  <div className="space-y-4">
                    {TITRATION.procedure.map((proc) => (
                      <div key={proc.step} className="flex items-start gap-4 glass-card border-cyan-400/30 p-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                          {proc.step}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-cyan-100 mb-2">{proc.action}</h4>
                          <p className="text-cyan-100/70">{proc.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Types */}
                <div>
                  <h3 className="text-3xl font-bold text-cyan-100 mb-6">Jenis-Jenis Titrasi</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {TITRATION.types.map((type, i) => (
                      <div key={i} className="glass-panel border-2 border-purple-400/20 p-6 hover:border-purple-400/40 transition-all">
                        <h4 className="text-xl font-bold text-purple-100 mb-4">{type.type}</h4>
                        <div className="space-y-3 text-sm">
                          <div className="glass-card border-purple-400/30 p-3">
                            <div className="text-purple-100/50 mb-1">Contoh:</div>
                            <div className="font-mono text-purple-200">{type.example}</div>
                          </div>
                          <div className="glass-card border-purple-400/30 p-3">
                            <div className="text-purple-100/50 mb-1">Indikator:</div>
                            <div className="text-purple-100">{type.indicator}</div>
                          </div>
                          <div className="glass-card border-green-400/30 p-3 bg-green-500/5">
                            <div className="text-green-100/50 mb-1">pH Titik Ekuivalen:</div>
                            <div className="text-green-100 font-bold text-lg">{type.pHTitikEkuivalen}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calculations */}
                <div className="glass-panel border-2 border-orange-400/30 p-8 bg-orange-500/5">
                  <h3 className="text-2xl font-bold text-orange-100 mb-6">Perhitungan Titrasi</h3>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="font-mono text-4xl text-gradient mb-2">{TITRATION.calculations.formula}</div>
                      <div className="text-cyan-100/50">{TITRATION.calculations.variables}</div>
                    </div>
                    <div className="glass-card border-orange-400/30 p-6">
                      <h4 className="text-lg font-bold text-orange-100 mb-3">Contoh Soal:</h4>
                      <p className="text-cyan-100/70 mb-4">{TITRATION.calculations.example.problem}</p>
                      <div className="glass-card border-green-400/30 p-4 bg-green-500/5">
                        <div className="text-sm text-green-100/50 mb-2">Penyelesaian:</div>
                        <pre className="font-mono text-green-200 whitespace-pre-wrap">{TITRATION.calculations.example.solution}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'buffer' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <FlaskConical className="w-20 h-20 text-green-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{BUFFER.title}</h2>
                  <p className="text-cyan-100/60 text-lg max-w-3xl mx-auto">{BUFFER.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {BUFFER.types.map((type, i) => (
                    <div key={i} className="glass-panel border-2 border-green-400/20 p-8">
                      <h3 className="text-3xl font-bold text-green-100 mb-4">{type.type}</h3>
                      <div className="space-y-4">
                        <div className="glass-card border-green-400/30 p-4">
                          <div className="text-sm text-green-100/50 mb-1">Komposisi:</div>
                          <div className="text-green-100 font-semibold">{type.composition}</div>
                        </div>
                        <div className="glass-card border-cyan-400/30 p-4">
                          <div className="text-sm text-cyan-100/50 mb-1">Contoh:</div>
                          <div className="font-mono text-cyan-100 text-lg">{type.example}</div>
                        </div>
                        <div className="glass-card border-purple-400/30 p-4 bg-purple-500/5">
                          <div className="text-sm text-purple-100/50 mb-1">Range pH:</div>
                          <div className="text-purple-100 font-bold text-xl">{type.pHRange}</div>
                        </div>
                        
                        <div className="space-y-3 mt-6">
                          <h4 className="text-lg font-bold text-cyan-100">Mekanisme:</h4>
                          <div className="glass-card border-red-400/30 p-4 bg-red-500/5">
                            <div className="text-sm text-red-100/50 mb-2">Jika ditambah Asam (H⁺):</div>
                            <div className="font-mono text-sm text-red-200">{type.mechanism.addAcid}</div>
                          </div>
                          <div className="glass-card border-blue-400/30 p-4 bg-blue-500/5">
                            <div className="text-sm text-blue-100/50 mb-2">Jika ditambah Basa (OH⁻):</div>
                            <div className="font-mono text-sm text-blue-200">{type.mechanism.addBase}</div>
                          </div>
                        </div>

                        <div className="glass-card border-yellow-400/30 p-4 bg-yellow-500/5 mt-4">
                          <div className="text-sm text-yellow-100/50 mb-2">Aplikasi:</div>
                          <div className="flex flex-wrap gap-2">
                            {type.applications.map((app, j) => (
                              <span key={j} className="text-yellow-100 text-sm">{app}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Biological Buffers */}
                <div className="glass-panel border-2 border-blue-400/30 p-8 bg-blue-500/5">
                  <h3 className="text-2xl font-bold text-blue-100 mb-6">Buffer Biologis</h3>
                  <div className="grid gap-6">
                    {BUFFER.biologicalBuffers.map((bio, i) => (
                      <div key={i} className="glass-card border-blue-400/30 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="text-xl font-bold text-blue-100">{bio.system}</h4>
                          <div className="glass-card border-green-400/30 px-4 py-2 bg-green-500/5">
                            <span className="text-green-100 font-mono font-bold">pH {bio.pH}</span>
                          </div>
                        </div>
                        <p className="text-cyan-100/70 mb-3">{bio.importance}</p>
                        <div className="glass-card border-yellow-400/30 p-3 bg-yellow-500/5">
                          <div className="text-sm text-yellow-100/50 mb-1">
                            {bio.disease ? 'Gangguan:' : 'Lokasi:'}
                          </div>
                          <div className="text-yellow-100">{bio.disease || bio.location}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Henderson-Hasselbalch */}
                <div className="glass-panel border-2 border-purple-400/30 p-8 bg-purple-500/5">
                  <h3 className="text-2xl font-bold text-purple-100 mb-6">Persamaan Henderson-Hasselbalch</h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="font-mono text-4xl text-gradient mb-2">{BUFFER.calculations.hendersonHasselbalch}</div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="glass-card border-purple-400/30 p-4">
                        <div className="text-sm text-purple-100/50 mb-2">Untuk Buffer Asam:</div>
                        <div className="font-mono text-xl text-purple-200">{BUFFER.calculations.forAcid}</div>
                      </div>
                      <div className="glass-card border-purple-400/30 p-4">
                        <div className="text-sm text-purple-100/50 mb-2">Untuk Buffer Basa:</div>
                        <div className="font-mono text-xl text-purple-200">{BUFFER.calculations.forBase}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="glass-panel border-2 border-cyan-400/30 p-12 text-center">
                  <h3 className="text-3xl font-bold text-cyan-100 mb-4">Coba Eksperimen pH di Lab Virtual!</h3>
                  <p className="text-cyan-100/60 mb-6">Uji berbagai larutan asam dan basa dengan pH meter virtual</p>
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
