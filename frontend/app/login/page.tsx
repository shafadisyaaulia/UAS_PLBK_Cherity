'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate login - in production, implement proper authentication
    console.log('Login attempt:', { username, password, rememberMe })
    router.push('/praktikum/ph-meter')
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] relative overflow-hidden flex items-center justify-center">
      {/* Abstract Background with Data Streams */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        {/* Glowing Grid Lines */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        
        {/* Data Stream Effect */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent animate-pulse" />
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Login Form - Glassmorphism */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-blue-950/30 backdrop-blur-xl border-2 border-cyan-400/30 rounded-2xl p-8 shadow-[0_0_60px_rgba(0,212,255,0.2)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="text-5xl">🧪</div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-2">
              AI-Safe Virtual Lab
            </h1>
            <p className="text-cyan-100/60">Sign in to continue</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-cyan-100/80 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-blue-950/50 backdrop-blur-sm border-2 border-cyan-400/30 rounded-lg px-4 py-3 text-white placeholder-cyan-300/40 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-cyan-100/80 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-blue-950/50 backdrop-blur-sm border-2 border-cyan-400/30 rounded-lg px-4 py-3 text-white placeholder-cyan-300/40 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-cyan-100/70 cursor-pointer hover:text-cyan-100 transition-colors">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 w-4 h-4 rounded bg-blue-950/50 border-2 border-cyan-400/40 text-cyan-400 focus:ring-2 focus:ring-cyan-400/50" 
                />
                Remember Me
              </label>
              <Link href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 rounded-lg shadow-[0_0_30px_rgba(0,212,255,0.4)] hover:shadow-[0_0_50px_rgba(0,212,255,0.6)] hover:scale-[1.02] transition-all duration-300 border-2 border-cyan-400/50"
            >
              Login
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-cyan-100/60 text-sm">
              Don't have an account?{' '}
              <Link href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold">
                Request Access
              </Link>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <p className="text-cyan-300/50 text-sm flex items-center justify-center gap-2">
            <span>🔒</span>
            <span>Secured with end-to-end encryption</span>
          </p>
        </div>
      </div>
    </div>
  )
}
