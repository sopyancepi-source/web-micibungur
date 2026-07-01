/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Activity, Facility, Testimonial, Announcement, SchoolProfile, Teacher } from './types';

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    title: 'Wisuda Tahfidz Juz 30 & Khataman Al-Qur\'an Angkatan Ke-18',
    category: 'Keagamaan',
    date: '2026-06-12',
    description: 'Alhamdulillah, MI Cibungur I kembali melahirkan generasi penghafal Al-Qur\'an. Sebanyak 42 siswa kelas VI diwisuda setelah menuntaskan hafalan Juz 30 dengan tajwid yang baik. Acara dihadiri langsung oleh tokoh agama setempat.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
    author: 'Panitia Wisuda'
  },
  {
    id: 'act-2',
    title: 'Pembiasaan Shalat Dhuha & Dzuhur Berjamaah Setiap Hari',
    category: 'Keagamaan',
    date: '2026-05-20',
    description: 'Untuk menanamkan kedisiplinan dan kecintaan beribadah sejak dini, seluruh siswa dibimbing melaksanakan Shalat Dhuha dan Shalat Dzuhur berjamaah secara istiqomah di Masjid sekolah.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
    author: 'Kesiswaan Madrasah'
  },
  {
    id: 'act-3',
    title: 'Latihan Pramuka Penggalang Islami & Kemandirian Siswa',
    category: 'Ekskul',
    date: '2026-05-15',
    description: 'Melalui gerakan Pramuka, siswa dilatih kemandirian, kerja sama tim, cinta alam semesta, dan nilai-nilai luhur kepemimpinan yang berakhlak mulia di lingkungan madrasah.',
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=1200',
    author: 'Kakak Pembina'
  },
  {
    id: 'act-4',
    title: 'Santunan Anak Yatim & Bakti Sosial Bersama Wali Murid',
    category: 'Sosial',
    date: '2026-04-10',
    description: 'Mewujudkan rasa kepedulian antar sesama, keluarga besar MI Cibungur I bekerja sama dengan komite madrasah menggalang bantuan sembako dan santunan tunai bagi anak yatim piatu di sekitar wilayah Cibungur.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200',
    author: 'Komite Madrasah'
  }
];

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'fac-1',
    name: 'Ruang Kelas Nyaman & Sejuk',
    description: 'Ruang kelas yang bersih dan asri, dilengkapi ventilasi yang baik agar anak-anak konsentrasi penuh saat belajar dan mengaji.',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
    tag: 'Kelas'
  },
  {
    id: 'fac-2',
    name: 'Masjid Al-Ikhlas MI Cibungur',
    description: 'Masjid yang bersih dan luas sebagai pusat bimbingan ibadah harian, hafalan Qur\'an (Tahfidz), serta praktik ibadah keagamaan praktis bagi siswa.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
    tag: 'Ibadah'
  },
  {
    id: 'fac-3',
    name: 'Perpustakaan Buku & Cerita Islami',
    description: 'Koleksi buku pelajaran kurikulum Kemenag dan buku cerita Islami bergambar untuk melatih literasi serta akhlak anak sejak dini.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
    tag: 'Literasi'
  },
  {
    id: 'fac-4',
    name: 'Halaman Bermain & Olahraga Ramah Anak',
    description: 'Area bermain outdoor yang aman bagi anak-anak tingkat dasar, sekaligus untuk kegiatan upacara harian, senam, dan kegiatan olahraga siswa.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    tag: 'Fisik'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Bapak H. Jajang',
    role: 'Orang Tua',
    text: 'Alhamdulillah, keputusan tepat menyekolahkan anak saya di MI Cibungur I. Belum lulus pun, anak saya sudah lancar membaca Al-Qur\'an, hafal Juz 30, dan yang terpenting adab kesopanannya kepada orang tua sangat luar biasa.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    year: 'Wali Murid Kelas V (Asal Kp. Cibungur)'
  },
  {
    id: 'test-2',
    name: 'Ibu Nenden Kurniasih',
    role: 'Orang Tua',
    text: 'Gurunya sangat ramah, sabar, dan telaten membimbing anak-anak. Biaya sekolahnya sangat terjangkau untuk kami yang berada di pedesaan, tetapi mutunya tidak kalah bagus dengan sekolah perkotaan.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    year: 'Wali Murid Kelas III (Asal Batujajar KBB)'
  },
  {
    id: 'test-3',
    name: 'Syifa Az-Zahra',
    role: 'Alumni',
    text: 'Belajar di MI Cibungur I sangat menyenangkan dan berkah. Kami dididik shalat tepat waktu, saling menyayangi sesama teman, dan dibimbing langsung oleh ustadz dan ustadzah yang luar biasa ikhlasnya.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    year: 'Lulusan Terbaik MI Cibungur I Angkatan 2024'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Penerimaan Peserta Didik Baru (PPDB) MI Cibungur I Tahun Ajaran 2026/2027 Dibuka',
    content: 'Madrasah Ibtidaiyah Cibungur I resmi membuka pendaftaran murid baru. Pendaftaran bisa dilakukan secara online melalui website ini, atau langsung datang ke kantor madrasah dibantu oleh panitia guru kami dengan membawa fotokopi KK dan Akta Lahir.',
    date: '2026-06-25',
    isImportant: true
  },
  {
    id: 'ann-2',
    title: 'Jadwal Sosialisasi Pembiasaan Akhlak & Pembagian Rapor Semester Genap',
    content: 'Mengundang seluruh wali murid MI Cibungur I untuk hadir dalam pengajian silaturahmi sekaligus pembagian rapor kenaikan kelas yang akan dilaksanakan pada hari Sabtu pukul 08.00 WIB.',
    date: '2026-06-20',
    isImportant: false
  }
];

