'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import SupabaseProfileDemo from '@/components/SupabaseProfileDemo'
import SupabaseAuthDemo from '@/components/SupabaseAuthDemo'
// Import PoseDetector secara dinamis agar hanya di-load di client
const PoseDetector = dynamic(() => import('@/components/PoseDetector'), { ssr: false })
import { FlaskConical, Sparkles, BookOpen, Camera, Beaker, TestTube, BarChart3, Users, ArrowRight, Play, Shield, Brain, Hand, MousePointer2, Zap, Droplet, FileText } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'

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
  },
  {
    icon: Zap,
    title: 'Real-time Processing',
    description: 'Perhitungan pH, suhu, dan reaksi kimia dalam hitungan milidetik',
    highlight: 'Fast'
  },
  {
    icon: Droplet,
    title: 'Accurate Simulation',
    description: 'Simulasi reaksi kimia akurat berdasarkan data ilmiah terpercaya',
    highlight: 'Precise'
  },
  {
    icon: Hand,
    title: 'Gesture Control',
    description: 'Berbagai gesture tangan untuk mengontrol seluruh aspek praktikum',
    highlight: 'Innovative'
  },
  {
    icon: MousePointer2,
    title: 'Multi-Platform',
    description: 'Akses dari desktop, tablet, atau smartphone dengan pengalaman optimal',
    highlight: 'Flexible'
  }
]

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

