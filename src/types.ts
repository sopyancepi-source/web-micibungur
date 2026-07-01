/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Activity {
  id: string;
  title: string;
  category: 'Akademik' | 'Prestasi' | 'Ekskul' | 'Sosial' | 'Keagamaan';
  date: string;
  description: string;
  image: string;
  author: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  image: string;
  tag: string;
}

export interface PPDBSubmission {
  id: string;
  studentName: string;
  parentName: string;
  phone: string;
  email: string;
  prevSchool: string;
  grade: 'SD' | 'SMP' | 'SMA' | string;
  date: string;
  status: 'Menunggu Review' | 'Jadwal Wawancara' | 'Diterima' | 'Ditolak';
  notes?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: 'Orang Tua' | 'Alumni' | 'Siswa';
  text: string;
  avatar: string;
  year?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  isImportant: boolean;
}

export interface SchoolProfile {
  schoolName: string;
  schoolSlogan: string;
  headline: string;
  description: string;
  logo?: string; // Custom Base64 or URL logo
  principalName: string;
  principalSpeech: string;
  principalAvatar: string;
  principalRole: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  statAcreditation: string;
  statTahfidz: string;
  statTeachers: string;
  statAdab: string;
  // Security & Feature Control fields
  isAlumniAccessActive?: boolean;
  isStudentAccessActive?: boolean;
  isParentAccessActive?: boolean;
  registeredAdmins?: string[];
  adminPin?: string;
  guruPin?: string;

  // New Flexible Homepage customization fields
  heroImage?: string;
  heroBadge?: string;
  heroTopBadge?: string;
  seal1?: string;
  seal2?: string;
  seal3?: string;
  heroStat1Title?: string;
  heroStat1Value?: string;
  heroStat1Label?: string;
  heroStat2Title?: string;
  heroStat2Value?: string;
  heroStat2Label?: string;
  principalTitle?: string;
  principalSubtext?: string;
  
  usp1Title?: string;
  usp1Desc?: string;
  usp2Title?: string;
  usp2Desc?: string;
  usp3Title?: string;
  usp3Desc?: string;
  usp4Title?: string;
  usp4Desc?: string;

  roadmap1Title?: string;
  roadmap1Points?: string;
  roadmap2Title?: string;
  roadmap2Points?: string;
  roadmap3Title?: string;
  roadmap3Points?: string;

  bigStat1Number?: string;
  bigStat1Title?: string;
  bigStat2Number?: string;
  bigStat2Title?: string;
  bigStat3Number?: string;
  bigStat3Title?: string;
  bigStat4Number?: string;
  bigStat4Title?: string;

  // Customizable Audience Tracks (Parents, Students, Alumni)
  audienceSectionTag?: string;
  audienceSectionTitle?: string;
  audienceSectionDesc?: string;

  parentTrack1Tag?: string;
  parentTrack1Title?: string;
  parentTrack1Desc?: string;
  parentTrack2Tag?: string;
  parentTrack2Title?: string;
  parentTrack2Desc?: string;
  parentTrack3Tag?: string;
  parentTrack3Title?: string;
  parentTrack3Desc?: string;

  studentTrack1Tag?: string;
  studentTrack1Title?: string;
  studentTrack1Desc?: string;
  studentTrack2Tag?: string;
  studentTrack2Title?: string;
  studentTrack2Desc?: string;
  studentTrack3Tag?: string;
  studentTrack3Title?: string;
  studentTrack3Desc?: string;

  alumniTrack1Tag?: string;
  alumniTrack1Title?: string;
  alumniTrack1Desc?: string;
  alumniTrack2Tag?: string;
  alumniTrack2Title?: string;
  alumniTrack2Desc?: string;
  alumniTrack3Tag?: string;
  alumniTrack3Title?: string;
  alumniTrack3Desc?: string;

  // Customizable Footer fields
  footerDescription?: string;
  footerInstagram?: string;
  footerFacebook?: string;
  footerYoutube?: string;
  footerNavTitle?: string;
  footerOpTitle?: string;
  footerOp1?: string;
  footerOp2?: string;
  footerOp3?: string;
  footerContactTitle?: string;

  // Customizable PPDB fields
  ppdbTitle?: string;
  ppdbSubtitle?: string;
  ppdbDesc?: string;
  ppdbSimulatorTitle?: string;
  ppdbSimulatorSubtitle?: string;
  ppdbFormTitle?: string;
  ppdbFormDesc?: string;
  ppdbGrades?: string;
  ppdbReassurance?: string;
  ppdbYear?: string;
  ppdbButtonText?: string;

  // Scholarship Tier 1 (Hafidz)
  ppdbSch1Title?: string;
  ppdbSch1Discount?: string;
  ppdbSch1Benefit?: string;

  // Scholarship Tier 2 (Nasional / Prestasi Sangat Tinggi)
  ppdbSch2Title?: string;
  ppdbSch2Discount?: string;
  ppdbSch2Benefit?: string;

  // Scholarship Tier 3 (Provinsi / Afirmasi)
  ppdbSch3Title?: string;
  ppdbSch3Discount?: string;
  ppdbSch3Benefit?: string;

  // Scholarship Tier 4 (Kabupaten / Saudara Kandung)
  ppdbSch4Title?: string;
  ppdbSch4Discount?: string;
  ppdbSch4Benefit?: string;

  // Sekilas Madrasah / Selayang Pandang
  sekilasTitle?: string;
  sekilasSubtitle?: string;
  sekilasHistory?: string;
  sekilasVisi?: string;
  sekilasMisi?: string;
  sekilasNilaiTitle?: string;
  sekilasNilaiDesc?: string;
}

export interface Teacher {
  id: string;
  name: string;
  role: string; // e.g., "Guru Kelas V", "Guru Mata Pelajaran Al-Qur'an Hadits"
  photo: string; // Base64 or URL
  education: string; // e.g., "S1 Pendidikan Guru MI - UIN Sunan Gunung Djati"
  bio?: string; // a brief biography/message
  biography?: string; // custom short biography of the teacher
  status: 'Aktif' | 'Cuti' | string;
  joinedYear?: string;
  order?: number; // Sorting/layout order for the teacher profiles
}

export interface HistoricalFigure {
  id: string;
  name: string;
  role: 'pendiri' | 'purna' | string; // 'pendiri' = Pendiri Madrasah, 'purna' = Guru Purna Bakti
  period: string; // e.g. "Masa Khidmat: 1994 - 2012"
  photo: string; // Base64 or URL
  bio?: string; // Short biography or message
  order?: number; // Sorting/layout order
}


