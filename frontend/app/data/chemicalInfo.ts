export interface ChemicalDetail {
  id: string
  name: string
  fullName: string
  formula: string
  molecularWeight: number
  pH: number
  type: 'strong_acid' | 'weak_acid' | 'strong_base' | 'weak_base' | 'neutral_salt'
  color: string
  state: 'liquid' | 'solid' | 'gas' | 'aqueous'
  description: string
  properties: string[]
  uses: string[]
  safetyInfo: {
    hazards: string[]
    handling: string[]
    firstAid: string[]
    disposal: string[]
  }
  reactions: {
    with: string
    produces: string
    type: 'exothermic' | 'endothermic' | 'neutral'
  }[]
}

export const CHEMICAL_DATABASE: Record<string, ChemicalDetail> = {
  'HCl': {
    id: 'HCl',
    name: 'HCl',
    fullName: 'Hydrochloric Acid',
    formula: 'HCl',
    molecularWeight: 36.46,
    pH: 0.5,
    type: 'strong_acid',
    color: 'Bening/tidak berwarna',
    state: 'aqueous',
    description: 'Asam klorida adalah asam kuat yang terionisasi sempurna dalam air. Merupakan komponen utama asam lambung.',
    properties: [
      'Asam kuat monoprotik',
      'Terionisasi 100% dalam air',
      'Sangat korosif',
      'Mudah larut dalam air',
      'Menghasilkan gas HCl pada konsentrasi tinggi'
    ],
    uses: [
      'Pembersih logam dan besi',
      'Produksi pupuk dan pewarna',
      'Pengolahan makanan',
      'Produksi PVC',
      'Asam lambung (HCl 0.5%)'
    ],
    safetyInfo: {
      hazards: [
        'Sangat korosif terhadap kulit dan mata',
        'Dapat menyebabkan luka bakar kimia',
        'Uap dapat mengiritasi saluran pernapasan',
        'Bereaksi hebat dengan basa dan logam'
      ],
      handling: [
        'Gunakan sarung tangan dan kacamata pelindung',
        'Gunakan di area berventilasi baik',
        'Jangan menghirup uap',
        'Simpan dalam wadah tahan asam'
      ],
      firstAid: [
        'Kulit: Bilas dengan air mengalir 15 menit',
        'Mata: Bilas dengan air 15 menit, segera ke dokter',
        'Tertelan: Jangan dimuntahkan, minum air, ke dokter',
        'Terhirup: Pindah ke udara segar'
      ],
      disposal: [
        'Netralisir dengan basa sebelum dibuang',
        'Encerkan dengan air dalam jumlah besar',
        'Ikuti regulasi pembuangan limbah B3'
      ]
    },
    reactions: [
      {
        with: 'NaOH',
        produces: 'NaCl + H2O (Garam + Air)',
        type: 'exothermic'
      },
      {
        with: 'KOH',
        produces: 'KCl + H2O',
        type: 'exothermic'
      },
      {
        with: 'NH3',
        produces: 'NH4Cl (Amonium Klorida)',
        type: 'exothermic'
      }
    ]
  },
  'NaOH': {
    id: 'NaOH',
    name: 'NaOH',
    fullName: 'Sodium Hydroxide (Caustic Soda)',
    formula: 'NaOH',
    molecularWeight: 40.0,
    pH: 14,
    type: 'strong_base',
    color: 'Bening',
    state: 'aqueous',
    description: 'Natrium hidroksida adalah basa kuat yang sangat korosif. Dikenal sebagai soda kaustik.',
    properties: [
      'Basa kuat yang terdisosiasi sempurna',
      'Sangat higroskopis (menyerap air)',
      'Sangat korosif',
      'Larut dalam air dengan reaksi eksoterm',
      'pH sangat tinggi (>13)'
    ],
    uses: [
      'Pembuatan sabun dan deterjen',
      'Pengolahan kertas (pulp)',
      'Pembersih saluran pipa',
      'Produksi biodiesel',
      'Pengatur pH dalam industri'
    ],
    safetyInfo: {
      hazards: [
        'Sangat korosif, dapat merusak jaringan',
        'Panas saat dilarutkan dalam air',
        'Dapat menyebabkan kebutaan jika kena mata',
        'Bereaksi hebat dengan asam dan logam tertentu'
      ],
      handling: [
        'WAJIB gunakan sarung tangan dan kacamata',
        'Tambahkan NaOH ke air, JANGAN sebaliknya',
        'Jangan sentuh dengan tangan telanjang',
        'Simpan dalam wadah kedap udara'
      ],
      firstAid: [
        'Kulit: Bilas segera dengan air banyak',
        'Mata: Bilas 20 menit, SEGERA ke dokter',
        'Tertelan: Minum air/susu, JANGAN muntah',
        'Terhirup: Udara segar, bantuan medis'
      ],
      disposal: [
        'Netralisir dengan asam lemah (cuka)',
        'Encerkan bertahap',
        'Jangan buang ke lingkungan langsung'
      ]
    },
    reactions: [
      {
        with: 'HCl',
        produces: 'NaCl + H2O (Netralisasi)',
        type: 'exothermic'
      },
      {
        with: 'H2SO4',
        produces: 'Na2SO4 + H2O',
        type: 'exothermic'
      }
    ]
  },
  'H2SO4': {
    id: 'H2SO4',
    name: 'H2SO4',
    fullName: 'Sulfuric Acid',
    formula: 'H2SO4',
    molecularWeight: 98.08,
    pH: 0.3,
    type: 'strong_acid',
    color: 'Bening/tidak berwarna',
    state: 'aqueous',
    description: 'Asam sulfat adalah asam kuat diprotik yang sangat penting dalam industri kimia.',
    properties: [
      'Asam kuat diprotik (2 H+)',
      'Sangat korosif dan higroskopis',
      'Oksidator kuat',
      'Dehidrator kuat',
      'Kental dan berminyak (konsentrasi tinggi)'
    ],
    uses: [
      'Produksi pupuk fosfat',
      'Aki/baterai mobil',
      'Pengolahan logam',
      'Produksi deterjen',
      'Sintesis kimia organik'
    ],
    safetyInfo: {
      hazards: [
        'SANGAT BERBAHAYA - korosif ekstrem',
        'Bereaksi hebat dengan air (eksoterm)',
        'Dapat meledak jika tercampur organik',
        'Uap sangat korosif'
      ],
      handling: [
        'Gunakan APD lengkap',
        'SELALU tambahkan asam ke air',
        'Gunakan wadah tahan asam',
        'Hindari kontak dengan logam, karbon, air'
      ],
      firstAid: [
        'Kulit: Bilas 30 menit, lepas pakaian terkontaminasi',
        'Mata: Bilas 30 menit terus menerus',
        'Tertelan: SEGERA ke RS, jangan muntah',
        'SEMUA KASUS: Segera bantuan medis!'
      ],
      disposal: [
        'Netralisir dengan Ca(OH)2 atau Na2CO3',
        'Encerkan sangat hati-hati',
        'Harus ditangani profesional'
      ]
    },
    reactions: [
      {
        with: 'NaOH',
        produces: 'Na2SO4 + H2O',
        type: 'exothermic'
      },
      {
        with: 'KOH',
        produces: 'K2SO4 + H2O',
        type: 'exothermic'
      }
    ]
  },
  'KOH': {
    id: 'KOH',
    name: 'KOH',
    fullName: 'Potassium Hydroxide',
    formula: 'KOH',
    molecularWeight: 56.11,
    pH: 13.5,
    type: 'strong_base',
    color: 'Bening',
    state: 'aqueous',
    description: 'Kalium hidroksida adalah basa kuat yang lebih reaktif daripada NaOH.',
    properties: [
      'Basa kuat yang sangat korosif',
      'Lebih higroskopis dari NaOH',
      'Larut dalam air dengan panas',
      'Bereaksi dengan CO2 di udara',
      'Konduktivitas listrik tinggi'
    ],
    uses: [
      'Pembuatan sabun lunak (soft soap)',
      'Elektrolit baterai alkalin',
      'Produksi biodiesel',
      'Pembersih industri',
      'Sintesis senyawa organik'
    ],
    safetyInfo: {
      hazards: [
        'Sangat korosif seperti NaOH',
        'Lebih reaktif dari NaOH',
        'Menyerap kelembaban udara',
        'Bereaksi dengan kulit membentuk sabun'
      ],
      handling: [
        'APD lengkap wajib',
        'Simpan kedap udara',
        'Jangan sentuh langsung',
        'Larutkan dalam air dingin perlahan'
      ],
      firstAid: [
        'Sama dengan NaOH',
        'Bilas segera dan lama',
        'Bantuan medis segera',
        'Jangan gunakan asam untuk netralisir di tubuh'
      ],
      disposal: [
        'Netralisir dengan asam lemah',
        'Encerkan bertahap',
        'Ikuti prosedur limbah B3'
      ]
    },
    reactions: [
      {
        with: 'HCl',
        produces: 'KCl + H2O',
        type: 'exothermic'
      },
      {
        with: 'H2SO4',
        produces: 'K2SO4 + H2O',
        type: 'exothermic'
      }
    ]
  },
  'NH3': {
    id: 'NH3',
    name: 'NH3',
    fullName: 'Ammonia',
    formula: 'NH3',
    molecularWeight: 17.03,
    pH: 11,
    type: 'weak_base',
    color: 'Bening',
    state: 'aqueous',
    description: 'Amonia adalah basa lemah yang umum digunakan dalam industri dan rumah tangga.',
    properties: [
      'Basa lemah (tidak terdisosiasi sempurna)',
      'Bau menyengat khas',
      'Gas pada suhu kamar, larut dalam air',
      'Membentuk NH4OH dalam air',
      'Volatil (mudah menguap)'
    ],
    uses: [
      'Pupuk pertanian (utama)',
      'Pembersih rumah tangga',
      'Produksi asam nitrat',
      'Refrigeran industri',
      'Sintesis urea'
    ],
    safetyInfo: {
      hazards: [
        'Uap mengiritasi mata dan pernapasan',
        'Bau menyengat pada konsentrasi rendah',
        'Dapat menyebabkan edema paru (konsentrasi tinggi)',
        'Korosif terhadap kulit'
      ],
      handling: [
        'Gunakan di area ventilasi baik',
        'Hindari menghirup uap',
        'Gunakan masker jika perlu',
        'Simpan dalam wadah tertutup rapat'
      ],
      firstAid: [
        'Terhirup: Pindah ke udara segar',
        'Kulit: Bilas dengan air',
        'Mata: Bilas 15 menit',
        'Tertelan: Minum air, segera ke dokter'
      ],
      disposal: [
        'Netralisir dengan asam lemah',
        'Encerkan dengan air banyak',
        'Ventilasi baik saat pembuangan'
      ]
    },
    reactions: [
      {
        with: 'HCl',
        produces: 'NH4Cl (Asap putih)',
        type: 'exothermic'
      },
      {
        with: 'H2SO4',
        produces: '(NH4)2SO4',
        type: 'exothermic'
      }
    ]
  },
  'NaCl': {
    id: 'NaCl',
    name: 'NaCl',
    fullName: 'Sodium Chloride (Table Salt)',
    formula: 'NaCl',
    molecularWeight: 58.44,
    pH: 7,
    type: 'neutral_salt',
    color: 'Bening/putih',
    state: 'aqueous',
    description: 'Natrium klorida adalah garam meja yang umum, tidak asam maupun basa.',
    properties: [
      'Garam netral (tidak terhidrolisis)',
      'pH = 7 dalam air',
      'Elektrolit kuat',
      'Sangat larut dalam air',
      'Tidak berbahaya'
    ],
    uses: [
      'Garam dapur/konsumsi',
      'Pengawet makanan',
      'De-icing jalan',
      'Produksi NaOH dan Cl2 (elektrolisis)',
      'Infus medis (saline)'
    ],
    safetyInfo: {
      hazards: [
        'Tidak berbahaya dalam jumlah normal',
        'Konsumsi berlebihan dapat tingkatkan tekanan darah',
        'Tidak korosif'
      ],
      handling: [
        'Aman ditangani',
        'Hindari debu terhirup',
        'Simpan kering'
      ],
      firstAid: [
        'Umumnya tidak diperlukan',
        'Mata: Bilas dengan air jika terkena debu',
        'Tertelan: Minum air'
      ],
      disposal: [
        'Aman dibuang ke saluran air',
        'Tidak memerlukan perlakuan khusus'
      ]
    },
    reactions: [
      {
        with: 'Water',
        produces: 'Na+ dan Cl- (ion)',
        type: 'neutral'
      }
    ]
  }
}

export function getChemicalInfo(id: string): ChemicalDetail | undefined {
  return CHEMICAL_DATABASE[id]
}
