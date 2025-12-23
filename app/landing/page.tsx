'use client'

import { useState } from 'react'
import { FlaskConical, Sparkles, BookOpen, Camera, Play, ChevronRight, Beaker, TestTube, Droplet, Zap, Shield, Brain, MousePointer2, Hand } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const CHEMISTRY_MODULES = [
  {
    id: 'asam-basa',
    title: 'Asam & Basa',
    level: 'SMP - SMA',
    description: 'Pelajari sifat asam-basa, indikator pH, dan reaksi netralisasi dengan simulasi interaktif',
    experiments: 12,
    icon: '🧪',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'garam',
    title: 'Garam & Larutan',
    level: 'SMP',
    description: 'Eksplorasi pembentukan garam, larutan elektrolit, dan sifat koloid',
    experiments: 8,
    icon: '💎',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'reaksi-kimia',
    title: 'Reaksi Kimia',
    level: 'SD - SMP',
    description: 'Kenali jenis reaksi kimia, persamaan reaksi, dan hukum kekekalan massa',
    experiments: 15,
    icon: '⚡',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'elektrokimia',
    title: 'Elektrokimia',
    level: 'SMA',
    description: 'Pelajari sel volta, elektrolisis, dan korosi logam dengan simulasi real-time',
    experiments: 10,
    icon: '🔋',
    color: 'from-yellow-500 to-green-500'
  }
]

const FEATURES = [
  {
    icon: Camera,
    title: 'Computer Vision Mode',
    description: 'Kontrol praktikum dengan gerakan tangan menggunakan AI computer vision - tanpa sentuh layar!',
    highlight: 'AI-Powered'
  },
  {
    icon: Beaker,
    title: 'Drag & Drop Mode',
    description: 'Mode interaktif klasik - drag komponen kimia dan lihat reaksi secara real-time',
    highlight: 'Interactive'
  },
  {
    icon: Brain,
    title: 'Smart Analysis',
    description: 'AI menganalisis eksperimen Anda dan memberikan feedback serta safety warning',
    highlight: 'Intelligent'
  },
  {
    icon: Shield,
    title: 'Safety First',
    description: 'Sistem deteksi bahaya otomatis untuk memastikan praktikum aman dan terkontrol',
    highlight: 'Protected'
  }
]

