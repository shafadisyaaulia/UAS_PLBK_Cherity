'use client'

import { useState } from 'react'
import { ArrowLeft, Zap, FlaskConical, Flame, Droplet, TestTube2, BookOpen, Play, CheckCircle, AlertTriangle, Sparkles, Plus, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'

const REACTION_TYPES = [
  {
    id: 'synthesis',
    title: 'Reaksi Sintesis',
    icon: '🔗',
    description: 'Dua atau lebih zat bergabung membentuk satu zat baru',
    example: {
      equation: 'A + B → AB',
      real: '2H₂ + O₂ → 2H₂O',
      explanation: 'Hidrogen dan oksigen bergabung membentuk air'
    },
    color: 'from-blue-500 to-cyan-500',
    characteristics: [
      'Kombinasi dua atau lebih reaktan',
      'Menghasilkan satu produk',
      'Biasanya eksoterm (melepas panas)',
      'Contoh: pembentukan air, karat'
    ]
  },
  {
    id: 'decomposition',
    title: 'Reaksi Penguraian',
    icon: '💥',
    description: 'Satu zat terurai menjadi dua atau lebih zat sederhana',
    example: {
      equation: 'AB → A + B',
      real: '2H₂O → 2H₂ + O₂',
      explanation: 'Air terurai menjadi hidrogen dan oksigen (elektrolisis)'
    },
    color: 'from-red-500 to-orange-500',
    characteristics: [
      'Satu reaktan terurai',
      'Menghasilkan dua atau lebih produk',
      'Biasanya endoterm (butuh energi)',
      'Contoh: elektrolisis, fotosintesis'
    ]
  },
  {
    id: 'single-replacement',
    title: 'Reaksi Substitusi Tunggal',
    icon: '🔄',
    description: 'Satu unsur menggantikan unsur lain dalam senyawa',
    example: {
      equation: 'A + BC → AC + B',
      real: 'Zn + 2HCl → ZnCl₂ + H₂',
      explanation: 'Seng menggantikan hidrogen dalam asam klorida'
    },
    color: 'from-purple-500 to-pink-500',
    characteristics: [
      'Satu unsur bebas menggantikan unsur dalam senyawa',
      'Unsur yang digantikan menjadi bebas',
      'Bergantung pada deret aktivitas',
      'Contoh: logam + asam'
    ]
  },
  {
    id: 'double-replacement',
    title: 'Reaksi Substitusi Ganda',
    icon: '⚡',
    description: 'Pertukaran ion positif dan negatif antara dua senyawa',
    example: {
      equation: 'AB + CD → AD + CB',
      real: 'AgNO₃ + NaCl → AgCl↓ + NaNO₃',
      explanation: 'Terbentuk endapan perak klorida (AgCl)'
    },
    color: 'from-green-500 to-teal-500',
    characteristics: [
      'Pertukaran kation dan anion',
      'Menghasilkan endapan, gas, atau air',
      'Terjadi dalam larutan',
      'Contoh: reaksi pengendapan'
    ]
  },
  {
    id: 'combustion',
    title: 'Reaksi Pembakaran',
    icon: '🔥',
    description: 'Zat bereaksi dengan oksigen menghasilkan panas dan cahaya',
    example: {
      equation: 'CₓHᵧ + O₂ → CO₂ + H₂O + Energi',
      real: 'CH₄ + 2O₂ → CO₂ + 2H₂O + Panas',
      explanation: 'Metana terbakar menghasilkan CO₂ dan uap air'
    },
    color: 'from-orange-500 to-red-500',
    characteristics: [
      'Selalu melibatkan oksigen (O₂)',
      'Sangat eksoterm (panas tinggi)',
      'Menghasilkan cahaya dan panas',
      'Contoh: pembakaran kayu, bensin'
    ]
  }
]

const CONSERVATION_LAW = {
  title: 'Hukum Kekekalan Massa',
  subtitle: 'Massa sebelum reaksi = Massa sesudah reaksi',
  description: 'Dalam reaksi kimia tertutup, tidak ada massa yang hilang atau bertambah. Atom-atom hanya mengatur ulang ikatannya.',
  example: {
    before: {
      reactants: '2H₂ + O₂',
      mass: '4g + 32g = 36g'
    },
    after: {
      products: '2H₂O',
      mass: '36g'
    }
  },
  demonstrations: [
    {
      title: 'Demo 1: Reaksi dalam Wadah Tertutup',
      setup: 'Timbang natrium bikarbonat + cuka dalam botol tertutup',
      result: 'Massa sebelum = massa sesudah (meskipun ada gas CO₂)'
    },
    {
      title: 'Demo 2: Pembakaran Lilin',
      setup: 'Bakar lilin di udara terbuka vs dalam toples tertutup',
      result: 'Udara terbuka: massa berkurang (gas kabur). Tertutup: massa tetap'
    }
  ]
}

const BALANCING_GUIDE = {
  title: 'Cara Menyetarakan Persamaan Reaksi',
  steps: [
    {
      step: 1,
      title: 'Tulis Persamaan Kerangka',
      description: 'Tulis rumus kimia reaktan dan produk',
      example: 'H₂ + O₂ → H₂O (belum setara)'
    },
    {
      step: 2,
      title: 'Hitung Jumlah Atom',
      description: 'Hitung atom setiap unsur di kiri dan kanan',
      example: 'Kiri: 2H, 2O | Kanan: 2H, 1O ❌'
    },
    {
      step: 3,
      title: 'Tambahkan Koefisien',
      description: 'Gunakan koefisien (angka di depan rumus) untuk menyamakan',
      example: '2H₂ + O₂ → 2H₂O'
    },
    {
      step: 4,
      title: 'Cek Ulang',
      description: 'Pastikan semua atom sudah sama jumlahnya',
      example: 'Kiri: 4H, 2O | Kanan: 4H, 2O ✅'
    }
  ],
  tips: [
    'Mulai dari unsur yang paling kompleks',
    'Jangan ubah subscript (angka kecil), hanya koefisien',
    'Gunakan pecahan dulu, baru dikalikan untuk bilangan bulat',
    'Cek total muatan untuk reaksi ion'
  ]
}

const PRACTICE_PROBLEMS = [
  {
    id: 1,
    equation: 'Na + Cl₂ → NaCl',
    balanced: '2Na + Cl₂ → 2NaCl',
    type: 'Sintesis',
    difficulty: 'Mudah'
  },
  {
    id: 2,
    equation: 'Fe + O₂ → Fe₂O₃',
    balanced: '4Fe + 3O₂ → 2Fe₂O₃',
    type: 'Sintesis',
    difficulty: 'Sedang'
  },
  {
    id: 3,
    equation: 'C₃H₈ + O₂ → CO₂ + H₂O',
    balanced: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O',
    type: 'Pembakaran',
    difficulty: 'Sulit'
  },
  {
    id: 4,
    equation: 'Al + HCl → AlCl₃ + H₂',
    balanced: '2Al + 6HCl → 2AlCl₃ + 3H₂',
    type: 'Substitusi',
    difficulty: 'Sedang'
  }
]

export default function ReaksiKimiaPage() {
  const router = useRouter()
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState<{ [key: number]: boolean }>({})
  const [activeTab, setActiveTab] = useState<'types' | 'conservation' | 'balancing' | 'practice'>('types')

  const toggleAnswer = (id: number) => {
    setShowAnswer(prev => ({ ...prev, [id]: !prev[id] }))
  }

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
              <div className="text-6xl">⚡</div>
              <div>
                <div className="glass-card border-purple-400/30 px-3 py-1 inline-block mb-2">
                  <span className="text-xs font-semibold text-purple-400">SD - SMP</span>
                </div>
                <h1 className="text-5xl font-bold text-gradient mb-2">Reaksi Kimia</h1>
                <p className="text-cyan-100/60 text-lg">15 Eksperimen • 4 Sub-Topik • Interaktif</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="sticky top-20 z-40 bg-[#0B1120]/80 backdrop-blur-xl border-b border-cyan-400/20 px-6 py-4">
          <div className="max-w-7xl mx-auto flex gap-4 overflow-x-auto">
            {[
              { id: 'types', label: 'Jenis Reaksi', icon: Zap },
              { id: 'conservation', label: 'Kekekalan Massa', icon: Flame },
              { id: 'balancing', label: 'Penyetaraan', icon: FlaskConical },
              { id: 'practice', label: 'Latihan', icon: TestTube2 }
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
            
            {/* Tab: Jenis Reaksi */}
            {activeTab === 'types' && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">5 Jenis Reaksi Kimia</h2>
                  <p className="text-cyan-100/60 text-lg max-w-3xl mx-auto">
                    Setiap reaksi kimia dapat diklasifikasikan ke dalam salah satu dari lima tipe dasar ini
                  </p>
                </div>

                <div className="grid gap-6">
                  {REACTION_TYPES.map((reaction) => (
                    <div
                      key={reaction.id}
                      className={`glass-panel border-2 p-8 transition-all cursor-pointer ${
                        selectedReaction === reaction.id
                          ? 'border-cyan-400/50 bg-cyan-500/10'
                          : 'border-cyan-400/20 hover:border-cyan-400/40'
                      }`}
                      onClick={() => setSelectedReaction(selectedReaction === reaction.id ? null : reaction.id)}
                    >
                      <div className="flex items-start gap-6">
                        <div className="text-6xl">{reaction.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-3xl font-bold text-cyan-100 mb-2">{reaction.title}</h3>
                          <p className="text-cyan-100/70 text-lg mb-6">{reaction.description}</p>

                          {/* Example */}
                          <div className="glass-card border-cyan-400/30 p-6 mb-6">
                            <div className="flex items-center gap-2 mb-4">
                              <Sparkles className="w-5 h-5 text-yellow-400" />
                              <span className="text-yellow-400 font-semibold">Contoh Reaksi:</span>
                            </div>
                            <div className="space-y-3">
                              <div className="text-cyan-100/50 text-sm">Pola Umum:</div>
                              <div className="font-mono text-2xl text-cyan-100 bg-black/30 p-4 rounded-lg text-center">
                                {reaction.example.equation}
                              </div>
                              <div className="text-cyan-100/50 text-sm mt-4">Contoh Nyata:</div>
                              <div className="font-mono text-xl text-purple-300 bg-purple-500/10 p-4 rounded-lg text-center">
                                {reaction.example.real}
                              </div>
                              <p className="text-cyan-100/60 text-sm italic text-center pt-2">
                                {reaction.example.explanation}
                              </p>
                            </div>
                          </div>

                          {/* Characteristics - Show when expanded */}
                          {selectedReaction === reaction.id && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                              <div className="flex items-center gap-2 mb-3">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span className="text-green-400 font-semibold">Ciri-Ciri Khas:</span>
                              </div>
                              <ul className="grid md:grid-cols-2 gap-3">
                                {reaction.characteristics.map((char, i) => (
                                  <li key={i} className="flex items-start gap-3 glass-card border-cyan-400/20 p-4">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2" />
                                    <span className="text-cyan-100/70 text-sm">{char}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Kekekalan Massa */}
            {activeTab === 'conservation' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <Flame className="w-20 h-20 text-orange-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{CONSERVATION_LAW.title}</h2>
                  <div className="text-3xl font-mono text-gradient mb-6">{CONSERVATION_LAW.subtitle}</div>
                  <p className="text-cyan-100/70 text-lg max-w-3xl mx-auto">{CONSERVATION_LAW.description}</p>
                </div>

                {/* Visual Example */}
                <div className="glass-panel border-2 border-orange-400/30 p-12">
                  <h3 className="text-2xl font-bold text-orange-100 mb-8 text-center">Contoh Perhitungan</h3>
                  
                  <div className="grid md:grid-cols-3 gap-8 items-center">
                    {/* Before */}
                    <div className="text-center">
                      <div className="glass-card border-cyan-400/30 p-6 mb-4">
                        <div className="text-sm text-cyan-100/50 mb-2">Sebelum Reaksi</div>
                        <div className="font-mono text-2xl text-cyan-100 mb-4">{CONSERVATION_LAW.example.before.reactants}</div>
                        <div className="text-cyan-100/70">{CONSERVATION_LAW.example.before.mass}</div>
                      </div>
                      <div className="flex justify-center gap-2">
                        <FlaskConical className="w-8 h-8 text-cyan-400" />
                        <Plus className="w-8 h-8 text-cyan-400" />
                        <FlaskConical className="w-8 h-8 text-blue-400" />
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="text-center">
                      <ArrowRight className="w-16 h-16 text-green-400 mx-auto animate-pulse" />
                      <div className="text-green-400 font-semibold mt-2">Reaksi</div>
                    </div>

                    {/* After */}
                    <div className="text-center">
                      <div className="glass-card border-green-400/30 p-6 mb-4 bg-green-500/5">
                        <div className="text-sm text-green-100/50 mb-2">Sesudah Reaksi</div>
                        <div className="font-mono text-2xl text-green-100 mb-4">{CONSERVATION_LAW.example.after.products}</div>
                        <div className="text-green-100/70 font-bold">{CONSERVATION_LAW.example.after.mass}</div>
                      </div>
                      <div className="flex justify-center gap-2">
                        <Droplet className="w-8 h-8 text-blue-400" />
                        <Droplet className="w-8 h-8 text-blue-400" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-green-500/10 border border-green-400/30 rounded-xl text-center">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-green-100">Massa Tetap: 36 gram</div>
                    <div className="text-green-100/60 text-sm mt-2">Tidak ada atom yang hilang atau bertambah!</div>
                  </div>
                </div>

                {/* Demonstrations */}
                <div>
                  <h3 className="text-3xl font-bold text-cyan-100 mb-6 flex items-center gap-3">
                    <Play className="w-8 h-8 text-cyan-400" />
                    Demonstrasi Praktis
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {CONSERVATION_LAW.demonstrations.map((demo, i) => (
                      <div key={i} className="glass-panel border-cyan-400/20 p-6">
                        <div className="text-xl font-bold text-cyan-100 mb-4">{demo.title}</div>
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-cyan-100/50 mb-1">Setup:</div>
                            <div className="text-cyan-100/70">{demo.setup}</div>
                          </div>
                          <div>
                            <div className="text-sm text-cyan-100/50 mb-1">Hasil:</div>
                            <div className="text-cyan-100 font-semibold">{demo.result}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Penyetaraan */}
            {activeTab === 'balancing' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <FlaskConical className="w-20 h-20 text-purple-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{BALANCING_GUIDE.title}</h2>
                  <p className="text-cyan-100/60 text-lg max-w-3xl mx-auto">
                    Ikuti langkah-langkah ini untuk menyetarakan persamaan reaksi dengan mudah
                  </p>
                </div>

                {/* Steps */}
                <div className="grid gap-6">
                  {BALANCING_GUIDE.steps.map((step) => (
                    <div key={step.step} className="glass-panel border-2 border-purple-400/20 p-8 hover:border-purple-400/40 transition-all">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl font-bold text-white glow-purple">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-purple-100 mb-3">{step.title}</h3>
                          <p className="text-cyan-100/70 mb-4">{step.description}</p>
                          <div className="glass-card border-purple-400/30 p-4 bg-purple-500/5">
                            <div className="font-mono text-lg text-purple-200">{step.example}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tips */}
                <div className="glass-panel border-2 border-yellow-400/30 p-8 bg-yellow-500/5">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="w-8 h-8 text-yellow-400" />
                    <h3 className="text-2xl font-bold text-yellow-100">Tips Penting</h3>
                  </div>
                  <ul className="grid md:grid-cols-2 gap-4">
                    {BALANCING_GUIDE.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 glass-card border-yellow-400/20 p-4">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2" />
                        <span className="text-cyan-100/70">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab: Practice */}
            {activeTab === 'practice' && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <TestTube2 className="w-20 h-20 text-green-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">Latihan Penyetaraan</h2>
                  <p className="text-cyan-100/60 text-lg">Setarakan persamaan reaksi berikut. Klik untuk melihat jawaban!</p>
                </div>

                <div className="grid gap-6">
                  {PRACTICE_PROBLEMS.map((problem) => (
                    <div key={problem.id} className="glass-panel border-2 border-cyan-400/20 p-8 hover:border-cyan-400/40 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-xl font-bold text-white">
                            {problem.id}
                          </div>
                          <div>
                            <div className="text-sm text-cyan-100/50">Tipe: {problem.type}</div>
                            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              problem.difficulty === 'Mudah' ? 'bg-green-500/20 text-green-400' :
                              problem.difficulty === 'Sedang' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {problem.difficulty}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="glass-card border-cyan-400/30 p-6 mb-4">
                        <div className="text-sm text-cyan-100/50 mb-2">Persamaan Belum Setara:</div>
                        <div className="font-mono text-2xl text-cyan-100 text-center py-4">
                          {problem.equation}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleAnswer(problem.id)}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        {showAnswer[problem.id] ? 'Sembunyikan Jawaban' : 'Lihat Jawaban'}
                      </button>

                      {showAnswer[problem.id] && (
                        <div className="mt-4 glass-card border-green-400/30 p-6 bg-green-500/5 animate-in fade-in duration-300">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                            <span className="text-green-400 font-semibold">Jawaban Benar:</span>
                          </div>
                          <div className="font-mono text-2xl text-green-100 text-center py-4 bg-black/20 rounded-lg">
                            {problem.balanced}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="glass-panel border-2 border-cyan-400/30 p-12 text-center">
                  <h3 className="text-3xl font-bold text-cyan-100 mb-4">Siap Praktik Langsung?</h3>
                  <p className="text-cyan-100/60 mb-6">Coba reaksi kimia nyata di lab virtual kami</p>
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