export const SCHOOL_STATS = {
  acreditation: 'A (Sangat Baik)',
  passingRateToPTN: '100% Terbina',
  studentTeacherRatio: '1:15',
  nationalTrophies: '15+ Juara',
  established: '1998',
  teacherS2S3: '100% Kompeten'
};

export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  schoolName: 'MI CIBUNGUR I',
  schoolSlogan: 'BANDUNG BARAT',
  logo: '', // Empty means fallback to default GraduationCap icon
  headline: 'Membimbing Generasi Qur\'ani Berkarakter Sholeh, Cerdas & Mandiri',
  description: 'Selamat datang di MI Cibungur I, Kabupaten Bandung Barat. Kami mendidik anak dengan kasih sayang dan nilai-nilai luhur keagamaan demi masa depan yang berkah, berakhlak mulia, dan berbakti kepada orang tua.',
  principalName: 'Sopyan Cepi, S.Pd.I.',
  principalSpeech: 'Assalamu\'alaikum Wr. Wb. Selamat datang di website resmi MI Cibungur I, Kabupaten Bandung Barat. Di tengah perkembangan zaman yang begitu cepat, kami berkomitmen menjaga pondasi iman dan adab kesopanan putra-putri kita. Kami mendidik anak dengan penuh kesabaran, memberikan keteladanan ibadah nyata seperti shalat berjamaah dan hafalan surat pendek, agar mereka tumbuh cerdas akalnya dan sholeh jiwanya. Pintu kami selalu terbuka lebar untuk mendampingi masa depan anak-anak kita.',
  principalAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=350&h=440',
  principalRole: 'Kepala Madrasah MI Cibungur I',
  address: 'Kp. Cibungur, RT 02/RW 11, Desa Cibungur, Kabupaten Bandung Barat, Jawa Barat',
  phone: '0853-2005-4921',
  email: 'info@micibungur1.sch.id',
  whatsapp: '6285320054921',
  statAcreditation: 'Terakreditasi A (Sangat Baik), menjamin mutu pengajaran anak Anda.',
  statTahfidz: 'Setiap lulusan ditargetkan hafal Juz Amma (Juz 30) dengan bacaan tartil.',
  statTeachers: 'Dididik langsung oleh ustadz & ustadzah sabar, telaten, dan berdedikasi.',
  statAdab: 'Siswa dibimbing membiasakan adab kesopanan dan doa sehari-hari.',
  // Default values for security and access controls
  isAlumniAccessActive: true,
  isStudentAccessActive: true,
  isParentAccessActive: true,
  registeredAdmins: ['sopyancepi@gmail.com'],
  adminPin: '999888',
  guruPin: '123456',

  // New Flexible Homepage customization fields
  heroImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200',
  heroBadge: 'KAMPUS UNGGUL',
  heroTopBadge: 'Akreditasi A & Madrasah Ibtidaiyah Rujukan Karakter',
  seal1: 'KURIKULUM KEMENAG RI',
  seal2: 'BAN-SM TERAKREDITASI A',
  seal3: 'PEMBIASAAN TAHFIDZ JUZ 30',
  heroStat1Title: 'PENDAFTAR BULAN INI',
  heroStat1Value: '+182',
  heroStat1Label: 'Terverifikasi',
  heroStat2Title: 'KUOTA JALUR BEASISWA',
  heroStat2Value: '14 Kursi',
  heroStat2Label: 'Sisa',
  principalTitle: '"Ikhlas Beramal, Mengabdi Demi Pendidikan Akhlak & Karakter Anak"',
  principalSubtext: 'KKG Kabupaten Bandung Barat',
  
  usp1Title: 'Kurikulum Terpadu',
  usp1Desc: 'Sinergi apik Kurikulum Merdeka Nasional dengan kurikulum keagamaan Kementerian Agama Republik Indonesia.',
  usp2Title: 'Pembiasaan Ibadah',
  usp2Desc: 'Melatih shalat dhuha, shalat dzuhur berjamaah, zikir harian, hafalan hadits, serta doa fardhu sejak usia dini.',
  usp3Title: 'Rasio Kelas Nyaman',
  usp3Desc: 'Jumlah murid per kelas dibatasi proporsional agar guru dapat memberikan perhatian penuh, sabar, dan kasih sayang intensif.',
  usp4Title: 'Sangat Ringan & Terjangkau',
  usp4Desc: 'Biaya SPP bulanan yang ringan, subsidi khusus anak berprestasi, yatim, dhuafa, serta beasiswa komite komprehensif.',

  roadmap1Title: 'Kelas I - II: Pembiasaan Adab & Iqra',
  roadmap1Points: 'Belajar mengaji Iqra secara bertahap, lancar, dan tanpa paksaan\nPenanaman karakter dasar 5S (Senyum, Sapa, Salam, Sopan, Santun)\nPembelajaran motorik dasar, menggambar Islami, & calistung ramah anak',
  roadmap2Title: 'Kelas III - IV: Kemandirian & Hafalan Juz Amma',
  roadmap2Points: 'Mulai menghafal surat-surat pendek Juz 30 secara rutin berulang\nKegiatan Kepramukaan Siaga melatih kepemimpinan, kerjasama, dan disiplin\nEksplorasi ilmu sains dasar berbasis lingkungan sekitar madrasah',
  roadmap3Title: 'Kelas V - VI: Kepemimpinan & Kelulusan Berkah',
  roadmap3Points: 'Pemantapan hafalan Juz 30 sebagai mahkota kelulusan utama madrasah\nBimbingan belajar intensif menyongsong SMP / MTs favorit Kabupaten\nBakti sosial cilik, tadabbur alam, dan pembiasaan shalat berjamaah mandiri',

  bigStat1Number: 'A (Sangat Baik)',
  bigStat1Title: 'Akreditasi Madrasah',
  bigStat2Number: '100% Terbina',
  bigStat2Title: 'Pendidikan Akhlak',
  bigStat3Number: '100% Kompeten',
  bigStat3Title: 'Guru Ramah Anak',
  bigStat4Number: '15+ Juara',
  bigStat4Title: 'Hafalan Juz 30',

  // Default values for Customizable Audience Tracks (Parents, Students, Alumni)
  audienceSectionTag: 'PEMBELAJARAN BERFOKUS AKHLAK',
  audienceSectionTitle: 'Program & Pembiasaan Terbaik bagi Calon Siswa',
  audienceSectionDesc: 'Silakan pilih profil Anda di bawah ini untuk melihat komitmen pelayanan pendidikan serta nilai tambah yang kami hadirkan bagi keluarga Anda.',

  parentTrack1Tag: '01 / SILATURAHMI',
  parentTrack1Title: 'Monitoring Perkembangan Anak',
  parentTrack1Desc: 'Kemudahan berkomunikasi langsung dengan wali kelas via WhatsApp untuk memantau ibadah shalat dan progres hafalan surat pendek anak di rumah.',
  parentTrack2Tag: '02 / AKHLAK MULIA',
  parentTrack2Title: 'Bimbingan Sopan Santun',
  parentTrack2Desc: 'Kurikulum kami menekankan adab menghormati orang tua, menyayangi sesama, dan kemandirian perilaku anak dalam kehidupan sehari-hari.',
  parentTrack3Tag: '03 / BEASISWA',
  parentTrack3Title: 'Biaya Terjangkau & Subsidi',
  parentTrack3Desc: 'Madrasah kami mendukung penuh seluruh lapisan masyarakat dengan skema subsidi silang, beasiswa komite, serta kemudahan biaya bagi anak yatim/piatu.',

  studentTrack1Tag: '01 / KEAGAMAAN',
  studentTrack1Title: "Bimbingan Iqra & Al-Qur'an",
  studentTrack1Desc: 'Belajar mengaji dengan metode yang menyenangkan, dibimbing ustadz/ustadzah penyabar mulai dari nol hingga lancar membaca Al-Qur\'an.',
  studentTrack2Tag: '02 / CERITA ISLAMI',
  studentTrack2Title: 'Kisah Teladan Rasul',
  studentTrack2Desc: 'Pembelajaran disisipi dongeng Islami menarik, menceritakan perjuangan nabi dan sahabat untuk menumbuhkan rasa cinta pada agama sejak kecil.',
  studentTrack3Tag: '03 / BERMAIN',
  studentTrack3Title: 'Pramuka & Silat Tapak Suci',
  studentTrack3Desc: 'Ikuti kegiatan luar kelas yang asyik mulai dari Pramuka Siaga/Penggalang, mewarnai bersama, hingga olahraga bela diri fisik yang melatih ketangkasan.',

  alumniTrack1Tag: '01 / JEJARING ALUMNI',
  alumniTrack1Title: 'Ikatan Alumni MI Cibungur',
  alumniTrack1Desc: 'Menjaga silaturahmi antar alumni lintas angkatan untuk bertukar info jenjang SMP/MTS, pondok pesantren, hingga kolaborasi demi kemajuan bersama.',
  alumniTrack2Tag: '02 / DONASI & KONTRIBUSI',
  alumniTrack2Title: 'Sumbangsih Almamater',
  alumniTrack2Desc: 'Wadah bagi alumni yang ingin mendonasikan buku perpustakaan, peralatan ibadah, atau sumbangan sarana pendidikan bagi adik kelas yang membutuhkan.',
  alumniTrack3Tag: '03 / KISAH SUKSES',
  alumniTrack3Title: 'Motivasi & Inspirasi',
  alumniTrack3Desc: 'Berbagi cerita sukses alumni yang melanjutkan ke pesantren terkemuka atau sekolah favorit untuk memotivasi adik-adik kelas yang masih belajar.'
};

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'guru-1',
    name: 'Sopyan Cepi, S.Pd.I.',
    role: 'Kepala Madrasah & Guru Akidah Akhlak',
    photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=350&h=440',
    education: 'S1 Pendidikan Agama Islam - UIN Sunan Gunung Djati Bandung',
    bio: 'Bertekad mendidik tunas bangsa yang berakhlakul karimah, disiplin, dan cinta Al-Qur\'an.',
    biography: 'Lahir di Bandung Barat, memiliki dedikasi lebih dari 10 tahun di dunia pendidikan Islam. Berpengalaman dalam pengelolaan kurikulum dan manajemen madrasah ibtidaiyah terpadu.',
    status: 'Aktif',
    joinedYear: '2015',
    order: 1
  },
  {
    id: 'guru-2',
    name: 'Ustadzah Siti Aminah, S.Pd.',
    role: 'Guru Kelas I & Koordinator Tahfidz',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=350',
    education: 'S1 Pendidikan Guru Madrasah Ibtidaiyah - UIN Sunan Gunung Djati',
    bio: 'Sangat senang membimbing siswa kelas awal membaca Al-Qur\'an dengan metode yang ceria dan sabar.',
    biography: 'Fokus pada metode pengajaran menyenangkan (joyful learning) untuk anak usia emas, mengintegrasikan hafalan Al-Qur\'an juz 30 dengan pendidikan karakter yang bersahaja.',
    status: 'Aktif',
    joinedYear: '2018',
    order: 2
  },
  {
    id: 'guru-3',
    name: 'Ustadz Ahmad Fauzi, S.Ag.',
    role: 'Guru Kelas V & Pembimbing Fiqih',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=350',
    education: 'S1 Ushuluddin - UIN Sunan Gunung Djati Bandung',
    bio: 'Menanamkan pemahaman ibadah harian sejak dini agar menjadi pembiasaan hidup yang kokoh.',
    biography: 'Spesialis dalam fiqih amaliyah praktis untuk anak-anak sekolah dasar. Senang memadukan praktek langsung gerakan shalat dan wudhu yang benar dengan pembiasaan sopan santun.',
    status: 'Aktif',
    joinedYear: '2019',
    order: 3
  }
];