export default function LandingPage() {
  const router = useRouter()
  const [hoveredModule, setHoveredModule] = useState<string | null>(null)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0B1120' }}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-cyan-400/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FlaskConical className="w-8 h-8 text-cyan-400 glow-cyan-soft" />
              <h1 className="text-2xl font-bold text-gradient">
                SOLVIA
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="nav-link text-cyan-100/70 hover:text-cyan-100">Fitur</a>
              <a href="#modules" className="nav-link text-cyan-100/70 hover:text-cyan-100">Modul</a>
              <a href="#about" className="nav-link text-cyan-100/70 hover:text-cyan-100">Tentang</a>
              <button 
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all glow-cyan"
              >
                Mulai Praktikum
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 glass-card border-cyan-400/30 px-4 py-2">
              <Sparkles className="w-4 h-4 text-cyan-400 glow-cyan-soft" />
              <span className="text-cyan-300 text-sm font-medium">Revolusi Pembelajaran Kimia dengan AI</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              <span className="text-gradient glow-cyan-soft">
                SOLVIA
              </span>
              <br />
              <span className="text-cyan-100">Laboratory Intelligence</span>
            </h1>
            
            <p className="text-xl text-cyan-100/70 max-w-3xl mx-auto leading-relaxed">
              Platform praktikum kimia virtual dengan teknologi <span className="text-cyan-400 font-semibold glow-cyan-soft">Computer Vision</span> dan <span className="text-cyan-400 font-semibold glow-cyan-soft">AI Analysis</span>.
              Eksplorasi reaksi kimia secara aman dengan kontrol gesture tangan atau drag & drop interaktif.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button 
                onClick={() => router.push('/dashboard?mode=cv')}
                className="group bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all flex items-center gap-3 hover:scale-105 glow-cyan"
              >
                <Camera className="w-6 h-6" />
                Computer Vision Mode
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => router.push('/dashboard?mode=drag')}
                className="group glass-card border-2 border-cyan-400/30 text-cyan-100 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-cyan-400/50 transition-all flex items-center gap-3 hover:scale-105"
              >
                <MousePointer2 className="w-6 h-6" />
                Drag & Drop Mode
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Preview with animated gradient */}
            <div className="mt-16 relative">
              <div className="glass-panel border-2 border-cyan-400/30 p-4 glow-cyan-soft">
                <div className="aspect-video bg-black/30 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 animate-pulse" />
                  <FlaskConical className="w-32 h-32 text-cyan-400/30" />
                  <div className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-white text-xs font-semibold">DEMO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-cyan-100 mb-4">Fitur Unggulan</h2>
            <p className="text-cyan-100/60 text-lg">Teknologi terdepan untuk pengalaman belajar kimia yang tak terlupakan</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, idx) => (
              <div 
                key={idx}
                className="group glass-panel border-cyan-400/20 p-6 hover:border-cyan-400/50 transition-all hover:-translate-y-2 glow-cyan-soft"
              >
                <div className="mb-4">
                  <div className="inline-flex p-3 glass-card border-cyan-400/20 group-hover:bg-cyan-500/20 transition-colors">
                    <feature.icon className="w-8 h-8 text-cyan-400 glow-cyan-soft" />
                  </div>
                  <span className="ml-2 text-xs font-bold text-cyan-400 glass-card border-cyan-400/30 px-2 py-1">
                    {feature.highlight}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-cyan-100 mb-3">{feature.title}</h3>
                <p className="text-cyan-100/60 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chemistry Modules Section */}
      <section id="modules" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass-card border-cyan-400/30 px-4 py-2 mb-4">
              <BookOpen className="w-4 h-4 text-cyan-400 glow-cyan-soft" />
              <span className="text-cyan-300 text-sm font-medium">Kurikulum Lengkap</span>
            </div>
            <h2 className="text-4xl font-bold text-cyan-100 mb-4">Modul Praktikum Kimia</h2>
            <p className="text-cyan-100/60 text-lg">Dari tingkat SD hingga SMA - pembelajaran bertahap dan terstruktur</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
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
                    <div className="text-6xl">{module.icon}</div>
                    <span className="glass-card border-cyan-400/30 text-cyan-300 px-3 py-1 text-xs font-semibold">
                      {module.level}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-cyan-100 mb-3">{module.title}</h3>
                  <p className="text-cyan-100/60 mb-6 leading-relaxed">{module.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <TestTube className="w-5 h-5 glow-cyan-soft" />
                      <span className="font-semibold">{module.experiments} Eksperimen</span>
                    </div>
                    <button 
                      onClick={() => router.push(`/dashboard?module=${module.id}`)}
                      className="flex items-center gap-2 text-cyan-400 group-hover:text-cyan-300 transition-colors glow-cyan-soft"
                    >
                      <span className="font-semibold">Mulai</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Mode Comparison */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-cyan-100 mb-4">Pilih Mode Praktikum</h2>
            <p className="text-cyan-100/60 text-lg">Dua cara berbeda untuk eksplorasi kimia - sesuai gaya belajar Anda</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Computer Vision Mode */}
            <div className="glass-panel border-2 border-purple-400/30 p-8 glow-cyan-soft">
              <div className="flex items-center gap-3 mb-6">
                <Hand className="w-10 h-10 text-purple-400 glow-cyan-soft" />
                <h3 className="text-2xl font-bold text-purple-100">Computer Vision Mode</h3>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full glass-card border-purple-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-300 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-purple-100 font-semibold mb-1">Aktifkan Kamera</h4>
                    <p className="text-purple-200/60 text-sm">Izinkan akses kamera untuk tracking tangan</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full glass-card border-purple-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-300 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-purple-100 font-semibold mb-1">Gunakan Gesture</h4>
                    <p className="text-purple-200/60 text-sm">👉 Point untuk hover, 🤏 Pinch untuk tambah kimia</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full glass-card border-purple-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-300 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-purple-100 font-semibold mb-1">Lihat Reaksi</h4>
                    <p className="text-purple-200/60 text-sm">AI analisis otomatis + safety warning real-time</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => router.push('/dashboard?mode=cv')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-3 glow-cyan"
              >
                <Play className="w-5 h-5" />
                Coba Computer Vision
              </button>
            </div>

            {/* Drag & Drop Mode */}
            <div className="glass-panel border-2 border-blue-400/30 p-8 glow-cyan-soft">
              <div className="flex items-center gap-3 mb-6">
                <MousePointer2 className="w-10 h-10 text-blue-400 glow-cyan-soft" />
                <h3 className="text-2xl font-bold text-blue-100">Drag & Drop Mode</h3>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full glass-card border-blue-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-300 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-blue-100 font-semibold mb-1">Pilih Komponen</h4>
                    <p className="text-blue-200/60 text-sm">Klik atau sentuh komponen kimia dari panel</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full glass-card border-blue-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-300 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-blue-100 font-semibold mb-1">Drag ke Area Praktikum</h4>
                    <p className="text-blue-200/60 text-sm">Seret komponen untuk membangun rangkaian</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full glass-card border-blue-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-300 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-blue-100 font-semibold mb-1">Simulasi Real-time</h4>
                    <p className="text-blue-200/60 text-sm">Lihat perhitungan pH dan reaksi kimia instant</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => router.push('/dashboard?mode=drag')}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-3 glow-cyan"
              >
                <Play className="w-5 h-5" />
                Coba Drag & Drop
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-cyan-100 mb-6">Tentang SOLVIA</h2>
          <p className="text-cyan-100/70 text-lg leading-relaxed mb-8">
            <span className="text-cyan-400 font-semibold glow-cyan-soft">SOLVIA (Solution Vision-driven Laboratory with Intelligent Analytics)</span> adalah platform pembelajaran kimia interaktif yang menggabungkan teknologi Computer Vision, Artificial Intelligence, dan simulasi real-time untuk menciptakan pengalaman praktikum yang aman, menyenangkan, dan edukatif.
          </p>
          <p className="text-cyan-100/70 text-lg leading-relaxed">
            Dikembangkan untuk mendukung pembelajaran kimia di tingkat SD, SMP, dan SMA dengan pendekatan hands-on yang tetap memperhatikan aspek keamanan laboratorium.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-panel border-t border-cyan-400/20 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FlaskConical className="w-6 h-6 text-cyan-400 glow-cyan-soft" />
              <span className="text-cyan-100 font-semibold">SOLVIA © 2025</span>
            </div>
            <div className="flex items-center gap-6 text-cyan-100/60 text-sm">
              <a href="#" className="hover:text-cyan-100 transition-colors">Privacy</a>
              <a href="#" className="hover:text-cyan-100 transition-colors">Terms</a>
              <a href="#" className="hover:text-cyan-100 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
