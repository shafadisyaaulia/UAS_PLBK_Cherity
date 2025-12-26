'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { Award, Trophy, Target, Zap, Star, Lock, CheckCircle, TrendingUp, FlaskConical, Shield, Clock, RefreshCw } from 'lucide-react'
import { getAchievements, getUserStats, formatTime, resetAchievements, type Achievement, type UserStats } from '@/lib/achievementSystem'

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = () => {
    setAchievements(getAchievements())
    setStats(getUserStats())
  }
  
  const handleReset = () => {
    if (confirm('Reset semua achievement dan progress? (Untuk testing)')) {
      resetAchievements()
      loadData()
    }
  }
  
  if (!stats) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-b from-[#0B1120] via-[#1a1f35] to-[#0B1120] pt-32 flex items-center justify-center">
          <div className="text-cyan-400 text-xl">Loading...</div>
        </div>
      </>
    )
  }



  const categories = [
    { id: 'all', label: 'Semua', icon: Star },
    { id: 'beginner', label: 'Pemula', icon: Target },
    { id: 'mastery', label: 'Penguasaan', icon: Trophy },
    { id: 'safety', label: 'Keselamatan', icon: Shield },
    { id: 'special', label: 'Spesial', icon: Zap },
    { id: 'precision', label: 'Presisi', icon: CheckCircle },
    { id: 'dedication', label: 'Dedikasi', icon: TrendingUp }
  ]

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory)

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0)

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-[#0B1120] via-[#1a1f35] to-[#0B1120] pt-20 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12 pt-12">
            <div className="inline-flex items-center gap-2 glass-card border-cyan-400/30 px-4 py-2 mb-6">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-cyan-300 text-sm font-medium">Achievement System</span>
            </div>
            <div className="flex items-center justify-center gap-4 mb-6">
              <h1 className="text-5xl md:text-6xl font-bold text-gradient">
                Pencapaian Kamu
              </h1>
              <button
                onClick={handleReset}
                className="glass-card border-cyan-400/30 p-2 rounded-lg hover:bg-cyan-500/20 transition-all"
                title="Reset Progress (Testing)"
              >
                <RefreshCw className="w-5 h-5 text-cyan-400" />
              </button>
            </div>
            <p className="text-cyan-100/60 text-lg max-w-2xl mx-auto">
              Unlock badge dan raih semua achievement untuk menjadi Chemistry Master!
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="glass-panel border-cyan-400/30 p-6 text-center">
              <FlaskConical className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-cyan-100 mb-1">{stats.completedExperiments}/{stats.totalExperiments}</div>
              <div className="text-cyan-100/60 text-sm">Praktikum</div>
            </div>
            
            <div className="glass-panel border-purple-400/30 p-6 text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-cyan-100 mb-1">{unlockedCount}/{achievements.length}</div>
              <div className="text-cyan-100/60 text-sm">Achievement</div>
            </div>
            
            <div className="glass-panel border-green-400/30 p-6 text-center">
              <Star className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-cyan-100 mb-1">{totalPoints}</div>
              <div className="text-cyan-100/60 text-sm">Total Poin</div>
            </div>
            
            <div className="glass-panel border-orange-400/30 p-6 text-center">
              <Clock className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-cyan-100 mb-1">{formatTime(stats.totalTime)}</div>
              <div className="text-cyan-100/60 text-sm">Waktu Belajar</div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="glass-panel border-cyan-400/30 p-8 mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-cyan-100 mb-1">Level: {stats.level}</h3>
                <p className="text-cyan-100/60">Next: {stats.nextLevel}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-cyan-400">{stats.progress}%</div>
                <p className="text-cyan-100/60 text-sm">Progress</p>
              </div>
            </div>
            <div className="relative w-full h-4 bg-cyan-950/50 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.progress}%` }}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {categories.map(cat => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg glow-cyan'
                      : 'glass-card border-cyan-400/30 text-cyan-100 hover:border-cyan-400/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {cat.label}
                </button>
              )
            })}
          </div>

          {/* Achievements Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map(achievement => (
              <div
                key={achievement.id}
                className={`relative glass-panel border-2 p-6 transition-all hover:scale-105 ${
                  achievement.unlocked
                    ? 'border-cyan-400/50 hover:border-cyan-400'
                    : 'border-cyan-400/20 opacity-60'
                }`}
              >
                {/* Badge Icon */}
                <div className={`absolute -top-4 left-6 w-16 h-16 rounded-2xl bg-gradient-to-br ${achievement.color} flex items-center justify-center text-4xl shadow-lg ${
                  !achievement.unlocked && 'grayscale opacity-50'
                }`}>
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </div>

                <div className="pt-10">
                  {/* Title & Points */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-cyan-100">{achievement.title}</h3>
                    <div className="flex items-center gap-1 glass-card border-cyan-400/30 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-cyan-100 font-semibold text-sm">{achievement.points}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-cyan-100/60 text-sm mb-4">{achievement.description}</p>

                  {/* Status */}
                  {achievement.unlocked ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Unlocked on {achievement.date}</span>
                    </div>
                  ) : achievement.progress !== undefined ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-cyan-100/60 text-sm">Progress</span>
                        <span className="text-cyan-400 font-semibold text-sm">{achievement.progress}%</span>
                      </div>
                      <div className="relative w-full h-2 bg-cyan-950/50 rounded-full overflow-hidden">
                        <div 
                          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${achievement.color} rounded-full transition-all duration-500`}
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-cyan-100/40">
                      <Lock className="w-5 h-5" />
                      <span className="font-semibold">Locked</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Achievements */}
          {achievements.some(a => a.unlocked) && (
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-cyan-100 mb-6 text-center">🎊 Recent Achievements</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {achievements.filter(a => a.unlocked).slice(0, 3).map(achievement => (
                  <div key={achievement.id} className="glass-panel border-cyan-400/30 p-4 flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center text-2xl`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-cyan-100 font-bold">{achievement.title}</h4>
                      <p className="text-cyan-100/60 text-sm">{achievement.date}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4" />
                      <span className="font-bold">{achievement.points}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
