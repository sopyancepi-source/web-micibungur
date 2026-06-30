/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  PlusCircle, 
  Users, 
  FileCheck, 
  Calendar, 
  Image as ImageIcon, 
  Tag, 
  Send, 
  CheckCircle, 
  Trash2, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  LayoutGrid,
  Lock,
  Eye,
  EyeOff,
  ShieldAlert
} from 'lucide-react';
import { Activity, PPDBSubmission, Announcement, SchoolProfile } from '../types';

interface AdminPortalProps {
  activities: Activity[];
  submissions: PPDBSubmission[];
  announcements: Announcement[];
  onAddActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
  onUpdateSubmissionStatus: (id: string, status: PPDBSubmission['status']) => void;
  onDeleteSubmission: (id: string) => void;
  onAddAnnouncement: (announcement: Announcement) => void;
  onDeleteAnnouncement?: (id: string) => void;
  schoolProfile?: SchoolProfile;
  onUpdateSchoolProfile?: (profile: SchoolProfile) => void;
  firebaseStatus?: 'loading' | 'connected' | 'error';
  firebaseError?: string | null;
}

const PRESET_IMAGES = [
  { id: 'pres-1', label: 'Belajar Coding/Lab Komputer', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800' },
  { id: 'pres-2', label: 'Eksperimen Lab Kimia/Biologi', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800' },
  { id: 'pres-3', label: 'Olahraga/Lomba Basket', url: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=800' },
  { id: 'pres-4', label: 'Pementasan Musik & Drama', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800' },
  { id: 'pres-5', label: 'Upacara / Prestasi Siswa', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800' },
  { id: 'pres-6', label: 'Rapat Organisasi OSIS', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800' },
];

export default function AdminPortal({
  activities,
  submissions,
  announcements,
  onAddActivity,
  onDeleteActivity,
  onUpdateSubmissionStatus,
  onDeleteSubmission,
  onAddAnnouncement,
  onDeleteAnnouncement,
  schoolProfile,
  onUpdateSchoolProfile,
  firebaseStatus,
  firebaseError
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'kegiatan' | 'pendaftar' | 'pengumuman' | 'profil'>('kegiatan');

  // Secure Role-Based Gate State
  const [loginMode, setLoginMode] = useState<'guru' | 'admin'>('guru');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPin, setInputPin] = useState('');
  const [userRole, setUserRole] = useState<'guru' | 'admin' | null>(() => {
    return sessionStorage.getItem('admin_role') as 'guru' | 'admin' | null;
  });
  const [pinError, setPinError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = inputEmail.trim().toLowerCase();
    const currentAdminPin = schoolProfile?.adminPin || '999888';
    const currentGuruPin = schoolProfile?.guruPin || '123456';
    const currentRegisteredAdmins = schoolProfile?.registeredAdmins || ['sopyancepi@gmail.com'];

    if (loginMode === 'admin') {
      if (!cleanEmail) {
        setPinError('Email Administrator wajib diisi!');
        return;
      }
      if (!currentRegisteredAdmins.includes(cleanEmail)) {
        setPinError(`Email "${cleanEmail}" belum terdaftar sebagai Super Admin!`);
        return;
      }
      if (inputPin !== currentAdminPin) {
        setPinError('PIN Administrator salah!');
        return;
      }
      // Successful Admin Login
      setUserRole('admin');
      sessionStorage.setItem('admin_role', 'admin');
      setPinError(null);
    } else {
      // Guru Login
      if (inputPin !== currentGuruPin) {
        setPinError('PIN Guru/Staf salah!');
        return;
      }
      // Successful Guru Login
      setUserRole('guru');
      sessionStorage.setItem('admin_role', 'guru');
      setPinError(null);
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    sessionStorage.removeItem('admin_role');
    setInputPin('');
    setInputEmail('');
    setPinError(null);
  };

  // School Profile Form State
  const [profileForm, setProfileForm] = useState<SchoolProfile>(() => {
    return schoolProfile || {
      schoolName: '',
      schoolSlogan: '',
      headline: '',
      description: '',
      principalName: '',
      principalSpeech: '',
      principalAvatar: '',
      principalRole: '',
      address: '',
      phone: '',
      email: '',
      whatsapp: '',
      statAcreditation: '',
      statTahfidz: '',
      statTeachers: '',
      statAdab: '',
      isAlumniAccessActive: true,
      isStudentAccessActive: true,
      isParentAccessActive: true,
      registeredAdmins: ['sopyancepi@gmail.com'],
      adminPin: '999888',
      guruPin: '123456'
    };
  });
  const [profSuccess, setProfSuccess] = useState(false);

  // Sync profile form state if schoolProfile prop updates
  React.useEffect(() => {
    if (schoolProfile) {
      setProfileForm(schoolProfile);
    }
  }, [schoolProfile]);

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSchoolProfile) {
      onUpdateSchoolProfile(profileForm);
      setProfSuccess(true);
      setTimeout(() => setProfSuccess(false), 3000);
    }
  };

  // New Activity State
  const [actTitle, setActTitle] = useState('');
  const [actCategory, setActCategory] = useState<Activity['category']>('Akademik');
  const [actDate, setActDate] = useState(new Date().toISOString().split('T')[0]);
  const [actDesc, setActDesc] = useState('');
  const [actAuthor, setActAuthor] = useState('Admin Sekolah');
  const [selectedPresetImage, setSelectedPresetImage] = useState(PRESET_IMAGES[0].url);
  const [customImageURL, setCustomImageURL] = useState('');
  const [actSuccess, setActSuccess] = useState(false);

  // New Announcement State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annIsImportant, setAnnIsImportant] = useState(false);
  const [annSuccess, setAnnSuccess] = useState(false);

  const handleAddActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle.trim() || !actDesc.trim()) return;

    const finalImage = customImageURL.trim() ? customImageURL.trim() : selectedPresetImage;

    onAddActivity({
      id: `act-${Date.now()}`,
      title: actTitle,
      category: actCategory,
      date: actDate,
      description: actDesc,
      image: finalImage,
      author: actAuthor
    });

    setActTitle('');
    setActDesc('');
    setCustomImageURL('');
    setActSuccess(true);
    setTimeout(() => setActSuccess(false), 3000);
  };

  const handleAddAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    onAddAnnouncement({
      id: `ann-${Date.now()}`,
      title: annTitle,
      content: annContent,
      date: new Date().toISOString().split('T')[0],
      isImportant: annIsImportant
    });

    setAnnTitle('');
    setAnnContent('');
    setAnnIsImportant(false);
    setAnnSuccess(true);
    setTimeout(() => setAnnSuccess(false), 3000);
  };

  if (!userRole) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-8 md:p-10 relative overflow-hidden text-left">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 to-teal-600" />
          
          <div className="mx-auto h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 shadow-md">
            <Lock className="h-7 w-7" />
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight text-center">Portal Madrasah Terkunci</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed text-center">
            Demi keamanan data madrasah MI Cibungur I, silakan pilih peran Anda dan masukkan PIN otentikasi.
          </p>

          {/* Role selector inside Login Gate */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mt-6">
            <button
              type="button"
              onClick={() => {
                setLoginMode('guru');
                setPinError(null);
                setInputPin('');
              }}
              className={`py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
                loginMode === 'guru'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Guru / Staf
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode('admin');
                setPinError(null);
                setInputPin('');
              }}
              className={`py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
                loginMode === 'admin'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Super Admin
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
            {loginMode === 'admin' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Email Administrator Terdaftar
                </label>
                <input
                  type="email"
                  value={inputEmail}
                  onChange={(e) => {
                    setInputEmail(e.target.value);
                    if (pinError) setPinError(null);
                  }}
                  placeholder="Contoh: sopyancepi@gmail.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                PIN {loginMode === 'admin' ? 'Administrator' : 'Guru / Staf'}
              </label>
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  value={inputPin}
                  onChange={(e) => {
                    setInputPin(e.target.value);
                    if (pinError) setPinError(null);
                  }}
                  placeholder={`Masukkan PIN ${loginMode === 'admin' ? 'Super Admin' : 'Guru'}`}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all font-mono tracking-widest text-center ${
                    pinError 
                      ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500" 
                      : "border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                  }`}
                  maxLength={12}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {pinError && (
                <p className="text-xs font-semibold text-rose-600 mt-2 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 shrink-0" /> {pinError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-950 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-emerald-900 active:scale-[0.98] transition-all duration-200 shadow-md shadow-slate-950/10 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Buka Kunci Akses Portal</span>
            </button>
          </form>

          {/* Secure Hint with Default PIN */}
          <div className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl p-4 text-left text-xs text-amber-800 leading-relaxed">
            <span className="font-bold block mb-1">🔑 Informasi Akses Bawaan (Default):</span>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Guru & Staf</strong>: Gunakan PIN <strong className="font-mono bg-amber-200/50 px-1.5 py-0.5 rounded text-amber-950">123456</strong></li>
              <li><strong>Super Admin</strong>: Email <strong className="font-mono text-amber-950">sopyancepi@gmail.com</strong> dengan PIN <strong className="font-mono bg-amber-200/50 px-1.5 py-0.5 rounded text-amber-950">999888</strong></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Portal Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500 rounded-full blur-3xl opacity-20 transform translate-x-10 -translate-y-10" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20 inline-flex items-center gap-1.5">
              {userRole === 'admin' ? '🛡️ Super Admin Mode' : '📝 Guru & Staf Mode'}
            </span>
            <h2 className="text-2xl md:text-3xl font-black mt-3 tracking-tight">
              {userRole === 'admin' ? 'Portal Administrator Utama' : 'Portal Guru & Staf Tata Usaha'}
            </h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-2xl mt-1.5">
              {userRole === 'admin' 
                ? 'Anda memiliki hak akses penuh untuk mengelola konten, menghapus postingan siapapun, serta menentukan aktif/tidaknya akses Alumni, Siswa, dan Orang Tua.' 
                : 'Anda dapat mengupload kegiatan pembelajaran, menulis pengumuman baru, serta memproses data PPDB. Penghapusan postingan dan pengaturan akses dikendalikan oleh Super Admin.'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="shrink-0 px-5 py-3 text-xs font-bold bg-rose-600/20 hover:bg-rose-600/35 border border-rose-500/35 text-rose-200 rounded-xl transition-all cursor-pointer text-center"
          >
            Keluar Portal
          </button>
        </div>
      </div>

      {/* Firebase Integration Status Panel */}
      <div className="mb-8">
        {firebaseStatus === 'connected' ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left">
            <div className="flex gap-3">
              <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-800 shrink-0">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Firebase Berhasil Terhubung!</span>
                  <span className="bg-emerald-200 text-emerald-800 text-[9px] font-black uppercase px-2 py-0.5 rounded">Aktif & Sinkron</span>
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Selamat! Website MI Cibungur I kini terhubung secara penuh ke Project ID <strong className="text-slate-800">mi-cibungur-i</strong>. Seluruh data kegiatan, pendaftaran PPDB, pengumuman, dan kustomisasi profil madrasah Anda sekarang tersimpan aman dan permanen di Cloud Firestore database Anda.
                </p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-[10px] font-mono bg-slate-900 text-white px-3 py-1 rounded-lg">
                mi-cibungur-i (Firestore)
              </span>
            </div>
          </div>
        ) : firebaseStatus === 'loading' ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 animate-pulse flex items-center gap-3 text-left">
            <div className="h-4.5 w-4.5 bg-slate-200 rounded-full shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-700">Menghubungkan ke database Firebase...</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Sedang sinkronisasi data cloud untuk MI Cibungur I.</p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-left">
            <div className="flex gap-3">
              <div className="h-10 w-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-800 shrink-0">
                <Sparkles className="h-5 w-5 text-amber-700" />
              </div>
              <div className="flex-grow">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Penyimpanan Lokal Aktif (Fallback Mode)</span>
                  <span className="bg-amber-200 text-amber-800 text-[9px] font-black uppercase px-2 py-0.5 rounded">Offline / LocalStorage</span>
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Kami mendeteksi database Firebase Anda (Project ID: <strong>mi-cibungur-i</strong>) belum diaktifkan atau aturan keamanannya (Security Rules) menolak akses. Website tetap dapat digunakan secara normal dengan menyimpan seluruh data Anda secara otomatis di browser komputer ini.
                </p>

                {/* Helpful Instruction Accordion */}
                <div className="mt-4 bg-white/70 rounded-xl p-4 border border-amber-200/50 text-xs">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                    💡 Cara Mengaktifkan Firestore & Security Rules di Firebase Console Anda:
                  </h5>
                  <ol className="list-decimal pl-4 space-y-2 text-slate-600">
                    <li>
                      Di Firebase Console sebelah kiri, klik menu <strong>Build</strong> &rarr; <strong>Firestore Database</strong>.
                    </li>
                    <li>
                      Klik tombol <strong>Create database</strong> (Buat database). Pilih wilayah terdekat (misal: <i>asia-southeast2</i> atau default) lalu klik Next.
                    </li>
                    <li>
                      Pilih opsi <strong>Start in test mode</strong> (Mulai dalam mode pengujian) agar aturan keamanan awal mengizinkan website Anda membaca & menulis data, lalu klik <strong>Create</strong>.
                    </li>
                    <li>
                      <i>Atau jika database sudah ada:</i> Masuk ke tab <strong>Rules</strong> di bagian atas Firestore, lalu ubah aturannya agar memperbolehkan akses baca/tulis sementara:
                      <pre className="bg-slate-900 text-amber-400 p-2.5 rounded-lg mt-1 font-mono text-[10px] overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                      </pre>
                    </li>
                    <li>
                      Klik tombol <strong>Publish</strong> di bagian kanan atas halaman Rules Firebase Anda. Lalu muat ulang halaman website ini untuk melihat status menjadi <strong className="text-emerald-700">Terhubung</strong> secara otomatis!
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto gap-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('kegiatan')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'kegiatan'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <PlusCircle className="h-4.5 w-4.5" />
          <span>Upload Kegiatan Siswa</span>
        </button>
        <button
          onClick={() => setActiveTab('pendaftar')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'pendaftar'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="h-4.5 w-4.5" />
          <span>Kelola Calon Siswa (PPDB)</span>
          {submissions.length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {submissions.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('pengumuman')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'pengumuman'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="h-4.5 w-4.5" />
          <span>Tulis Pengumuman</span>
        </button>
        {userRole === 'admin' && (
          <button
            onClick={() => setActiveTab('profil')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'profil'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="h-4.5 w-4.5" />
            <span>Edit Profil Madrasah (Kustomisasi)</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tab 1: Upload Kegiatan */}
        {activeTab === 'kegiatan' && (
          <>
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-emerald-600" />
                Upload Dokumentasi Kegiatan Baru
              </h3>

              {actSuccess && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2 text-xs font-semibold">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Kegiatan berhasil di-upload dan dipublikasikan ke halaman Beranda & Kegiatan Siswa!
                </div>
              )}

              <form onSubmit={handleAddActivitySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Judul Kegiatan / Berita</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Tim Robotik Juara Tingkat Internasional..."
                    value={actTitle}
                    onChange={(e) => setActTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Kategori</label>
                    <select
                      value={actCategory}
                      onChange={(e) => setActCategory(e.target.value as Activity['category'])}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-medium"
                    >
                      <option value="Akademik">Akademik</option>
                      <option value="Prestasi">Prestasi</option>
                      <option value="Ekskul">Ekskul (Seni/Olahraga)</option>
                      <option value="Sosial">Sosial/Lingkungan</option>
                      <option value="Keagamaan">Keagamaan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Tanggal Kegiatan</label>
                    <input
                      type="date"
                      required
                      value={actDate}
                      onChange={(e) => setActDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Penulis / Staf Humas</label>
                    <input
                      type="text"
                      required
                      value={actAuthor}
                      onChange={(e) => setActAuthor(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Pilih Foto Dokumentasi (1-Klik Cepat)</label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-3">
                    {PRESET_IMAGES.map((img) => {
                      const isSelected = selectedPresetImage === img.url && !customImageURL;
                      return (
                        <button
                          key={img.id}
                          type="button"
                          onClick={() => {
                            setSelectedPresetImage(img.url);
                            setCustomImageURL('');
                          }}
                          className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            isSelected ? 'border-emerald-500 scale-95 shadow-md' : 'border-slate-200 hover:border-slate-300'
                          }`}
                          title={img.label}
                        >
                          <img src={img.url} alt={img.label} className="h-full w-full object-cover" />
                          {isSelected && (
                            <div className="absolute inset-0 bg-emerald-600/20 flex items-center justify-center">
                              <CheckCircle className="h-5 w-5 text-white filter drop-shadow" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Atau Gunakan Link URL Foto Custom</span>
                    <input
                      type="url"
                      placeholder="Masukkan URL foto custom (https://...)"
                      value={customImageURL}
                      onChange={(e) => setCustomImageURL(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Deskripsi Lengkap / Berita Acara</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tulis kronologi acara sekolah, hasil lomba, manfaat bagi siswa, serta dokumentasi penting..."
                    value={actDesc}
                    onChange={(e) => setActDesc(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50 resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="h-4 w-4" />
                  <span>Publikasikan Berita & Kegiatan Sekarang</span>
                </button>
              </form>
            </div>

            {/* Right: Existing Activities Quick List */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-emerald-600" />
                Daftar Kegiatan Terbit ({activities.length})
              </h3>
              <p className="text-xs text-slate-400 mb-4 font-medium">Berikut adalah daftar kegiatan yang saat ini tampil di website utama.</p>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {activities.map((act) => (
                  <div key={act.id} className="flex gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors">
                    <img src={act.image} alt={act.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                    <div className="overflow-hidden flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                            {act.category}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 flex items-center gap-0.5">
                            <Calendar className="h-2.5 w-2.5" /> {act.date}
                          </span>
                        </div>
                        <h4 className="font-semibold text-xs text-slate-800 truncate" title={act.title}>
                          {act.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{act.description}</p>
                      </div>

                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[9px] text-slate-400">By: {act.author}</span>
                        {userRole === 'admin' && (
                          <button
                            onClick={() => onDeleteActivity(act.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 cursor-pointer"
                            title="Hapus Kegiatan"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Tab 2: PPDB Applicant list */}
        {activeTab === 'pendaftar' && (
          <div className="lg:col-span-12 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  Daftar Calon Siswa Baru (PPDB 2026/2027)
                </h3>
                <p className="text-xs text-slate-400 mt-1">Kelola status, jadwal wawancara berkas fisik, dan perolehan diskon beasiswa calon siswa baru.</p>
              </div>
              <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-xs">
                <span className="font-semibold text-slate-500">Total Pendaftar Draf:</span> <strong className="text-emerald-700 font-extrabold">{submissions.length} Orang</strong>
              </div>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-16">
                <div className="h-12 w-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-slate-700 text-sm">Belum Ada Calon Siswa Terdaftar</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">Formulir draf yang dikirim orang tua melalui menu "Pendaftaran PPDB" akan langsung muncul di panel administrasi ini.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Nama Siswa</th>
                      <th className="py-3 px-4">Kontak Orang Tua</th>
                      <th className="py-3 px-4">Sekolah Asal & Kelas</th>
                      <th className="py-3 px-4">Klaim Beasiswa / Catatan</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {submissions.map((sub) => {
                      // Status styling
                      let statusBg = 'bg-slate-100 text-slate-700';
                      if (sub.status === 'Diterima') statusBg = 'bg-emerald-100 text-emerald-800 font-semibold';
                      else if (sub.status === 'Jadwal Wawancara') statusBg = 'bg-amber-100 text-amber-800 font-semibold';
                      else if (sub.status === 'Ditolak') statusBg = 'bg-red-100 text-red-800';

                      return (
                        <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            {sub.studentName}
                            <span className="block text-[10px] font-normal text-slate-400 mt-0.5">Daftar: {sub.date}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="block font-medium text-slate-700">{sub.parentName}</span>
                            <span className="block text-[10px] text-slate-400 mt-0.5">{sub.email}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="block font-medium text-slate-700">{sub.prevSchool}</span>
                            <span className="inline-block bg-slate-200/60 text-slate-600 text-[9px] font-semibold px-2 py-0.5 rounded-full mt-1">
                              {sub.grade}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="text-[11px] text-slate-600 leading-normal" title={sub.notes}>
                              {sub.notes}
                            </p>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <select
                              value={sub.status}
                              onChange={(e) => onUpdateSubmissionStatus(sub.id, e.target.value as PPDBSubmission['status'])}
                              className={`text-[11px] rounded-lg px-2.5 py-1 focus:outline-none font-semibold ${statusBg} border-none cursor-pointer`}
                            >
                              <option value="Menunggu Review">Review Berkas</option>
                              <option value="Jadwal Wawancara">Wawancara</option>
                              <option value="Diterima">Diterima</option>
                              <option value="Ditolak">Ditolak</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              {/* WhatsApp Direct Link simulation */}
                              <a
                                href={`https://wa.me/${sub.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                                title="Hubungi Orang Tua via WhatsApp"
                              >
                                <MessageSquare className="h-4.5 w-4.5" />
                              </a>
                              {userRole === 'admin' && (
                                <button
                                  onClick={() => onDeleteSubmission(sub.id)}
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                                  title="Hapus Data Calon Siswa"
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Tulis Pengumuman */}
        {activeTab === 'pengumuman' && (
          <>
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-emerald-600" />
                Tulis Pengumuman Penting Baru
              </h3>

              {annSuccess && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2 text-xs font-semibold">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Pengumuman berhasil di-upload dan tampil di papan pengumuman!
                </div>
              )}

              <form onSubmit={handleAddAnnouncementSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Judul Pengumuman</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jadwal Pembagian Rapor Semester Genap..."
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                  />
                </div>

                <div className="flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id="ann-important"
                    checked={annIsImportant}
                    onChange={(e) => setAnnIsImportant(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                  />
                  <label htmlFor="ann-important" className="text-xs font-bold text-slate-600 cursor-pointer select-none">
                    Tandai Sebagai "Penting / Darurat" (Muncul di Running Text Header)
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Isi Ringkas Pengumuman</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tulis detail pengumuman yang ingin disampaikan ke seluruh orang tua/siswa..."
                    value={annContent}
                    onChange={(e) => setAnnContent(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50 resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="h-4 w-4" />
                  <span>Kirim & Terbitkan Pengumuman</span>
                </button>
              </form>
            </div>

            {/* Existing Announcements Quick List */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                Papan Pengumuman Aktif
              </h3>

              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 relative overflow-hidden">
                    {ann.isImportant && (
                      <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-bl">
                        PENTING
                      </div>
                    )}
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono mb-1.5">
                          <Calendar className="h-3 w-3" /> {ann.date}
                        </div>
                        <h4 className="font-bold text-xs text-slate-800 leading-snug mb-1">{ann.title}</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed">{ann.content}</p>
                      </div>
                      {userRole === 'admin' && onDeleteAnnouncement && (
                        <button
                          type="button"
                          onClick={() => onDeleteAnnouncement(ann.id)}
                          className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 cursor-pointer shrink-0"
                          title="Hapus Pengumuman"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'profil' && userRole === 'admin' && (
          <div className="lg:col-span-12 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm text-left">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              Edit Kustomisasi Informasi Web Madrasah
            </h3>

            {profSuccess && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2 text-xs font-semibold">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Profil madrasah berhasil diperbarui! Seluruh konten di website (Header, Hero, Sambutan, Kontak, & Footer) telah disesuaikan secara real-time.
              </div>
            )}

            <form onSubmit={handleUpdateProfileSubmit} className="space-y-8">
              {/* Group 1: Identitas Madrasah */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider border-l-4 border-emerald-500 pl-2">
                  1. Identitas Utama & Slogan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Nama Madrasah</label>
                    <input
                      type="text"
                      required
                      value={profileForm.schoolName}
                      onChange={(e) => setProfileForm({ ...profileForm, schoolName: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Slogan / Wilayah Kabupaten</label>
                    <input
                      type="text"
                      required
                      value={profileForm.schoolSlogan}
                      onChange={(e) => setProfileForm({ ...profileForm, schoolSlogan: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Tagline / Headline Utama Hero Section</label>
                    <input
                      type="text"
                      required
                      value={profileForm.headline}
                      onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Deskripsi Singkat (Sambutan Awal Hero Section)</label>
                    <textarea
                      required
                      rows={2}
                      value={profileForm.description}
                      onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50 resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Sambutan Kepala Sekolah */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider border-l-4 border-emerald-500 pl-2">
                  2. Profil & Sambutan Kepala Sekolah
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Nama Lengkap Kepala Sekolah</label>
                    <input
                      type="text"
                      required
                      value={profileForm.principalName}
                      onChange={(e) => setProfileForm({ ...profileForm, principalName: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Jabatan / Role</label>
                    <input
                      type="text"
                      required
                      value={profileForm.principalRole}
                      onChange={(e) => setProfileForm({ ...profileForm, principalRole: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Foto Profil Kepala Sekolah (URL Image)</label>
                    <input
                      type="text"
                      required
                      value={profileForm.principalAvatar}
                      onChange={(e) => setProfileForm({ ...profileForm, principalAvatar: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Isi Teks Sambutan</label>
                  <textarea
                    required
                    rows={4}
                    value={profileForm.principalSpeech}
                    onChange={(e) => setProfileForm({ ...profileForm, principalSpeech: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50 resize-y"
                  />
                </div>
              </div>

              {/* Group 3: Kontak & Alamat Madrasah */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider border-l-4 border-emerald-500 pl-2">
                  3. Kontak & Alamat Operasional
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Nomor Handphone (Tampil di Hubungi Kami)</label>
                    <input
                      type="text"
                      required
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">ID WhatsApp (Format Angka Saja, misal: 6285320054921)</label>
                    <input
                      type="text"
                      required
                      value={profileForm.whatsapp}
                      onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Email Resmi Madrasah</label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Alamat Lengkap Madrasah</label>
                  <input
                    type="text"
                    required
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Group 4: Deskripsi Poin Keunggulan (Bento Grid) */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider border-l-4 border-emerald-500 pl-2">
                  4. Penjelasan 4 Poin Mutu & Keunggulan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Poin 1: Akreditasi Madrasah (Penjelasan singkat)</label>
                    <input
                      type="text"
                      required
                      value={profileForm.statAcreditation}
                      onChange={(e) => setProfileForm({ ...profileForm, statAcreditation: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Poin 2: Pendidikan Akhlak & Adab (Penjelasan singkat)</label>
                    <input
                      type="text"
                      required
                      value={profileForm.statAdab}
                      onChange={(e) => setProfileForm({ ...profileForm, statAdab: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Poin 3: Guru & Pengajar Ramah Anak (Penjelasan singkat)</label>
                    <input
                      type="text"
                      required
                      value={profileForm.statTeachers}
                      onChange={(e) => setProfileForm({ ...profileForm, statTeachers: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Poin 4: Target Hafalan Juz Amma (Penjelasan singkat)</label>
                    <input
                      type="text"
                      required
                      value={profileForm.statTahfidz}
                      onChange={(e) => setProfileForm({ ...profileForm, statTahfidz: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Group 5: Kontrol Akses Menu Pengunjung */}
              <div className="space-y-4 pt-4 border-t border-slate-100 text-left">
                <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider border-l-4 border-emerald-500 pl-2">
                  5. Kontrol Akses Menu Pengunjung Website
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tentukan jalur mana saja yang aktif dan dapat diakses oleh pengunjung umum di beranda utama (Saya Orang Tua, Saya Calon Siswa, Saya Alumni).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={profileForm.isParentAccessActive !== false}
                      onChange={(e) => setProfileForm({ ...profileForm, isParentAccessActive: e.target.checked })}
                      className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <div>
                      <span className="block text-xs font-bold text-slate-800">Akses Orang Tua Siswa</span>
                      <span className="block text-[10px] text-slate-400">Tampilkan / sembunyikan komitmen orang tua</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={profileForm.isStudentAccessActive !== false}
                      onChange={(e) => setProfileForm({ ...profileForm, isStudentAccessActive: e.target.checked })}
                      className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <div>
                      <span className="block text-xs font-bold text-slate-800">Akses Calon Siswa</span>
                      <span className="block text-[10px] text-slate-400">Tampilkan / sembunyikan program siswa</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={profileForm.isAlumniAccessActive !== false}
                      onChange={(e) => setProfileForm({ ...profileForm, isAlumniAccessActive: e.target.checked })}
                      className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <div>
                      <span className="block text-xs font-bold text-slate-800">Akses Jalur Alumni</span>
                      <span className="block text-[10px] text-slate-400">Tampilkan / sembunyikan program alumni</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Group 6: Manajemen Keamanan & Hak Akses Portal */}
              <div className="space-y-4 pt-6 border-t border-slate-100 text-left">
                <h4 className="text-sm font-bold text-amber-800 uppercase tracking-wider border-l-4 border-amber-500 pl-2">
                  6. Manajemen Keamanan & Hak Akses Portal
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Super Admin Terdaftar</label>
                      <input
                        type="text"
                        value={profileForm.registeredAdmins ? profileForm.registeredAdmins.join(', ') : 'sopyancepi@gmail.com'}
                        onChange={(e) => {
                          const emails = e.target.value.split(',').map(em => em.trim().toLowerCase()).filter(Boolean);
                          setProfileForm({ ...profileForm, registeredAdmins: emails });
                        }}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                        placeholder="Contoh: sopyancepi@gmail.com, admin@sekolah.sch.id"
                      />
                      <span className="text-[10px] text-slate-400 block mt-1">Super Admin berhak mengonfigurasi website dan menghapus seluruh postingan. Pisahkan dengan tanda koma `,` jika lebih dari satu.</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">PIN Guru & Staf</label>
                      <input
                        type="text"
                        value={profileForm.guruPin || '123456'}
                        onChange={(e) => setProfileForm({ ...profileForm, guruPin: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-mono text-center tracking-widest"
                        maxLength={12}
                        required
                      />
                      <span className="text-[10px] text-slate-400 block mt-1">PIN akses dasar untuk seluruh guru.</span>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">PIN Super Admin</label>
                      <input
                        type="text"
                        value={profileForm.adminPin || '999888'}
                        onChange={(e) => setProfileForm({ ...profileForm, adminPin: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-mono text-center tracking-widest"
                        maxLength={12}
                        required
                      />
                      <span className="text-[10px] text-slate-400 block mt-1">PIN akses konfigurasi Super Admin.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-slate-900 rounded-xl shadow-xl shadow-emerald-950/20 transition-all hover:-translate-y-0.5 cursor-pointer flex items-center gap-2.5 animate-pulse"
                >
                  <Send className="h-4 w-4 text-amber-400" />
                  <span>Simpan & Publikasikan Perubahan Web</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
