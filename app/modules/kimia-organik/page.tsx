'use client'

import { useState } from 'react'
import { ArrowLeft, Atom, TestTube, Droplet, FlaskConical, Sparkles, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'

const DATA = {
  hydrocarbons: {
    title: 'Hidrokarbon',
    types: [
      { name: 'Alkana', formula: 'CₙH₂ₙ₊₂', bond: 'Ikatan tunggal', suffix: '-ana', examples: ['CH₄ (metana)', 'C₂H₆ (etana)', 'C₃H₈ (propana)'], uses: 'Bahan bakar LPG, gas alam' },
      { name: 'Alkena', formula: 'CₙH₂ₙ', bond: 'Ikatan rangkap dua', suffix: '-ena', examples: ['C₂H₄ (etena)', 'C₃H₆ (propena)'], uses: 'Plastik polietilena, PVC' },
      { name: 'Alkuna', formula: 'CₙH₂ₙ₋₂', bond: 'Ikatan rangkap tiga', suffix: '-una', examples: ['C₂H₂ (etuna/asetilena)'], uses: 'Las karbit, sintesis kimia' },
      { name: 'Sikloalkana', formula: 'CₙH₂ₙ', bond: 'Rantai tertutup', prefix: 'siklo-', examples: ['C₆H₁₂ (sikloheksana)'], uses: 'Pelarut, bahan baku nylon' }
    ]
  },
  functionalGroups: {
    title: 'Gugus Fungsi',
    groups: [
      { name: 'Alkohol', group: '-OH', formula: 'R-OH', suffix: '-ol', example: { compound: 'C₂H₅OH', name: 'Etanol', uses: 'Minuman alkohol, antiseptik' } },
      { name: 'Eter', group: 'R-O-R', formula: 'R-O-R\'', naming: 'alkil alkil eter', example: { compound: 'CH₃-O-CH₃', name: 'Dimetil eter', uses: 'Pelarut, bahan bakar' } },
      { name: 'Aldehida', group: '-CHO', formula: 'R-CHO', suffix: '-al', example: { compound: 'HCHO', name: 'Formaldehida', uses: 'Pengawet, desinfektan' } },
      { name: 'Keton', group: '-CO-', formula: 'R-CO-R\'', suffix: '-on', example: { compound: 'CH₃COCH₃', name: 'Aseton', uses: 'Pelarut cat kuku' } },
      { name: 'Asam Karboksilat', group: '-COOH', formula: 'R-COOH', suffix: 'asam ...at', example: { compound: 'CH₃COOH', name: 'Asam asetat', uses: 'Cuka makan' } },
      { name: 'Ester', group: '-COO-', formula: 'R-COO-R\'', suffix: 'alkil alkanoat', example: { compound: 'CH₃COOC₂H₅', name: 'Etil asetat', uses: 'Pewangi, pelarut' } },
      { name: 'Amina', group: '-NH₂', formula: 'R-NH₂', prefix: '-amina', example: { compound: 'CH₃NH₂', name: 'Metanamina', uses: 'Farmasi, pewarna' } }
    ]
  },
  isomerism: {
    title: 'Isomerisme',
    types: [
      { type: 'Isomer Struktur', desc: 'Rumus molekul sama, struktur berbeda', subtypes: ['Isomer rantai', 'Isomer posisi', 'Isomer gugus fungsi'], example: 'C₄H₁₀: n-butana vs isobutana' },
      { type: 'Isomer Geometri', desc: 'Rotasi terhambat sekitar ikatan rangkap', subtypes: ['Isomer cis (sama sisi)', 'Isomer trans (berlawanan)'], example: 'C₄H₈: cis-2-butena vs trans-2-butena' },
      { type: 'Isomer Optik', desc: 'Mengandung atom C asimetris (kiral)', subtypes: ['Enantiomer (cermin)', 'Diastereomer'], example: 'Asam laktat: D-laktat vs L-laktat' }
    ]
  },
  reactions: {
    title: 'Reaksi Senyawa Organik',
    types: [
      { name: 'Substitusi', desc: 'Penggantian atom/gugus', example: 'CH₄ + Cl₂ → CH₃Cl + HCl', conditions: 'Alkana + halogen → halogenasi' },
      { name: 'Adisi', desc: 'Penambahan atom pada ikatan rangkap', example: 'C₂H₄ + H₂ → C₂H₆', conditions: 'Alkena + H₂/Br₂/HCl' },
      { name: 'Eliminasi', desc: 'Pelepasan molekul kecil', example: 'C₂H₅OH → C₂H₄ + H₂O', conditions: 'Dehidrasi alkohol' },
      { name: 'Oksidasi', desc: 'Penambahan oksigen atau pelepasan hidrogen', example: 'Alkohol primer → Aldehida → Asam karboksilat', conditions: 'KMnO₄, K₂Cr₂O₇' },
      { name: 'Esterifikasi', desc: 'Pembentukan ester', example: 'R-COOH + R\'-OH → R-COO-R\' + H₂O', conditions: 'Asam + alkohol → ester' },
      { name: 'Polimerisasi', desc: 'Pembentukan polimer dari monomer', example: 'nC₂H₄ → (C₂H₄)ₙ', conditions: 'Etena → polietilena' }
    ]
  },
  polymers: {
    title: 'Polimer',
    types: [
      { name: 'Polietilena (PE)', monomer: 'Etena (C₂H₄)', uses: 'Kantong plastik, botol', type: 'Adisi' },
      { name: 'Polipropilena (PP)', monomer: 'Propena (C₃H₆)', uses: 'Wadah makanan, tekstil', type: 'Adisi' },
      { name: 'Polivinilklorida (PVC)', monomer: 'Vinilklorida (C₂H₃Cl)', uses: 'Pipa, kabel listrik', type: 'Adisi' },
      { name: 'Polistirena (PS)', monomer: 'Stirena (C₈H₈)', uses: 'Styrofoam, wadah', type: 'Adisi' },
      { name: 'Nylon', monomer: 'Asam adipat + heksametilena diamin', uses: 'Tekstil, tali', type: 'Kondensasi' },
      { name: 'Polietilen tereftalat (PET)', monomer: 'Asam tereftalat + etilena glikol', uses: 'Botol minuman, serat', type: 'Kondensasi' }
    ]
  }
}

export default function KimiaOrganikPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'hydrocarbon' | 'functional' | 'isomer' | 'reaction' | 'polymer'>('hydrocarbon')

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
              <div className="text-6xl">🧬</div>
              <div>
                <div className="glass-card border-green-400/30 px-3 py-1 inline-block mb-2">
                  <span className="text-xs font-semibold text-green-400">SMA</span>
                </div>
                <h1 className="text-5xl font-bold text-gradient mb-2">Kimia Organik</h1>
                <p className="text-cyan-100/60 text-lg">11 Eksperimen • 5 Sub-Topik • Senyawa Karbon</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky top-20 z-40 bg-[#0B1120]/80 backdrop-blur-xl border-b border-cyan-400/20 px-6 py-4">
          <div className="max-w-7xl mx-auto flex gap-4 overflow-x-auto">
            {[
              { id: 'hydrocarbon', label: 'Hidrokarbon', icon: Atom },
              { id: 'functional', label: 'Gugus Fungsi', icon: TestTube },
              { id: 'isomer', label: 'Isomerisme', icon: Sparkles },
              { id: 'reaction', label: 'Reaksi', icon: FlaskConical },
              { id: 'polymer', label: 'Polimer', icon: Droplet }
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
            
            {activeTab === 'hydrocarbon' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <Atom className="w-20 h-20 text-green-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{DATA.hydrocarbons.title}</h2>
                  <p className="text-cyan-100/60 text-lg">Senyawa yang hanya terdiri dari unsur C dan H</p>
                </div>
                <div className="grid gap-6">
                  {DATA.hydrocarbons.types.map((type, i) => (
                    <div key={i} className="glass-panel border-2 border-green-400/20 p-8 hover:border-green-400/40 transition-all">
                      <div className="flex items-start gap-6">
                        <div className="text-5xl">🧬</div>
                        <div className="flex-1">
                          <h3 className="text-3xl font-bold text-green-100 mb-3">{type.name}</h3>
                          <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <div className="glass-card border-green-400/30 p-4">
                              <div className="text-sm text-green-100/50 mb-1">Rumus Umum:</div>
                              <div className="font-mono text-xl text-green-100">{type.formula}</div>
                            </div>
                            <div className="glass-card border-green-400/30 p-4">
                              <div className="text-sm text-green-100/50 mb-1">Ikatan:</div>
                              <div className="text-green-100">{type.bond}</div>
                            </div>
                            <div className="glass-card border-green-400/30 p-4">
                              <div className="text-sm text-green-100/50 mb-1">Penamaan:</div>
                              <div className="text-green-100">{type.suffix || type.prefix}</div>
                            </div>
                          </div>
                          <div className="mb-4">
                            <div className="text-sm text-green-100/50 mb-2">Contoh:</div>
                            <div className="flex flex-wrap gap-2">
                              {type.examples.map((ex, j) => (
                                <div key={j} className="glass-card border-green-400/30 px-4 py-2 bg-green-500/5">
                                  <span className="text-green-200 font-mono">{ex}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="text-cyan-100/60 text-sm">💡 Kegunaan: {type.uses}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'functional' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <TestTube className="w-20 h-20 text-purple-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{DATA.functionalGroups.title}</h2>
                  <p className="text-cyan-100/60 text-lg">Atom/gugus atom yang menentukan sifat khas senyawa organik</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {DATA.functionalGroups.groups.map((g, i) => (
                    <div key={i} className="glass-panel border-2 border-purple-400/20 p-8 hover:border-purple-400/40 transition-all">
                      <h3 className="text-2xl font-bold text-purple-100 mb-4">{g.name}</h3>
                      <div className="space-y-3 mb-6">
                        <div className="glass-card border-purple-400/30 p-4 bg-purple-500/5">
                          <div className="text-sm text-purple-100/50 mb-1">Gugus:</div>
                          <div className="font-mono text-3xl text-purple-200 text-center">{g.group}</div>
                        </div>
                        <div className="glass-card border-purple-400/30 p-3">
                          <div className="text-sm text-purple-100/50 mb-1">Rumus Umum:</div>
                          <div className="font-mono text-lg text-purple-200">{g.formula}</div>
                        </div>
                        <div className="glass-card border-purple-400/30 p-3">
                          <div className="text-sm text-purple-100/50 mb-1">Penamaan:</div>
                          <div className="text-purple-100">{g.suffix || g.naming || g.prefix}</div>
                        </div>
                      </div>
                      <div className="glass-card border-cyan-400/30 p-4 bg-cyan-500/5">
                        <div className="text-sm text-cyan-100/50 mb-2">Contoh:</div>
                        <div className="font-mono text-xl text-cyan-100 mb-2">{g.example.compound}</div>
                        <div className="text-cyan-100 font-semibold mb-2">{g.example.name}</div>
                        <div className="text-cyan-100/60 text-sm">💡 {g.example.uses}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'isomer' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <Sparkles className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{DATA.isomerism.title}</h2>
                  <p className="text-cyan-100/60 text-lg">Senyawa dengan rumus molekul sama tetapi struktur berbeda</p>
                </div>
                <div className="space-y-8">
                  {DATA.isomerism.types.map((t, i) => (
                    <div key={i} className="glass-panel border-2 border-yellow-400/20 p-8 hover:border-yellow-400/40 transition-all">
                      <h3 className="text-3xl font-bold text-yellow-100 mb-4">{t.type}</h3>
                      <p className="text-cyan-100/70 mb-6">{t.desc}</p>
                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="glass-card border-yellow-400/30 p-4">
                          <div className="text-sm text-yellow-100/50 mb-2">Jenis-Jenis:</div>
                          <ul className="space-y-2">
                            {t.subtypes.map((st, j) => (
                              <li key={j} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-yellow-400" />
                                <span className="text-cyan-100/70">{st}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="glass-card border-green-400/30 p-4 bg-green-500/5">
                          <div className="text-sm text-green-100/50 mb-2">Contoh:</div>
                          <div className="text-green-100 font-mono">{t.example}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reaction' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <FlaskConical className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{DATA.reactions.title}</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {DATA.reactions.types.map((r, i) => (
                    <div key={i} className="glass-panel border-2 border-cyan-400/20 p-8 hover:border-cyan-400/40 transition-all">
                      <h3 className="text-2xl font-bold text-cyan-100 mb-3">{r.name}</h3>
                      <p className="text-cyan-100/70 mb-4">{r.desc}</p>
                      <div className="glass-card border-cyan-400/30 p-4 bg-cyan-500/5 mb-4">
                        <div className="text-sm text-cyan-100/50 mb-2">Contoh Reaksi:</div>
                        <div className="font-mono text-lg text-cyan-100">{r.example}</div>
                      </div>
                      <div className="glass-card border-orange-400/30 p-3 bg-orange-500/5">
                        <div className="text-sm text-orange-100/50 mb-1">Kondisi:</div>
                        <div className="text-orange-100 text-sm">{r.conditions}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'polymer' && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <Droplet className="w-20 h-20 text-blue-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-cyan-100 mb-4">{DATA.polymers.title}</h2>
                  <p className="text-cyan-100/60 text-lg">Makromolekul yang terbentuk dari unit-unit monomer</p>
                </div>
                <div className="grid gap-6">
                  {DATA.polymers.types.map((p, i) => (
                    <div key={i} className="glass-panel border-2 border-blue-400/20 p-8 hover:border-blue-400/40 transition-all">
                      <div className="flex items-start gap-6">
                        <div className="text-5xl">🔗</div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-blue-100 mb-4">{p.name}</h3>
                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="glass-card border-blue-400/30 p-4">
                              <div className="text-sm text-blue-100/50 mb-1">Monomer:</div>
                              <div className="text-blue-100 font-mono text-sm">{p.monomer}</div>
                            </div>
                            <div className="glass-card border-purple-400/30 p-4 bg-purple-500/5">
                              <div className="text-sm text-purple-100/50 mb-1">Tipe:</div>
                              <div className="text-purple-100 font-semibold">{p.type}</div>
                            </div>
                            <div className="glass-card border-green-400/30 p-4 bg-green-500/5">
                              <div className="text-sm text-green-100/50 mb-1">Kegunaan:</div>
                              <div className="text-green-100 text-sm">{p.uses}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="glass-panel border-2 border-cyan-400/30 p-12 text-center">
                  <h3 className="text-3xl font-bold text-cyan-100 mb-4">Coba Sintesis Organik!</h3>
                  <p className="text-cyan-100/60 mb-6">Pelajari reaksi senyawa organik di lab virtual</p>
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
