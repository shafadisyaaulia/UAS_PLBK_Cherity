'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { CheckCircle, XCircle, Clock, Award, RefreshCw, ChevronRight, Sparkles } from 'lucide-react'
import { trackQuizCompletion } from '@/lib/achievementSystem'

export default function QuizPage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [newAchievements, setNewAchievements] = useState<string[]>([])

  const modules = [
    {
      id: 'asam-basa',
      title: 'Asam & Basa',
      icon: '🧪',
      description: 'Uji pemahaman tentang sifat asam basa, pH, dan indikator',
      questionCount: 10,
      difficulty: 'Beginner'
    },
    {
      id: 'garam',
      title: 'Garam & Hidrolisis',
      icon: '⚗️',
      description: 'Soal tentang pembentukan garam dan reaksi hidrolisis',
      questionCount: 8,
      difficulty: 'Intermediate'
    },
    {
      id: 'reaksi-kimia',
      title: 'Reaksi Kimia',
      icon: '⚡',
      description: 'Pertanyaan seputar jenis reaksi dan persamaan kimia',
      questionCount: 10,
      difficulty: 'Intermediate'
    },
    {
      id: 'stoikiometri',
      title: 'Stoikiometri',
      icon: '⚖️',
      description: 'Hitung mol, massa, dan volume dalam reaksi kimia',
      questionCount: 12,
      difficulty: 'Advanced'
    }
  ]

  const quizData: { [key: string]: any[] } = {
    'asam-basa': [
      {
        question: 'Larutan dengan pH 3 termasuk larutan...',
        options: ['Asam kuat', 'Asam lemah', 'Basa kuat', 'Netral'],
        correct: 0
      },
      {
        question: 'Indikator fenolftalein (PP) akan berwarna merah muda dalam larutan...',
        options: ['Asam', 'Netral', 'Basa', 'Garam'],
        correct: 2
      },
      {
        question: 'Larutan dengan [H+] = 1 × 10⁻⁵ M memiliki pH sebesar...',
        options: ['3', '5', '7', '9'],
        correct: 1
      },
      {
        question: 'Contoh asam kuat adalah...',
        options: ['CH₃COOH', 'HCl', 'NH₃', 'NaOH'],
        correct: 1
      },
      {
        question: 'Jika pH suatu larutan = 11, maka pOH larutan tersebut adalah...',
        options: ['3', '11', '14', '7'],
        correct: 0
      },
      {
        question: 'Larutan penyangga (buffer) terdiri dari...',
        options: ['Asam kuat + basa kuat', 'Asam lemah + garamnya', 'Basa kuat + garam', 'Air murni'],
        correct: 1
      },
      {
        question: 'Indikator universal menunjukkan warna hijau pada pH...',
        options: ['3', '7', '11', '14'],
        correct: 1
      },
      {
        question: 'Rumus kimia asam sulfat adalah...',
        options: ['HCl', 'HNO₃', 'H₂SO₄', 'H₃PO₄'],
        correct: 2
      },
      {
        question: 'Basa kuat yang sering digunakan dalam laboratorium adalah...',
        options: ['NH₃', 'Ca(OH)₂', 'NaOH', 'Al(OH)₃'],
        correct: 2
      },
      {
        question: 'Air murni memiliki pH...',
        options: ['0', '7', '14', '1'],
        correct: 1
      }
    ],
    'garam': [
      {
        question: 'Garam yang berasal dari asam kuat dan basa kuat bersifat...',
        options: ['Asam', 'Basa', 'Netral', 'Amfoter'],
        correct: 2
      },
      {
        question: 'CH₃COONa mengalami hidrolisis dan menghasilkan larutan yang bersifat...',
        options: ['Asam', 'Basa', 'Netral', 'Tidak dapat ditentukan'],
        correct: 1
      },
      {
        question: 'Garam NH₄Cl dalam air akan...',
        options: ['Bersifat basa', 'Bersifat asam', 'Bersifat netral', 'Tidak larut'],
        correct: 1
      },
      {
        question: 'Reaksi netralisasi adalah reaksi antara...',
        options: ['Asam + air', 'Basa + garam', 'Asam + basa', 'Logam + asam'],
        correct: 2
      },
      {
        question: 'Garam yang terhidrolisis total adalah garam dari...',
        options: ['Asam kuat + basa kuat', 'Asam lemah + basa lemah', 'Asam kuat + basa lemah', 'Asam lemah + basa kuat'],
        correct: 1
      },
      {
        question: 'Contoh garam yang tidak terhidrolisis adalah...',
        options: ['CH₃COONa', 'NH₄Cl', 'NaCl', 'NH₄CN'],
        correct: 2
      },
      {
        question: 'pH garam NaCN dalam air akan...',
        options: ['< 7', '= 7', '> 7', 'Tidak dapat ditentukan'],
        correct: 2
      },
      {
        question: 'Hidrolisis adalah reaksi antara garam dengan...',
        options: ['Asam', 'Basa', 'Air', 'Udara'],
        correct: 2
      }
    ],
    'reaksi-kimia': [
      {
        question: 'Reaksi 2H₂ + O₂ → 2H₂O termasuk reaksi...',
        options: ['Dekomposisi', 'Sintesis', 'Substitusi', 'Redoks parsial'],
        correct: 1
      },
      {
        question: 'Dalam reaksi redoks, zat yang melepas elektron disebut...',
        options: ['Reduktor', 'Oksidator', 'Katalis', 'Inhibitor'],
        correct: 0
      },
      {
        question: 'CaCO₃ → CaO + CO₂ merupakan contoh reaksi...',
        options: ['Sintesis', 'Dekomposisi', 'Redoks', 'Netralisasi'],
        correct: 1
      },
      {
        question: 'Reaksi yang melepas kalor disebut...',
        options: ['Endoterm', 'Eksoterm', 'Isoterm', 'Adiabatik'],
        correct: 1
      },
      {
        question: 'Katalis berfungsi untuk...',
        options: ['Memperlambat reaksi', 'Mempercepat reaksi', 'Menghentikan reaksi', 'Mengubah produk'],
        correct: 1
      },
      {
        question: 'Bilangan oksidasi O dalam H₂O adalah...',
        options: ['+2', '-2', '0', '+1'],
        correct: 1
      },
      {
        question: 'Reaksi pembakaran adalah contoh reaksi...',
        options: ['Endoterm', 'Eksoterm', 'Reversibel', 'Fotokimia'],
        correct: 1
      },
      {
        question: 'Persamaan reaksi setara harus memenuhi hukum...',
        options: ['Hukum Boyle', 'Hukum Lavoisier', 'Hukum Avogadro', 'Hukum Henry'],
        correct: 1
      },
      {
        question: 'Zn + 2HCl → ZnCl₂ + H₂ merupakan reaksi...',
        options: ['Netralisasi', 'Substitusi tunggal', 'Dekomposisi', 'Sintesis'],
        correct: 1
      },
      {
        question: 'Reaksi yang dapat berbalik arah disebut reaksi...',
        options: ['Irreversibel', 'Reversibel', 'Eksoterm', 'Endoterm'],
        correct: 1
      }
    ],
    'stoikiometri': [
      {
        question: 'Massa molar NaCl (Ar Na=23, Cl=35,5) adalah...',
        options: ['58,5 g/mol', '46 g/mol', '40 g/mol', '62 g/mol'],
        correct: 0
      },
      {
        question: 'Jumlah mol dalam 18 gram air (Mr H₂O = 18) adalah...',
        options: ['0,5 mol', '1 mol', '2 mol', '18 mol'],
        correct: 1
      },
      {
        question: 'Volume 0,5 mol gas pada STP (0°C, 1 atm) adalah...',
        options: ['11,2 L', '22,4 L', '5,6 L', '44,8 L'],
        correct: 0
      },
      {
        question: 'Dalam reaksi N₂ + 3H₂ → 2NH₃, perbandingan koefisien adalah...',
        options: ['1:3:2', '2:3:1', '1:1:1', '3:1:2'],
        correct: 0
      },
      {
        question: 'Konsentrasi larutan yang mengandung 20 gram NaOH (Mr=40) dalam 500 mL larutan adalah...',
        options: ['0,5 M', '1 M', '2 M', '4 M'],
        correct: 1
      },
      {
        question: 'Pereaksi pembatas adalah zat yang...',
        options: ['Jumlahnya paling banyak', 'Habis bereaksi terlebih dahulu', 'Tersisa setelah reaksi', 'Memiliki Mr terbesar'],
        correct: 1
      },
      {
        question: 'Rumus Mr (massa molekul relatif) adalah...',
        options: ['Jumlah Ar unsur-unsur', 'Massa / mol', 'Volume / mol', 'Mol × 22,4'],
        correct: 0
      },
      {
        question: 'Hukum Avogadro menyatakan bahwa pada suhu dan tekanan sama, gas dengan volume sama memiliki...',
        options: ['Massa sama', 'Mr sama', 'Jumlah mol sama', 'Densitas sama'],
        correct: 2
      },
      {
        question: 'Kadar kemurnian suatu zat dapat dihitung dengan rumus...',
        options: ['(massa murni/massa total) × 100%', '(mol/volume) × 100%', '(Mr/Ar) × 100%', '(volume/mol) × 100%'],
        correct: 0
      },
      {
        question: 'Dalam 1 mol zat terkandung ... partikel (bilangan Avogadro)',
        options: ['6,02 × 10²¹', '6,02 × 10²³', '6,02 × 10²⁴', '6,02 × 10²²'],
        correct: 1
      },
      {
        question: 'Untuk reaksi 2Al + 3Cl₂ → 2AlCl₃, jika 4 mol Al bereaksi maka Cl₂ yang diperlukan...',
        options: ['4 mol', '6 mol', '8 mol', '12 mol'],
        correct: 1
      },
      {
        question: 'Molaritas larutan yang dibuat dengan melarutkan 0,2 mol zat dalam 1 liter air adalah...',
        options: ['0,1 M', '0,2 M', '0,5 M', '1 M'],
        correct: 1
      }
    ]
  }

  const handleStartQuiz = (moduleId: string) => {
    setSelectedModule(moduleId)
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
    setStartTime(Date.now())
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: answerIndex })
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizData[selectedModule!].length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitQuiz = () => {
    if (!selectedModule) return
    
    const score = calculateScore()
    const questions = quizData[selectedModule]
    const totalQuestions = questions.length
    
    // Track quiz completion in achievement system
    trackQuizCompletion(selectedModule, score, totalQuestions)
    
    // Check for new achievements
    const percentage = Math.round((score / totalQuestions) * 100)
    const newUnlocks: string[] = []
    
    if (percentage === 100) {
      newUnlocks.push('Quiz Champion - Skor 100%! 🏆')
    }
    
    if (score >= totalQuestions * 0.8) {
      newUnlocks.push('Excellent Performance! 🌟')
    }
    
    setNewAchievements(newUnlocks)
    setShowResults(true)
  }

  const calculateScore = () => {
    if (!selectedModule) return 0
    const questions = quizData[selectedModule]
    let correct = 0
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) correct++
    })
    return correct
  }

  const getElapsedTime = () => {
    if (!startTime) return '0:00'
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    const minutes = Math.floor(elapsed / 60)
    const seconds = elapsed % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const resetQuiz = () => {
    setSelectedModule(null)
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
    setStartTime(null)
  }

  if (!selectedModule) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-b from-[#0B1120] via-[#1a1f35] to-[#0B1120] pt-32 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 glass-card border-cyan-400/30 px-4 py-2 mb-6">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="text-cyan-300 text-sm font-medium">Quiz Interaktif</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-4">
                Test Pemahaman
              </h1>
              <p className="text-cyan-100/60 text-lg max-w-2xl mx-auto">
                Pilih modul dan uji pemahaman kamu dengan soal pilihan ganda!
              </p>
            </div>

            {/* Module Selection Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="glass-panel border-cyan-400/30 p-6 hover:border-cyan-400/60 hover:scale-105 transition-all group cursor-pointer"
                  onClick={() => handleStartQuiz(module.id)}
                >
                  <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform">
                    {module.icon}
                  </div>
                  <h3 className="text-xl font-bold text-cyan-100 mb-2 text-center">
                    {module.title}
                  </h3>
                  <p className="text-cyan-100/60 text-sm mb-4 text-center">
                    {module.description}
                  </p>
                  <div className="flex justify-between items-center text-xs mb-4">
                    <span className={`px-3 py-1 rounded-full font-semibold ${
                      module.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                      module.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {module.difficulty}
                    </span>
                    <span className="text-cyan-400">{module.questionCount} soal</span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 rounded-lg glow-cyan hover:scale-105 transition-all">
                    Mulai Quiz
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  const questions = quizData[selectedModule]
  const currentQ = questions[currentQuestion]
  const totalQuestions = questions.length
  const answeredCount = Object.keys(selectedAnswers).length

  if (showResults) {
    const score = calculateScore()
    const percentage = Math.round((score / totalQuestions) * 100)
    
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-b from-[#0B1120] via-[#1a1f35] to-[#0B1120] pt-32 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Results Card */}
            <div className="glass-panel border-cyan-400/30 p-8 text-center">
              <div className="text-6xl mb-6">
                {percentage >= 80 ? '🏆' : percentage >= 60 ? '🎉' : '📚'}
              </div>
              <h2 className="text-4xl font-bold text-cyan-100 mb-2">
                {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good Job!' : 'Keep Learning!'}
              </h2>
              <p className="text-cyan-100/60 mb-4">
                Quiz selesai! Berikut hasil kamu:
              </p>
              
              {/* New Achievements Unlocked */}
              {newAchievements.length > 0 && (
                <div className="mb-6 glass-card border-yellow-400/30 p-4 bg-yellow-500/10">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-bold">Achievement Unlocked!</span>
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                  </div>
                  {newAchievements.map((ach, idx) => (
                    <p key={idx} className="text-cyan-100 text-sm">{ach}</p>
                  ))}
                </div>
              )}

              {/* Score Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="glass-card border-cyan-400/20 p-4">
                  <div className="text-3xl font-bold text-cyan-400">{score}/{totalQuestions}</div>
                  <div className="text-cyan-100/60 text-sm">Benar</div>
                </div>
                <div className="glass-card border-cyan-400/20 p-4">
                  <div className="text-3xl font-bold text-green-400">{percentage}%</div>
                  <div className="text-cyan-100/60 text-sm">Skor</div>
                </div>
                <div className="glass-card border-cyan-400/20 p-4">
                  <div className="text-3xl font-bold text-yellow-400">{getElapsedTime()}</div>
                  <div className="text-cyan-100/60 text-sm">Waktu</div>
                </div>
              </div>

              {/* Answer Review */}
              <div className="text-left mb-8 space-y-4 max-h-96 overflow-y-auto">
                {questions.map((q, idx) => {
                  const isCorrect = selectedAnswers[idx] === q.correct
                  return (
                    <div key={idx} className={`glass-card p-4 border-2 ${
                      isCorrect ? 'border-green-400/30' : 'border-red-400/30'
                    }`}>
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="text-cyan-100 font-semibold mb-2">{idx + 1}. {q.question}</p>
                          <div className="text-sm">
                            <p className={`${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                              Jawaban kamu: {q.options[selectedAnswers[idx]] || 'Tidak dijawab'}
                            </p>
                            {!isCorrect && (
                              <p className="text-green-400">
                                Jawaban benar: {q.options[q.correct]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetQuiz}
                  className="flex items-center gap-2 glass-card border-cyan-400/30 px-6 py-3 rounded-xl hover:bg-cyan-500/20 transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span className="text-cyan-100 font-semibold">Pilih Quiz Lain</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentQuestion(0)
                    setSelectedAnswers({})
                    setShowResults(false)
                    setStartTime(Date.now())
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-xl text-white font-bold glow-cyan hover:scale-105 transition-all"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-[#0B1120] via-[#1a1f35] to-[#0B1120] pt-32 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Stats */}
          <div className="flex items-center justify-between mb-8">
            <div className="glass-card border-cyan-400/30 px-4 py-2">
              <span className="text-cyan-400 font-semibold">
                {modules.find(m => m.id === selectedModule)?.title}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="glass-card border-cyan-400/30 px-4 py-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-100 font-semibold">{getElapsedTime()}</span>
              </div>
              <div className="glass-card border-cyan-400/30 px-4 py-2">
                <span className="text-cyan-100 font-semibold">
                  {currentQuestion + 1} / {totalQuestions}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="glass-panel border-cyan-400/30 p-4 mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-cyan-100/60 text-sm">Progress</span>
              <span className="text-cyan-400 font-semibold text-sm">
                {answeredCount}/{totalQuestions} dijawab
              </span>
            </div>
            <div className="relative w-full h-3 bg-cyan-950/50 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="glass-panel border-cyan-400/30 p-8 mb-6">
            <h3 className="text-2xl font-bold text-cyan-100 mb-6">
              {currentQ.question}
            </h3>
            
            <div className="space-y-3">
              {currentQ.options.map((option: string, idx: number) => {
                const isSelected = selectedAnswers[currentQuestion] === idx
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(currentQuestion, idx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 glow-cyan'
                        : 'glass-card border-cyan-400/20 hover:border-cyan-400/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-cyan-400/40'
                      }`}>
                        {isSelected && <div className="w-3 h-3 rounded-full bg-white" />}
                      </div>
                      <span className="text-cyan-100 font-medium">{option}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="glass-card border-cyan-400/30 px-6 py-3 rounded-xl hover:bg-cyan-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="text-cyan-100 font-semibold">← Sebelumnya</span>
            </button>

            {currentQuestion === totalQuestions - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-3 rounded-xl text-white font-bold glow-cyan hover:scale-105 transition-all"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-xl text-white font-bold glow-cyan hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
