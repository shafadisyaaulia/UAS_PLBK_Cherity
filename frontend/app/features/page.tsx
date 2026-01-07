'use client'

import { Camera, Beaker, Brain, Shield, Zap, Droplet, Hand, MousePointer2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'

const FEATURES = [
  {
    icon: Camera,
    title: 'Computer Vision Mode',
    description: 'Kontrol praktikum dengan gerakan tangan menggunakan AI computer vision - tanpa sentuh layar!',
    highlight: 'AI-Powered',
    color: 'from-purple-500 to-pink-500',
    details: [
      'Deteksi gerakan tangan real-time',
      'Kontrol tanpa sentuh',
      'Akurasi tinggi dengan MediaPipe',
      'Pengalaman futuristik'
    ]
  },
  {
    icon: Beaker,
    title: 'Drag & Drop Mode',
    description: 'Mode interaktif klasik - drag komponen kimia dan lihat reaksi secara real-time',
    highlight: 'Interactive',
    color: 'from-cyan-500 to-blue-500',
    details: [
      'Antarmuka intuitif',
      'Drag and drop mudah',
      'Response cepat',
      'Cocok untuk semua perangkat'
    ]
  },
  {
    icon: Brain,
    title: 'Smart Analysis',
    description: 'AI menganalisis eksperimen Anda dan memberikan feedback serta safety warning',
    highlight: 'Intelligent',
    color: 'from-blue-500 to-indigo-500',
    details: [
      'Analisis otomatis hasil',
      'Feedback real-time',
      'Deteksi error cerdas',
      'Rekomendasi eksperimen'
    ]
  },
  {
    icon: Shield,
    title: 'Safety First',
    description: 'Sistem deteksi bahaya otomatis untuk memastikan praktikum aman dan terkontrol',
    highlight: 'Protected',
    color: 'from-red-500 to-orange-500',
    details: [
      'Warning otomatis',
      'Monitoring berkelanjutan',
      'Panduan keselamatan',
      '100% virtual dan aman'
    ]
  },
  {
    icon: Zap,
    title: 'Real-time Processing',
    description: 'Perhitungan pH, suhu, dan reaksi kimia dalam hitungan milidetik',
    highlight: 'Fast',
    color: 'from-yellow-500 to-orange-500',
    details: [
      'Kalkulasi instan',
      'Update real-time',
      'Performa tinggi',
      'Tanpa lag'
    ]
  },
  {
    icon: Droplet,
    title: 'Accurate Simulation',
    description: 'Simulasi reaksi kimia akurat berdasarkan data ilmiah terpercaya',
    highlight: 'Precise',
    color: 'from-teal-500 to-cyan-500',
    details: [
      'Data ilmiah valid',
      'Model reaksi akurat',
      'Hasil dapat dipercaya',
      'Sesuai kurikulum'
    ]
  },
  {
    icon: Hand,
    title: 'Gesture Control',
    description: 'Berbagai gesture tangan untuk mengontrol seluruh aspek praktikum',
    highlight: 'Innovative',
    color: 'from-pink-500 to-rose-500',
    details: [
      '10+ gesture tersedia',
      'Kustomisasi gesture',
      'Pembelajaran mudah',
      'Kontrol penuh'
    ]
  },
  {
    icon: MousePointer2,
    title: 'Multi-Platform',
    description: 'Akses dari desktop, tablet, atau smartphone dengan pengalaman optimal',
    highlight: 'Flexible',
    color: 'from-green-500 to-emerald-500',
    details: [
      'Responsive design',
      'Cross-platform',
      'Browser modern',
      'PWA ready'
    ]
  }
]

export default function FeaturesPage() {
  const router = useRouter()

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-[#0B1120] via-[#1a1f35] to-[#0B1120]">
        {/* Hero */}
        <section className="py-20 px-6 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-card border-cyan-400/30 px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-cyan-400 glow-cyan-soft" />
            <span className="text-cyan-300 text-sm font-medium">Teknologi Terdepan</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6">
            Fitur Unggulan
          </h1>
          
          <p className="text-xl text-cyan-100/60 max-w-3xl mx-auto">
            Teknologi terdepan untuk pengalaman belajar kimia yang tak terlupakan. 
            CHERITY menggabungkan AI, Computer Vision, dan simulasi akurat dalam satu platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div
                  key={idx}
                  className="group glass-panel border-cyan-400/20 p-8 hover:border-cyan-400/50 transition-all hover:-translate-y-2 glow-cyan-soft"
                >
                  <div className="mb-6">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} glow-cyan-soft mb-4 transform group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <span className="ml-2 text-xs font-bold text-cyan-400 glass-card border-cyan-400/30 px-3 py-1">
                      {feature.highlight}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-cyan-100 mb-3">{feature.title}</h3>
                  <p className="text-cyan-100/60 mb-6 leading-relaxed">{feature.description}</p>

                  <ul className="space-y-2">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-cyan-100/50 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-panel border-2 border-cyan-400/30 p-12 glow-cyan-soft">
            <h2 className="text-4xl font-bold text-cyan-100 mb-4">
              Siap Mencoba?
            </h2>
            <p className="text-cyan-100/60 text-lg mb-8">
              Rasakan pengalaman praktikum kimia virtual terbaik dengan semua fitur canggih ini
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/praktikum/ph-meter')}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all glow-cyan"
              >
                Mulai Sekarang
              </button>
              <button
                onClick={() => router.push('/modules')}
                className="glass-card border-2 border-cyan-400/30 text-cyan-100 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-cyan-400/50 transition-all"
              >
                Lihat Modul
              </button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}