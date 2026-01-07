// Achievement System with LocalStorage
export interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  category: string
  unlocked: boolean
  date?: string
  progress?: number
  points: number
  color: string
  condition: {
    type: 'quiz_complete' | 'quiz_score' | 'praktikum_complete' | 'praktikum_count' | 'perfect_ph' | 'streak_days' | 'module_diversity' | 'night_practice'
    target?: number
    current?: number
  }
}

export interface UserStats {
  totalExperiments: number
  completedExperiments: number
  totalTime: number // in minutes
  perfectScores: number
  level: string
  nextLevel: string
  progress: number
  lastPracticeDate?: string
  streakDays: number
  modulesDone: string[]
  perfectPHCount: number
  quizScores: { moduleId: string; score: number; date: string }[]
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    title: 'First Steps',
    description: 'Selesaikan praktikum pertama kamu',
    icon: '🎯',
    category: 'beginner',
    unlocked: false,
    points: 10,
    color: 'from-green-500 to-emerald-500',
    condition: { type: 'praktikum_complete', target: 1, current: 0 }
  },
  {
    id: 2,
    title: 'pH Master',
    description: 'Selesaikan 5 praktikum pH',
    icon: '🧪',
    category: 'mastery',
    unlocked: false,
    points: 50,
    color: 'from-blue-500 to-cyan-500',
    condition: { type: 'praktikum_count', target: 5, current: 0 }
  },
  {
    id: 3,
    title: 'Safety Expert',
    description: 'Selesaikan 10 praktikum tanpa warning keselamatan',
    icon: '🛡️',
    category: 'safety',
    unlocked: false,
    points: 75,
    color: 'from-orange-500 to-red-500',
    condition: { type: 'praktikum_count', target: 10, current: 0 }
  },
  {
    id: 4,
    title: 'Speed Runner',
    description: 'Selesaikan praktikum dalam waktu kurang dari 5 menit',
    icon: '⚡',
    category: 'special',
    unlocked: false,
    points: 30,
    color: 'from-yellow-500 to-orange-500',
    condition: { type: 'praktikum_complete', target: 1, current: 0 }
  },
  {
    id: 5,
    title: 'Perfect Balance',
    description: 'Dapatkan pH tepat 7.00 sebanyak 3 kali',
    icon: '⚖️',
    category: 'precision',
    unlocked: false,
    points: 40,
    color: 'from-purple-500 to-pink-500',
    condition: { type: 'perfect_ph', target: 3, current: 0 }
  },
  {
    id: 6,
    title: 'Chemistry Enthusiast',
    description: 'Selesaikan quiz dari 3 modul berbeda',
    icon: '🔬',
    category: 'mastery',
    unlocked: false,
    points: 60,
    color: 'from-indigo-500 to-purple-500',
    condition: { type: 'module_diversity', target: 3, current: 0 }
  },
  {
    id: 7,
    title: 'Night Owl',
    description: 'Selesaikan praktikum antara jam 10 malam - 2 pagi',
    icon: '🌙',
    category: 'special',
    unlocked: false,
    points: 20,
    color: 'from-blue-600 to-indigo-600',
    condition: { type: 'night_practice', target: 1, current: 0 }
  },
  {
    id: 8,
    title: 'Streak Master',
    description: 'Lakukan praktikum 7 hari berturut-turut',
    icon: '🔥',
    category: 'dedication',
    unlocked: false,
    points: 100,
    color: 'from-red-500 to-orange-500',
    condition: { type: 'streak_days', target: 7, current: 0 }
  },
  {
    id: 9,
    title: 'Quiz Champion',
    description: 'Dapatkan skor 100% pada quiz',
    icon: '🏆',
    category: 'mastery',
    unlocked: false,
    points: 200,
    color: 'from-yellow-400 to-yellow-600',
    condition: { type: 'quiz_score', target: 100, current: 0 }
  }
]

const DEFAULT_STATS: UserStats = {
  totalExperiments: 12,
  completedExperiments: 0,
  totalTime: 0,
  perfectScores: 0,
  level: 'Beginner',
  nextLevel: 'Intermediate',
  progress: 0,
  streakDays: 0,
  modulesDone: [],
  perfectPHCount: 0,
  quizScores: []
}

// LocalStorage keys
const ACHIEVEMENTS_KEY = 'cherity_achievements'
const STATS_KEY = 'cherity_user_stats'

// Get achievements from localStorage
export function getAchievements(): Achievement[] {
  if (typeof window === 'undefined') return DEFAULT_ACHIEVEMENTS
  
  const stored = localStorage.getItem(ACHIEVEMENTS_KEY)
  if (!stored) {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(DEFAULT_ACHIEVEMENTS))
    return DEFAULT_ACHIEVEMENTS
  }
  return JSON.parse(stored)
}

// Get user stats from localStorage
export function getUserStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_STATS
  
  const stored = localStorage.getItem(STATS_KEY)
  if (!stored) {
    localStorage.setItem(STATS_KEY, JSON.stringify(DEFAULT_STATS))
    return DEFAULT_STATS
  }
  return JSON.parse(stored)
}

// Save achievements to localStorage
export function saveAchievements(achievements: Achievement[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements))
}

