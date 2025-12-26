export interface ExperimentStep {
  chemical_id: string
  volume: number
  molarity: number
  description: string
  instruction?: string  // Optional instruction for guided mode
}

export interface Experiment {
  id: string
  name: string
  category: string
  difficulty: 'basic' | 'intermediate' | 'advanced'
  description: string
  objective: string
  theory: string
  steps: ExperimentStep[]
  expectedResult: {
    phRange: [number, number]
    color: string
    observation: string
  }
  safetyNotes: string[]
  duration: string // in minutes
  icon: string
}

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'netralisasi',
    name: 'Netralisasi Asam-Basa',
    category: 'Acid-Base',
    difficulty: 'basic',
    description: 'Mempelajari reaksi netralisasi antara asam kuat dan basa kuat',
    objective: 'Memahami konsep netralisasi dan mencapai pH netral (7)',
    theory: 'Netralisasi adalah reaksi antara asam dan basa yang menghasilkan garam dan air. HCl + NaOH → NaCl + H2O',
    steps: [
      {
        chemical_id: 'HCl',
        volume: 20,
        molarity: 1.0,
        description: 'Tambahkan 20mL HCl 1M sebagai asam kuat',
        instruction: 'Add 20mL of HCl 1M as the strong acid'
      },
      {
        chemical_id: 'NaOH',
        volume: 20,
        molarity: 1.0,
        description: 'Tambahkan 20mL NaOH 1M untuk menetralisir',
        instruction: 'Add 20mL of NaOH 1M to neutralize the acid'
      }
    ],
    expectedResult: {
      phRange: [6.5, 7.5],
      color: 'Bening/tidak berwarna',
      observation: 'Larutan menjadi netral, suhu meningkat (eksoterm)'
    },
    safetyNotes: [
      'Gunakan sarung tangan',
      'Jangan menyentuh larutan asam/basa',
      'Reaksi bersifat eksoterm (mengeluarkan panas)'
    ],
    duration: '5',
    icon: '⚖️'
  },
  {
    id: 'titrasi-asam-basa',
    name: 'Titrasi Asam-Basa',
    category: 'Acid-Base',
    difficulty: 'intermediate',
    description: 'Menentukan konsentrasi larutan dengan titrasi',
    objective: 'Menentukan konsentrasi HCl dengan titrasi menggunakan NaOH',
    theory: 'Titrasi adalah metode analisis volumetrik untuk menentukan konsentrasi zat dengan reaksi netralisasi',
    steps: [
      {
        chemical_id: 'HCl',
        volume: 25,
        molarity: 1.0,
        description: 'Sampel HCl 25mL yang akan dititrasi'
      },
      {
        chemical_id: 'NaOH',
        volume: 5,
        molarity: 1.0,
        description: 'Teteskan NaOH sedikit demi sedikit'
      },
      {
        chemical_id: 'NaOH',
        volume: 5,
        molarity: 1.0,
        description: 'Lanjutkan sampai pH mendekati 7'
      }
    ],
    expectedResult: {
      phRange: [6.8, 7.2],
      color: 'Perubahan warna indikator',
      observation: 'Titik ekuivalen tercapai saat pH = 7'
    },
    safetyNotes: [
      'Teteskan titran perlahan',
      'Catat volume tepat saat perubahan warna',
      'Gunakan indikator fenolftalein'
    ],
    duration: '10',
    icon: '💧'
  },
  {
    id: 'indikator-ph',
    name: 'Uji Indikator pH Alami',
    category: 'Acid-Base',
    difficulty: 'basic',
    description: 'Menguji berbagai larutan dengan indikator pH',
    objective: 'Mengidentifikasi sifat asam/basa berbagai larutan',
    theory: 'Indikator pH adalah zat yang berubah warna tergantung pH larutan',
    steps: [
      {
        chemical_id: 'HCl',
        volume: 10,
        molarity: 1.0,
        description: 'Test larutan asam kuat'
      },
      {
        chemical_id: 'H2SO4',
        volume: 10,
        molarity: 1.0,
        description: 'Test asam sulfat'
      },
      {
        chemical_id: 'NaOH',
        volume: 10,
        molarity: 1.0,
        description: 'Test basa kuat'
      },
      {
        chemical_id: 'NH3',
        volume: 10,
        molarity: 1.0,
        description: 'Test basa lemah'
      }
    ],
    expectedResult: {
      phRange: [0, 14],
      color: 'Berbagai warna sesuai pH',
      observation: 'Merah = asam, Biru = basa, Hijau = netral'
    },
    safetyNotes: [
      'Jangan mencampur semua larutan sekaligus',
      'Reset antar percobaan',
      'Catat perubahan warna'
    ],
    duration: '15',
    icon: '🌈'
  },
  {
    id: 'buffer-solution',
    name: 'Larutan Penyangga (Buffer)',
    category: 'Acid-Base',
    difficulty: 'advanced',
    description: 'Membuat dan menguji larutan penyangga',
    objective: 'Memahami sistem buffer yang menahan perubahan pH',
    theory: 'Buffer adalah larutan yang dapat mempertahankan pH relatif konstan ketika ditambahkan asam atau basa',
    steps: [
      {
        chemical_id: 'NH3',
        volume: 30,
        molarity: 1.0,
        description: 'Basa lemah NH3'
      },
      {
        chemical_id: 'HCl',
        volume: 15,
        molarity: 1.0,
        description: 'Tambahkan HCl untuk membentuk garam NH4Cl'
      }
    ],
    expectedResult: {
      phRange: [9, 10],
      color: 'Bening',
      observation: 'pH stabil meski ditambah asam/basa sedikit'
    },
    safetyNotes: [
      'Perhatikan rasio asam:basa',
      'Buffer efektif pada pH = pKa ± 1',
      'Uji dengan menambah asam/basa sedikit'
    ],
    duration: '12',
    icon: '🛡️'
  },
  {
    id: 'hidrolisis-garam',
    name: 'Hidrolisis Garam',
    category: 'Acid-Base',
    difficulty: 'intermediate',
    description: 'Mempelajari sifat asam/basa dari larutan garam',
    objective: 'Memahami hidrolisis dan pH larutan garam',
    theory: 'Garam dari asam lemah atau basa lemah dapat terhidrolisis dalam air mengubah pH',
    steps: [
      {
        chemical_id: 'NaCl',
        volume: 30,
        molarity: 1.0,
        description: 'Garam dari asam kuat dan basa kuat (pH netral)'
      }
    ],
    expectedResult: {
      phRange: [6.8, 7.2],
      color: 'Bening',
      observation: 'NaCl tidak terhidrolisis, pH tetap netral'
    },
    safetyNotes: [
      'Bandingkan dengan garam lain',
      'Catat pH setiap garam',
      'Pahami konsep asam/basa konjugat'
    ],
    duration: '8',
    icon: '🧂'
  },
  {
    id: 'strong-acid-mix',
    name: 'Pencampuran Asam Kuat',
    category: 'Acid-Base',
    difficulty: 'basic',
    description: 'Mempelajari efek mencampur berbagai asam kuat',
    objective: 'Memahami sifat asam kuat dan perhitungan pH campuran',
    theory: 'Asam kuat terionisasi sempurna dalam air. pH campuran tergantung total H+',
    steps: [
      {
        chemical_id: 'HCl',
        volume: 15,
        molarity: 1.0,
        description: 'Asam klorida'
      },
      {
        chemical_id: 'H2SO4',
        volume: 15,
        molarity: 1.0,
        description: 'Asam sulfat (2 H+ per molekul)'
      }
    ],
    expectedResult: {
      phRange: [0, 1],
      color: 'Bening',
      observation: 'pH sangat rendah, larutan sangat asam'
    },
    safetyNotes: [
      'SANGAT KOROSIF!',
      'Jangan mencampurkan terlalu banyak',
      'Hindari kontak dengan kulit',
      'Reaksi dapat menghasilkan panas'
    ],
    duration: '5',
    icon: '⚠️'
  },
  {
    id: 'dilution',
    name: 'Pengenceran Larutan',
    category: 'General',
    difficulty: 'basic',
    description: 'Mempelajari konsep pengenceran dan perhitungan M1V1=M2V2',
    objective: 'Memahami pengenceran dan pengaruhnya terhadap pH',
    theory: 'Pengenceran mengurangi konsentrasi tanpa mengubah jumlah mol zat terlarut',
    steps: [
      {
        chemical_id: 'HCl',
        volume: 10,
        molarity: 1.0,
        description: 'Larutan HCl pekat'
      },
      {
        chemical_id: 'NaCl',
        volume: 40,
        molarity: 0.1,
        description: 'Tambahkan "air" (simulasi dengan garam netral)'
      }
    ],
    expectedResult: {
      phRange: [1, 2],
      color: 'Bening lebih pucat',
      observation: 'pH meningkat (kurang asam) setelah diencerkan'
    },
    safetyNotes: [
      'Selalu tambahkan asam ke air, bukan sebaliknya',
      'Gunakan rumus M1V1 = M2V2',
      'Catat volume sebelum dan sesudah'
    ],
    duration: '6',
    icon: '💧'
  }
]

export function getExperimentById(id: string): Experiment | undefined {
  return EXPERIMENTS.find(exp => exp.id === id)
}

export function getExperimentsByCategory(category: string): Experiment[] {
  return EXPERIMENTS.filter(exp => exp.category === category)
}

export function getExperimentsByDifficulty(difficulty: 'basic' | 'intermediate' | 'advanced'): Experiment[] {
  return EXPERIMENTS.filter(exp => exp.difficulty === difficulty)
}
