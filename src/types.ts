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
}