// Save user stats to localStorage
export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STATS_KEY, JSON.stringify(stats))
}

// Check and unlock achievements based on stats
export function checkAndUnlockAchievements(stats: UserStats): Achievement[] {
  const achievements = getAchievements()
  let updated = false

  achievements.forEach(achievement => {
    if (achievement.unlocked) return

    let shouldUnlock = false
    let progress = 0

    switch (achievement.condition.type) {
      case 'praktikum_complete':
        progress = stats.completedExperiments
        achievement.condition.current = progress
        if (progress >= (achievement.condition.target || 1)) {
          shouldUnlock = true
        }
        break

      case 'praktikum_count':
        progress = stats.completedExperiments
        achievement.condition.current = progress
        achievement.progress = Math.min(100, (progress / (achievement.condition.target || 1)) * 100)
        if (progress >= (achievement.condition.target || 1)) {
          shouldUnlock = true
        }
        break

      case 'quiz_score':
        const perfectQuizzes = stats.quizScores.filter(q => q.score === 100).length
        progress = perfectQuizzes > 0 ? 100 : 0
        achievement.condition.current = perfectQuizzes
        if (perfectQuizzes > 0) {
          shouldUnlock = true
        }
        break

      case 'perfect_ph':
        progress = stats.perfectPHCount
        achievement.condition.current = progress
        achievement.progress = Math.min(100, (progress / (achievement.condition.target || 3)) * 100)
        if (progress >= (achievement.condition.target || 3)) {
          shouldUnlock = true
        }
        break

      case 'streak_days':
        progress = stats.streakDays
        achievement.condition.current = progress
        achievement.progress = Math.min(100, (progress / (achievement.condition.target || 7)) * 100)
        if (progress >= (achievement.condition.target || 7)) {
          shouldUnlock = true
        }
        break

      case 'module_diversity':
        progress = stats.modulesDone.length
        achievement.condition.current = progress
        achievement.progress = Math.min(100, (progress / (achievement.condition.target || 3)) * 100)
        if (progress >= (achievement.condition.target || 3)) {
          shouldUnlock = true
        }
        break

      case 'night_practice':
        // Will be checked during praktikum completion
        break
    }

    if (shouldUnlock && !achievement.unlocked) {
      achievement.unlocked = true
      achievement.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      updated = true
    }
  })

  if (updated) {
    saveAchievements(achievements)
  }

  return achievements
}

// Track quiz completion
export function trackQuizCompletion(moduleId: string, score: number, totalQuestions: number): void {
  const stats = getUserStats()
  const percentage = Math.round((score / totalQuestions) * 100)
  
  stats.quizScores.push({
    moduleId,
    score: percentage,
    date: new Date().toISOString()
  })

  // Add to modules done
  if (!stats.modulesDone.includes(moduleId)) {
    stats.modulesDone.push(moduleId)
  }

  if (percentage === 100) {
    stats.perfectScores++
  }

  updateLevel(stats)
  saveUserStats(stats)
  checkAndUnlockAchievements(stats)
}

// Track praktikum completion
export function trackPraktikumCompletion(duration: number, isPerfectPH: boolean = false): void {
  const stats = getUserStats()
  
  stats.completedExperiments++
  stats.totalTime += duration

  if (isPerfectPH) {
    stats.perfectPHCount++
  }

  // Check if night practice (10 PM - 2 AM)
  const hour = new Date().getHours()
  if (hour >= 22 || hour <= 2) {
    const achievements = getAchievements()
    const nightOwl = achievements.find(a => a.id === 7)
    if (nightOwl && !nightOwl.unlocked) {
      nightOwl.unlocked = true
      nightOwl.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      saveAchievements(achievements)
    }
  }

  // Update streak
  updateStreak(stats)
  updateLevel(stats)
  saveUserStats(stats)
  checkAndUnlockAchievements(stats)
}

// Update streak days
function updateStreak(stats: UserStats): void {
  const today = new Date().toDateString()
  
  if (stats.lastPracticeDate) {
    const lastDate = new Date(stats.lastPracticeDate)
    const daysDiff = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff === 1) {
      stats.streakDays++
    } else if (daysDiff > 1) {
      stats.streakDays = 1
    }
  } else {
    stats.streakDays = 1
  }
  
  stats.lastPracticeDate = today
}

// Update user level based on progress
function updateLevel(stats: UserStats): void {
  const totalPoints = stats.completedExperiments * 10 + stats.perfectScores * 20
  
  if (totalPoints >= 200) {
    stats.level = 'Expert'
    stats.nextLevel = 'Master'
    stats.progress = Math.min(100, ((totalPoints - 200) / 100) * 100)
  } else if (totalPoints >= 100) {
    stats.level = 'Intermediate'
    stats.nextLevel = 'Expert'
    stats.progress = ((totalPoints - 100) / 100) * 100
  } else {
    stats.level = 'Beginner'
    stats.nextLevel = 'Intermediate'
    stats.progress = (totalPoints / 100) * 100
  }
}

// Format time
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

// Reset all achievements (for testing)
export function resetAchievements(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(DEFAULT_ACHIEVEMENTS))
  localStorage.setItem(STATS_KEY, JSON.stringify(DEFAULT_STATS))
}
