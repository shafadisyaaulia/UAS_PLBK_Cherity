'use client'

import { useState } from 'react'
import { BookOpen, FlaskConical, TestTube, Zap, Users, GraduationCap, Award, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'

const CHEMISTRY_MODULES = [
  {
    id: 'asam-basa',
    title: 'Asam & Basa',
    level: 'SMP - SMA',
    description: 'Pelajari sifat asam-basa, indikator pH, dan reaksi netralisasi dengan simulasi interaktif',
    experiments: 12,
    icon: '🧪',
    color: 'from-red-500 to-orange-500',
    topics: [
      'Pengenalan pH dan indikator',
      'Reaksi netralisasi',
      'Titrasi asam-basa',
      'Buffer solution'
    ]
  },
  {
    id: 'garam',
    title: 'Garam & Larutan',
    level: 'SMP',
    description: 'Eksplorasi pembentukan garam, larutan elektrolit, dan sifat koloid',
    experiments: 8,
    icon: '💎',
    color: 'from-blue-500 to-cyan-500',
    topics: [
      'Pembentukan garam',
      'Hidrolisis garam',
      'Larutan elektrolit',
      'Sifat koloid'
    ]
  },
  {
    id: 'reaksi-kimia',
    title: 'Reaksi Kimia',
    level: 'SD - SMP',
    description: 'Kenali jenis reaksi kimia, persamaan reaksi, dan hukum kekekalan massa',
    experiments: 15,
    icon: '⚡',
    color: 'from-purple-500 to-pink-500',
    topics: [
      'Jenis-jenis reaksi',
      'Persamaan reaksi',
      'Kekekalan massa',
      'Laju reaksi'
    ]
  },
  {
    id: 'elektrokimia',
    title: 'Elektrokimia',
    level: 'SMA',
    description: 'Pelajari sel volta, elektrolisis, dan korosi logam dengan simulasi real-time',
    experiments: 10,
    icon: '🔋',
    color: 'from-yellow-500 to-green-500',
    topics: [
      'Sel volta',
      'Elektrolisis',
      'Korosi logam',
      'Potensial elektrode'
    ]
  },
  {
    id: 'termokimia',
    title: 'Termokimia',
    level: 'SMA',
    description: 'Pelajari perubahan energi dalam reaksi kimia, entalpi, dan hukum Hess',
    experiments: 9,
    icon: '🔥',
    color: 'from-orange-500 to-red-500',
    topics: [
      'Perubahan entalpi',
      'Hukum Hess',
      'Reaksi eksoterm & endoterm',
      'Kalorimetri'
    ]
  },
  {
    id: 'kimia-organik',
    title: 'Kimia Organik',
    level: 'SMA',
    description: 'Kenali senyawa karbon, gugus fungsi, dan reaksi organik dasar',
    experiments: 11,
    icon: '🧬',
    color: 'from-green-500 to-teal-500',
    topics: [
      'Hidrokarbon',
      'Gugus fungsi',
      'Alkohol & eter',
      'Polimerisasi'
    ]
  }
]

const STATS = [
  {
    icon: TestTube,
    value: '65+',
    label: 'Total Eksperimen',
    color: 'text-cyan-400'
  },
  {
    icon: BookOpen,
    value: '6',
    label: 'Modul Utama',
    color: 'text-purple-400'
  },
  {
    icon: GraduationCap,
    value: '3',
    label: 'Tingkat Pendidikan',
    color: 'text-green-400'
  },
  {
    icon: Users,
    value: '100%',
    label: 'Kurikulum Sesuai',
    color: 'text-orange-400'
  }
]

export default function ModulesPage() {
  const router = useRouter()
  const [hoveredModule, setHoveredModule] = useState<string | null>(null)

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-[#0B1120] via-[#1a1f35] to-[#0B1120]">
        {/* Hero */}
        <section className="py-20 px-6 relative pt-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-card border-cyan-400/30 px-4 py-2 mb-6">
            <BookOpen className="w-4 h-4 text-cyan-400 glow-cyan-soft" />
            <span className="text-cyan-300 text-sm font-medium">Kurikulum Lengkap</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6">
            Modul Praktikum
          </h1>
          
          <p className="text-xl text-cyan-100/60 max-w-3xl mx-auto">
            Dari tingkat SD hingga SMA - pembelajaran bertahap dan terstruktur sesuai kurikulum nasional.
            Setiap modul dirancang untuk memaksimalkan pemahaman konsep kimia.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="glass-panel border-cyan-400/30 p-6 text-center hover:border-cyan-400/50 transition-all hover:-translate-y-2">
                  <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                  <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-cyan-100/60 text-sm">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Modules Grid */}
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {CHEMISTRY_MODULES.map((module) => (
              <div
                key={module.id}
                onMouseEnter={() => setHoveredModule(module.id)}
                onMouseLeave={() => setHoveredModule(null)}
                className="group relative glass-panel border-2 border-cyan-400/20 p-8 hover:border-cyan-400/50 transition-all hover:scale-[1.02] cursor-pointer overflow-hidden glow-cyan-soft"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl mb-4">{module.icon}</div>
                    <div className="glass-card border-cyan-400/30 px-3 py-1">
                      <span className="text-xs font-semibold text-cyan-400">{module.level}</span>
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold text-cyan-100 mb-3">{module.title}</h3>
                  <p className="text-cyan-100/60 mb-6 leading-relaxed">{module.description}</p>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-semibold text-cyan-100">Topik Pembelajaran:</span>
                    </div>
                    <ul className="space-y-2 ml-6">
                      {module.topics.map((topic, i) => (
                        <li key={i} className="flex items-center gap-2 text-cyan-100/50 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-cyan-400/20">
                    <div className="flex items-center gap-2">
                      <FlaskConical className="w-5 h-5 text-cyan-400" />
                      <span className="text-cyan-100 font-semibold">{module.experiments} Eksperimen</span>
                    </div>
                    <button
                      onClick={() => router.push(`/modules/${module.id}`)}
                      className={`glass-card border-2 ${hoveredModule === module.id ? 'border-cyan-400/50 bg-cyan-500/10' : 'border-cyan-400/30'} text-cyan-100 px-6 py-2 rounded-xl font-semibold transition-all`}
                    >
                      Pelajari →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-panel border-2 border-cyan-400/30 p-12 glow-cyan-soft">
            <h2 className="text-4xl font-bold text-cyan-100 mb-4">
              Siap Memulai Pembelajaran?
            </h2>
            <p className="text-cyan-100/60 text-lg mb-8">
              Pilih modul sesuai tingkat pendidikan Anda dan mulai praktikum virtual sekarang juga
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/praktikum/ph-meter')}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all glow-cyan"
              >
                Mulai Praktikum
              </button>
              <button
                onClick={() => router.push('/features')}
                className="glass-card border-2 border-cyan-400/30 text-cyan-100 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-cyan-400/50 transition-all"
              >
                Lihat Fitur
              </button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}