'use client'

import { FlaskConical, Sparkles, Target, Zap, Users, Award, Mail, Github, Linkedin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ProfileCard from '@/components/ProfileCard'
import Navigation from '@/components/Navigation'

export default function AboutPage() {
  const router = useRouter()

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-[#0B1120] via-[#1a1f35] to-[#0B1120]">
      
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden pt-32">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <FlaskConical className="w-16 h-16 text-cyan-400 glow-cyan-soft" />
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                SOLVIA
              </h1>
            </div>
            <p className="text-2xl text-cyan-100/80 font-semibold mb-4">
              Solution Vision-driven Laboratory with Intelligent Analytics
            </p>
            <p className="text-cyan-100/60 text-lg max-w-3xl mx-auto leading-relaxed">
              Platform pembelajaran kimia interaktif yang menggabungkan Computer Vision, AI, dan simulasi real-time untuk menciptakan pengalaman praktikum yang aman, menyenangkan, dan edukatif.
            </p>
          </div>

          {/* Mission & Vision Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="glass-panel border-2 border-cyan-400/30 p-8 glow-cyan-soft">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-cyan-400 glow-cyan-soft" />
                <h2 className="text-2xl font-bold text-cyan-100">Visi Kami</h2>
              </div>
              <p className="text-cyan-100/70 leading-relaxed">
                Menjadi platform pembelajaran kimia terdepan yang menghadirkan pengalaman praktikum virtual yang realistis, aman, dan accessible untuk semua kalangan pendidikan di Indonesia.
              </p>
            </div>

            <div className="glass-panel border-2 border-purple-400/30 p-8 glow-cyan-soft">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-purple-400 glow-cyan-soft" />
                <h2 className="text-2xl font-bold text-cyan-100">Misi Kami</h2>
              </div>
              <p className="text-cyan-100/70 leading-relaxed">
                Memberikan solusi inovatif dalam pembelajaran kimia dengan memanfaatkan teknologi Computer Vision dan AI untuk menciptakan pengalaman hands-on yang aman tanpa risiko laboratorium fisik.
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div className="glass-panel border-2 border-cyan-400/20 p-10 mb-20">
            <h2 className="text-3xl font-bold text-cyan-100 mb-8 text-center">Fitur Unggulan</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex p-4 glass-card border-cyan-400/30 rounded-2xl mb-4">
                  <Zap className="w-10 h-10 text-cyan-400 glow-cyan-soft" />
                </div>
                <h3 className="text-xl font-bold text-cyan-100 mb-2">Real-time Processing</h3>
                <p className="text-cyan-100/60 text-sm">
                  Deteksi gesture tangan menggunakan MediaPipe dengan response time ultra-fast
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex p-4 glass-card border-purple-400/30 rounded-2xl mb-4">
                  <Award className="w-10 h-10 text-purple-400 glow-cyan-soft" />
                </div>
                <h3 className="text-xl font-bold text-cyan-100 mb-2">50+ Eksperimen</h3>
                <p className="text-cyan-100/60 text-sm">
                  Modul lengkap dari tingkat SD hingga SMA dengan kurikulum terstruktur
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex p-4 glass-card border-green-400/30 rounded-2xl mb-4">
                  <Users className="w-10 h-10 text-green-400 glow-cyan-soft" />
                </div>
                <h3 className="text-xl font-bold text-cyan-100 mb-2">100% Safe</h3>
                <p className="text-cyan-100/60 text-sm">
                  Praktikum virtual tanpa risiko bahan kimia berbahaya atau kecelakaan lab
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-cyan-100 mb-4">Tim Pengembang</h2>
            <p className="text-cyan-100/60 text-lg">
              Dibangun dengan dedikasi oleh mahasiswa Informatika
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Developer 1 */}
            <div className="flex flex-col items-center">
              <ProfileCard
                avatarUrl="/images/team/shafa.JPG" 
                name="Shafa Disya Aulia"
                title="Full Stack Developer"
                handle="shafadisya"
                status="Active"
                contactText="Contact"
                behindGlowEnabled={true}
                behindGlowColor="rgba(34, 211, 238, 0.5)"
                innerGradient="linear-gradient(145deg, #22d3ee44 0%, #06b6d444 100%)"
                onContactClick={() => window.open('mailto:shafa@solvia.lab', '_blank')}
                avatarStyle={{ objectPosition: 'center 5%' }}
              />
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => window.open('mailto:shafa@solvia.lab', '_blank')}
                  className="glass-card border-cyan-400/30 p-3 rounded-xl hover:bg-cyan-500/20 transition-all group"
                >
                  <Mail className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => window.open('https://github.com/shafadisya', '_blank')}
                  className="glass-card border-cyan-400/30 p-3 rounded-xl hover:bg-cyan-500/20 transition-all group"
                >
                  <Github className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => window.open('https://linkedin.com/in/shafadisya', '_blank')}
                  className="glass-card border-cyan-400/30 p-3 rounded-xl hover:bg-cyan-500/20 transition-all group"
                >
                  <Linkedin className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </button>
              </div>
              <p className="text-cyan-100/60 text-center mt-4 max-w-xs">
                Spesialisasi: Frontend Development, UI/UX Design, Computer Vision Integration
              </p>
            </div>

            {/* Developer 2 */}
            <div className="flex flex-col items-center">
              <ProfileCard
                avatarUrl="/images/team/dea.jpeg"
                name="Dea Zasqia Pasaribu Malau"
                title="Backend Developer"
                handle="deazasqia"
                status="Active"
                contactText="Contact"
                behindGlowEnabled={true}
                behindGlowColor="rgba(139, 92, 246, 0.5)"
                innerGradient="linear-gradient(145deg, #8b5cf644 0%, #7c3aed44 100%)"
                onContactClick={() => window.open('mailto:dea@solvia.lab', '_blank')}
                avatarStyle={{ objectPosition: 'center 45%' }}
              />
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => window.open('mailto:dea@solvia.lab', '_blank')}
                  className="glass-card border-purple-400/30 p-3 rounded-xl hover:bg-purple-500/20 transition-all group"
                >
                  <Mail className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => window.open('https://github.com/deazasqia', '_blank')}
                  className="glass-card border-purple-400/30 p-3 rounded-xl hover:bg-purple-500/20 transition-all group"
                >
                  <Github className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => window.open('https://linkedin.com/in/deazasqia', '_blank')}
                  className="glass-card border-purple-400/30 p-3 rounded-xl hover:bg-purple-500/20 transition-all group"
                >
                  <Linkedin className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                </button>
              </div>
              <p className="text-cyan-100/60 text-center mt-4 max-w-xs">
                Spesialisasi: API Development, Machine Learning, Chemistry Simulation Logic
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="glass-panel border-2 border-cyan-400/20 p-10 mt-20">
            <h2 className="text-3xl font-bold text-cyan-100 mb-8 text-center">Technology Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl mb-2">⚛️</div>
                <div className="text-cyan-100 font-semibold">React & Next.js</div>
                <div className="text-cyan-100/50 text-sm">Frontend Framework</div>
              </div>
              <div>
                <div className="text-4xl mb-2">🐍</div>
                <div className="text-cyan-100 font-semibold">Python FastAPI</div>
                <div className="text-cyan-100/50 text-sm">Backend API</div>
              </div>
              <div>
                <div className="text-4xl mb-2">📷</div>
                <div className="text-cyan-100 font-semibold">MediaPipe</div>
                <div className="text-cyan-100/50 text-sm">Hand Tracking AI</div>
              </div>
              <div>
                <div className="text-4xl mb-2">🎨</div>
                <div className="text-cyan-100 font-semibold">Tailwind CSS</div>
                <div className="text-cyan-100/50 text-sm">Styling</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-20">
            <button
              onClick={() => router.push('/praktikum/ph-meter')}
              className="group bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all flex items-center gap-3 mx-auto glow-cyan"
            >
              <FlaskConical className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Mulai Praktikum Sekarang
              <Sparkles className="w-6 h-6 group-hover:scale-125 transition-transform" />
            </button>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}