export default function BerandaPage() {
  const router = useRouter()
  const [hoveredModule, setHoveredModule] = useState<string | null>(null)

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-[#0B1120] via-[#1a1f35] to-[#0B1120]">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden pt-32">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <div className="text-center space-y-8">
              {/* Logo and Title */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 glass-panel border-cyan-400/30 px-6 py-3 mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-cyan-100 font-medium">Laboratorium Virtual Interaktif</span>
                </div>
              
              <h1 className="text-6xl md:text-8xl font-bold text-gradient mb-6">
                SOLVIA
              </h1>
              
              <p className="text-2xl md:text-3xl text-cyan-100/80 max-w-3xl mx-auto">
                Solution Of Laboratory Via Interactive Assistant
              </p>
              
              <p className="text-lg text-cyan-100/60 max-w-2xl mx-auto leading-relaxed">
                Platform pembelajaran kimia revolusioner dengan teknologi Computer Vision dan AI. 
                Praktikum aman, interaktif, dan menyenangkan untuk semua tingkat pendidikan.
              </p>
              {/* Demo Computer Vision Serverless */}
              <div className="flex flex-col items-center justify-center py-8">
                <div className="mb-2 text-cyan-200 font-semibold">Demo Pose Detection (MediaPipe JS, 100% di browser)</div>
                <div className="rounded-xl border-2 border-cyan-400/30 bg-black/40 shadow-lg">
                  <PoseDetector />
                </div>
                <div className="text-xs text-cyan-300/60 mt-2">Tidak ada data dikirim ke server. Semua proses AI di browser kamu.</div>
                {/* Login/profile info now moved to navbar dropdown */}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => router.push('/praktikum/ph-meter')}
                className="group bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all flex items-center gap-3 hover:scale-105 glow-cyan"
              >
                <Play className="w-6 h-6" />
                Mulai Praktikum Sekarang
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
              
              <button 
                onClick={() => router.push('/modules')}
                className="group glass-card border-2 border-cyan-400/30 text-cyan-100 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-cyan-400/50 transition-all flex items-center gap-3 hover:scale-105"
              >
                <BookOpen className="w-6 h-6" />
                Lihat Materi
              </button>
            </div>

            {/* Stats Counter */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8">
              <div className="glass-panel border-cyan-400/30 p-6 text-center hover:border-cyan-400/50 transition-all">
                <div className="text-4xl font-bold text-cyan-400 mb-2">50+</div>
                <div className="text-cyan-100/60 text-sm">Experiments</div>
              </div>
              <div className="glass-panel border-cyan-400/30 p-6 text-center hover:border-cyan-400/50 transition-all">
                <div className="text-4xl font-bold text-cyan-400 mb-2">2</div>
                <div className="text-cyan-100/60 text-sm">Control Modes</div>
              </div>
              <div className="glass-panel border-cyan-400/30 p-6 text-center hover:border-cyan-400/50 transition-all">
                <div className="text-4xl font-bold text-cyan-400 mb-2">100%</div>
                <div className="text-cyan-100/60 text-sm">Safe & Virtual</div>
              </div>
              <div className="glass-panel border-cyan-400/30 p-6 text-center hover:border-cyan-400/50 transition-all">
                <div className="text-3xl font-bold text-cyan-400 mb-2">Smart</div>
                <div className="text-cyan-100/60 text-sm">Vision System</div>
              </div>
            </div>

            {/* Interactive 3D Beaker Mascot */}
            <div className="relative py-12">
              <div className="glass-panel border-2 border-cyan-400/30 p-12 max-w-5xl mx-auto glow-cyan-soft">
                <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                  {/* Beaker Container */}
                  <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-3xl scale-150 animate-pulse" />
                    
                    <div className="relative w-48 h-64 border-4 border-cyan-400 rounded-b-3xl rounded-t-lg bg-gradient-to-b from-transparent to-cyan-500/5 backdrop-blur-sm transform group-hover:scale-110 transition-all duration-500 group-hover:rotate-6">
                      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-cyan-400/60 via-blue-400/50 to-purple-400/40 rounded-b-3xl overflow-hidden">
                        <div className="absolute bottom-0 left-1/4 w-5 h-5 bg-white/40 rounded-full animate-bounce" style={{animationDuration: '2s'}} />
                        <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-white/30 rounded-full animate-bounce" style={{animationDuration: '2.5s', animationDelay: '0.5s'}} />
                        <div className="absolute bottom-0 left-3/4 w-6 h-6 bg-white/35 rounded-full animate-bounce" style={{animationDuration: '3s', animationDelay: '1s'}} />
                        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
                      </div>
                      
                      <div className="absolute left-3 top-10 space-y-8">
                        <div className="w-5 h-0.5 bg-cyan-400/50" />
                        <div className="w-5 h-0.5 bg-cyan-400/50" />
                        <div className="w-5 h-0.5 bg-cyan-400/50" />
                      </div>
                      
                      <div className="absolute top-6 right-6 text-yellow-300 animate-ping text-3xl">✨</div>
                    </div>
                    
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-5xl animate-bounce" style={{animationDuration: '2s'}}>
                      😊
                    </div>
                  </div>
                  
                  {/* Mascot Text */}
                  <div className="text-center md:text-left space-y-4">
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                      SOLVIA Assistant
                    </div>
                    <p className="text-cyan-100/60 text-lg max-w-md">
                      🧪 Asisten virtual Anda untuk eksperimen kimia yang aman dan menyenangkan!
                    </p>
                    <div className="flex gap-4 justify-center md:justify-start pt-4">
                      <div className="glass-card border-cyan-400/30 px-4 py-2">
                        <div className="text-sm text-cyan-400 font-semibold">pH: 7.0</div>
                      </div>
                      <div className="glass-card border-green-400/30 px-4 py-2">
                        <div className="text-sm text-green-400 font-semibold">✓ Safe</div>
                      </div>
                      <div className="glass-card border-orange-400/30 px-4 py-2">
                        <div className="text-sm text-orange-400 font-semibold">26°C</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto pt-8">
              <Link
                href="/modules"
                className="group glass-panel border-2 border-cyan-400/20 p-8 hover:border-cyan-400/50 transition-all hover:-translate-y-2 cursor-pointer glow-cyan-soft"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 glow-cyan transform group-hover:scale-110 transition-transform">
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-cyan-100 mb-2">Materi</h3>
                    <p className="text-cyan-100/60">Bahan pembelajaran kimia lengkap</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-cyan-400 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>

              <Link
                href="/praktikum/ph-meter"
                className="group glass-panel border-2 border-cyan-400/20 p-8 hover:border-cyan-400/50 transition-all hover:-translate-y-2 cursor-pointer glow-cyan-soft"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 glow-cyan transform group-hover:scale-110 transition-transform">
                    <Beaker className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-cyan-100 mb-2">Praktikum</h3>
                    <p className="text-cyan-100/60">Lab virtual interaktif</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-cyan-400 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>

              <Link
                href="/experiments"
                className="group glass-panel border-2 border-cyan-400/20 p-8 hover:border-cyan-400/50 transition-all hover:-translate-y-2 cursor-pointer glow-cyan-soft"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 glow-cyan transform group-hover:scale-110 transition-transform">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-cyan-100 mb-2">Test</h3>
                    <p className="text-cyan-100/60">Uji pemahaman Anda</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-cyan-400 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>

              <Link
                href="/about"
                className="group glass-panel border-2 border-cyan-400/20 p-8 hover:border-cyan-400/50 transition-all hover:-translate-y-2 cursor-pointer glow-cyan-soft"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 glow-cyan transform group-hover:scale-110 transition-transform">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-cyan-100 mb-2">Tentang</h3>
                    <p className="text-cyan-100/60">Tentang SOLVIA dan tim</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-cyan-400 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 relative">
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
      <section id="modules" className="py-20 px-6 relative">
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
                    <div className="text-5xl mb-4">{module.icon}</div>
                    <div className="glass-card border-cyan-400/30 px-3 py-1">
                      <span className="text-xs font-semibold text-cyan-400">{module.level}</span>
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold text-cyan-100 mb-3">{module.title}</h3>
                  <p className="text-cyan-100/60 mb-6 leading-relaxed">{module.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-cyan-400/20">
                    <div className="flex items-center gap-2">
                      <FlaskConical className="w-5 h-5 text-cyan-400" />
                      <span className="text-cyan-100 font-semibold">{module.experiments} Eksperimen</span>
                    </div>
                    <button
                      onClick={() => router.push('/praktikum/ph-meter')}
                      className={`glass-card border-2 ${hoveredModule === module.id ? 'border-cyan-400/50 bg-cyan-500/10' : 'border-cyan-400/30'} text-cyan-100 px-6 py-2 rounded-xl font-semibold transition-all`}
                    >
                      Mulai →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-cyan-400/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FlaskConical className="w-6 h-6 text-cyan-400" />
            <span className="text-xl font-bold text-gradient">SOLVIA</span>
          </div>
          <p className="text-cyan-100/60 mb-4">
            Solution Of Laboratory Via Interactive Assistant
          </p>
          <p className="text-cyan-100/40 text-sm">
            © 2025 SOLVIA. Dibuat dengan ❤️ oleh Shafa Disya Aulia & Dea Zasqia Pasaribu Malau
          </p>
        </div>
      </footer>
      </div>
    </>
  )
}
