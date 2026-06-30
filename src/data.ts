/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Activity, Facility, Testimonial, Announcement, SchoolProfile } from './types';

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
  guruPin: '123456'
};

