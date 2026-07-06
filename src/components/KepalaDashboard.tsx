import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Newspaper, 
  Building, 
  Megaphone, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Calendar, 
  Settings, 
  LogOut, 
  LayoutGrid, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Sparkles, 
  ChevronRight, 
  Info, 
  CheckCircle, 
  X, 
  FileText, 
  AlertCircle
} from 'lucide-react';
import { 
  SchoolProfile, 
  Teacher, 
  Activity, 
  Facility, 
  Announcement, 
  KabarKelas, 
  PPDBSubmission 
} from '../types';

interface KepalaDashboardProps {
  schoolProfile?: SchoolProfile;
  teachers?: Teacher[];
  activities?: Activity[]; // News
  facilities?: Facility[];
  announcements?: Announcement[];
  kabarKelas?: KabarKelas[];
  submissions?: PPDBSubmission[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  firebaseStatus?: 'loading' | 'connected' | 'error';
}

export const KepalaDashboard: React.FC<KepalaDashboardProps> = ({
  schoolProfile,
  teachers = [],
  activities = [],
  facilities = [],
  announcements = [],
  kabarKelas = [],
  submissions = [],
  activeTab,
  setActiveTab,
  firebaseStatus = 'connected'
}) => {
  // PPDB Search & Filter State
  const [ppdbSearch, setPpdbSearch] = useState('');
  const [ppdbFilterStatus, setPpdbFilterStatus] = useState<string>('Semua');
  const [ppdbFilterGrade, setPpdbFilterGrade] = useState<string>('Semua');
  const [selectedSubmission, setSelectedSubmission] = useState<PPDBSubmission | null>(null);

  // Kabar Kelas Filter State
  const [kabarSearch, setKabarSearch] = useState('');
  const [kabarClassFilter, setKabarClassFilter] = useState('Semua');

  // Berita/News Search State
  const [newsSearch, setNewsSearch] = useState('');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState('Semua');

  // Unified Timeline Activities (Aktivitas Terbaru)
  const timelineActivities = useMemo(() => {
    const list: Array<{
      id: string;
      type: 'kabar_kelas' | 'berita' | 'pengumuman' | 'fasilitas';
      title: string;
      description: string;
      date: string;
      actor: string;
    }> = [];

    // 1. Kabar Kelas
    kabarKelas.forEach(kk => {
      list.push({
        id: `kk-${kk.id}`,
        type: 'kabar_kelas',
        title: `Kabar Kelas: ${kk.title}`,
        description: `Guru membagikan kegiatan pembelajaran kelas untuk ${kk.className}.`,
        date: kk.date,
        actor: kk.authorName || 'Ustadz/Ustadzah'
      });
    });

    // 2. Berita / Kegiatan
    activities.forEach(act => {
      list.push({
        id: `act-${act.id}`,
        type: 'berita',
        title: `Berita Baru: ${act.title}`,
        description: `Publikasi artikel di kategori "${act.category}".`,
        date: act.date,
        actor: act.author || 'Admin Portal'
      });
    });

    // 3. Pengumuman
    announcements.forEach(ann => {
      list.push({
        id: `ann-${ann.id}`,
        type: 'pengumuman',
        title: `Pengumuman: ${ann.title}`,
        description: ann.isImportant ? 'Pengumuman penting diterbitkan untuk seluruh wali murid.' : 'Pengumuman umum diterbitkan.',
        date: ann.date,
        actor: 'Administrator'
      });
    });

    // Sort descending by date
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [kabarKelas, activities, announcements]);

  // Read-only filter for PPDB
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      const matchSearch = 
        sub.studentName.toLowerCase().includes(ppdbSearch.toLowerCase()) ||
        sub.parentName.toLowerCase().includes(ppdbSearch.toLowerCase()) ||
        sub.email.toLowerCase().includes(ppdbSearch.toLowerCase());
      
      const matchStatus = ppdbFilterStatus === 'Semua' || sub.status === ppdbFilterStatus;
      const matchGrade = ppdbFilterGrade === 'Semua' || sub.grade === ppdbFilterGrade;

      return matchSearch && matchStatus && matchGrade;
    });
  }, [submissions, ppdbSearch, ppdbFilterStatus, ppdbFilterGrade]);

  // Read-only filter for Kabar Kelas
  const filteredKabarKelas = useMemo(() => {
    return kabarKelas.filter(kk => {
      const matchSearch = kk.title.toLowerCase().includes(kabarSearch.toLowerCase()) || kk.content.toLowerCase().includes(kabarSearch.toLowerCase());
      const matchClass = kabarClassFilter === 'Semua' || kk.className === kabarClassFilter;
      return matchSearch && matchClass;
    });
  }, [kabarKelas, kabarSearch, kabarClassFilter]);

  // Read-only filter for News
  const filteredNews = useMemo(() => {
    return activities.filter(act => {
      const matchSearch = act.title.toLowerCase().includes(newsSearch.toLowerCase()) || act.description.toLowerCase().includes(newsSearch.toLowerCase());
      const matchCategory = newsCategoryFilter === 'Semua' || act.category === newsCategoryFilter;
      return matchSearch && matchCategory;
    });
  }, [activities, newsSearch, newsCategoryFilter]);

  // Statistical calculations
  const statsPPDB = useMemo(() => {
    const total = submissions.length;
    const pending = submissions.filter(s => s.status === 'Menunggu Review').length;
    const interview = submissions.filter(s => s.status === 'Jadwal Wawancara').length;
    const accepted = submissions.filter(s => s.status === 'Diterima').length;
    const rejected = submissions.filter(s => s.status === 'Ditolak').length;

    return { total, pending, interview, accepted, rejected };
  }, [submissions]);

  // Interactive Academic Agenda
  const agendaList = [
    { date: '2026-07-10', title: 'Rapat Kerja Kepala & Guru MI Cibungur I', type: 'internal', desc: 'Evaluasi program dan pembagian kurikulum baru.' },
    { date: '2026-07-15', title: 'Masa Ta\'aruf Siswa Baru (MATSAMA)', type: 'siswa', desc: 'Pengenalan lingkungan madrasah, tata tertib, dan program pembiasaan akhlak.' },
    { date: '2026-07-20', title: 'Awal KBM Semester Ganjil TA 2026/2027', type: 'akademik', desc: 'Memulai proses belajar mengajar tatap muka.' },
    { date: '2026-08-17', title: 'Peringatan Hari Kemerdekaan RI ke-81', type: 'kegiatan', desc: 'Upacara bendera gabungan dan aneka perlombaan madrasah.' },
    { date: '2026-09-05', title: 'Simulasi Assesmen Nasional (ANBK)', type: 'akademik', desc: 'Uji coba infrastruktur dan kesiapan siswa Kelas V.' },
    { date: '2026-09-12', title: 'Maulid Nabi Muhammad SAW 1448 H', type: 'keagamaan', desc: 'Tabligh akbar siswa dan santunan yatim piatu dhuafa.' },
    { date: '2026-10-05', title: 'Asesmen Tengah Semester (ATS) Ganjil', type: 'akademik', desc: 'Evaluasi hasil belajar paruh pertama semester.' },
    { date: '2026-11-25', title: 'Hari Guru Nasional & Tasyakuran', type: 'kegiatan', desc: 'Apresiasi murid untuk dewan asatidzah MI Cibungur I.' }
  ];

  return (
    <div className="w-full">
      {/* 1. VIEW: DASHBOARD HOME */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Principal Welcome Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden border border-emerald-900/40 text-left">
            <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500 rounded-full blur-3xl opacity-15 transform translate-x-12 -translate-y-12" />
            <div className="absolute bottom-0 left-0 h-32 w-32 bg-amber-500 rounded-full blur-3xl opacity-10 transform -translate-x-8 translate-y-8" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1">
                  <Award className="h-3 w-3" /> Kepala Madrasah Portal
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Assalamu'alaikum, Bapak Kepala Madrasah!
                </h3>
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-3xl">
                  Selamat datang di panel khusus monitoring <strong>Bapak {schoolProfile?.principalName || 'Kepala Madrasah'}</strong>. Panel ini menyajikan statistik performa madrasah, memantau pendaftar PPDB, aktivitas pengajaran guru, berita, serta pengumuman secara real-time untuk mendukung pengambilan keputusan strategis.
                </p>
              </div>

              {/* Quick Status Pill */}
              <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 p-4 rounded-2xl flex items-center gap-3 shrink-0">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sesi Monitoring</p>
                  <p className="text-xs font-black text-white mt-0.5">Real-time Aktif</p>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Row (6 Cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Card 1: Jumlah Guru */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm text-left">
              <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <GraduationCap className="h-4.5 w-4.5" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Jumlah Guru</p>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight mt-1">{teachers.length} Orang</h4>
            </div>

            {/* Card 2: Berita Terbaru */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm text-left">
              <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
                <Newspaper className="h-4.5 w-4.5" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Jumlah Berita</p>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight mt-1">{activities.length} Artikel</h4>
            </div>

            {/* Card 3: Fasilitas */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm text-left">
              <div className="h-9 w-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
                <Building className="h-4.5 w-4.5" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Fasilitas Kampus</p>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight mt-1">{facilities.length} Ruang</h4>
            </div>

            {/* Card 4: Pengumuman */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm text-left">
              <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
                <Megaphone className="h-4.5 w-4.5" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Pengumuman</p>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight mt-1">{announcements.length} Memo</h4>
            </div>

            {/* Card 5: Kabar Kelas */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm text-left">
              <div className="h-9 w-9 rounded-xl bg-pink-50 flex items-center justify-center text-pink-700">
                <BookOpen className="h-4.5 w-4.5" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Kabar Kelas</p>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight mt-1">{kabarKelas.length} Berita</h4>
            </div>

            {/* Card 6: PPDB */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm text-left relative overflow-hidden">
              <div className="h-9 w-9 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-700">
                <Users className="h-4.5 w-4.5" />
              </div>
              {submissions.filter(s => s.status === 'Menunggu Review').length > 0 && (
                <span className="absolute top-4 right-4 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full animate-bounce">
                  {submissions.filter(s => s.status === 'Menunggu Review').length}
                </span>
              )}
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">PPDB {schoolProfile?.ppdbYear || '2026'}</p>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight mt-1">{submissions.length} Pendaftar</h4>
            </div>
          </div>

          {/* Split Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* Left Column: Aktivitas Terbaru Timeline */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-emerald-600" />
                    Alur Aktivitas Terbaru (Log Sistem)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">Daftar kegiatan publikasi di website real-time</p>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-full">
                  {timelineActivities.length} Riwayat Terdeteksi
                </span>
              </div>

              {timelineActivities.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Info className="mx-auto h-12 w-12 opacity-30 mb-2" />
                  <p className="text-xs font-bold">Belum ada aktivitas yang tercatat</p>
                </div>
              ) : (
                <div className="relative border-l border-slate-200 ml-4 pl-6 space-y-6 py-2">
                  {timelineActivities.slice(0, 10).map((act, index) => {
                    let dotColor = 'bg-slate-400';
                    let typeLabel = '';

                    if (act.type === 'kabar_kelas') {
                      dotColor = 'bg-pink-500 ring-4 ring-pink-100';
                      typeLabel = 'Kabar Kelas';
                    } else if (act.type === 'berita') {
                      dotColor = 'bg-blue-500 ring-4 ring-blue-100';
                      typeLabel = 'Berita/Kegiatan';
                    } else if (act.type === 'pengumuman') {
                      dotColor = 'bg-amber-500 ring-4 ring-amber-100';
                      typeLabel = 'Pengumuman';
                    }

                    return (
                      <div key={act.id} className="relative group">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full ${dotColor} transition-all`} />
                        
                        <div className="space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                              {act.title}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                              <span>📅 {act.date}</span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100">{typeLabel}</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {act.description}
                          </p>
                          <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 pt-1">
                            <User className="h-3 w-3" /> Oleh: <span className="text-slate-600">{act.actor}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: PPDB Fast Stats & Settings Info */}
            <div className="lg:col-span-4 space-y-6">
              {/* PPDB Summary Info Card */}
              <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 text-left">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Users className="h-4.5 w-4.5 text-emerald-600" />
                  Informasi PPDB Real-time
                </h4>
                
                <div className="space-y-4">
                  {/* Status Indicator */}
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Status PPDB Website</p>
                      <h5 className="text-sm font-black text-emerald-950 mt-1">
                        {schoolProfile?.isStudentAccessActive ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'}
                      </h5>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${schoolProfile?.isStudentAccessActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  </div>

                  {/* PPDB Registration Dates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tanggal Dibuka</p>
                      <p className="text-xs font-black text-slate-700 mt-1">1 Maret 2026</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tanggal Ditutup</p>
                      <p className="text-xs font-black text-slate-700 mt-1">31 Agustus 2026</p>
                    </div>
                  </div>

                  {/* PPDB Status breakdown progress bar */}
                  <div className="space-y-3 pt-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progres Penerimaan Siswa</p>
                    
                    <div className="space-y-2">
                      {/* Diterima */}
                      <div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                          <span>Diterima ({statsPPDB.accepted} Siswa)</span>
                          <span>{submissions.length > 0 ? Math.round((statsPPDB.accepted / submissions.length) * 100) : 0}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${submissions.length > 0 ? (statsPPDB.accepted / submissions.length) * 100 : 0}%` }} />
                        </div>
                      </div>

                      {/* Menunggu Review */}
                      <div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                          <span>Menunggu Review ({statsPPDB.pending} Siswa)</span>
                          <span>{submissions.length > 0 ? Math.round((statsPPDB.pending / submissions.length) * 100) : 0}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: `${submissions.length > 0 ? (statsPPDB.pending / submissions.length) * 100 : 0}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab('pendaftar')}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-emerald-950 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>Buka Rincian Pendaftar PPDB</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Database Status Sync */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm text-left">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    Status Database Sekolah
                  </h4>
                  {firebaseStatus === 'connected' ? (
                    <span className="bg-emerald-100 text-emerald-800 text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase">Online</span>
                  ) : (
                    <span className="bg-amber-100 text-amber-800 text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase">Offline</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {firebaseStatus === 'connected' 
                    ? 'Anda terhubung langsung dengan Google Cloud Firestore. Seluruh dashboard menyajikan data madrasah ter-update.'
                    : 'Aplikasi berjalan dalam mode offline lokal. Data disajikan secara aman dari cache lokal web browser Anda.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick News & Announcements Preview Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
            {/* Berita/Kegiatan Terbaru Card (Max 5) */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Newspaper className="h-5 w-5 text-blue-600" />
                    Berita & Kegiatan Terbaru
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">Maksimal 5 publikasi artikel kegiatan madrasah</p>
                </div>
                <button 
                  onClick={() => setActiveTab('kegiatan')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer"
                >
                  Semua Berita
                </button>
              </div>

              {activities.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">Belum ada berita terbit</div>
              ) : (
                <div className="space-y-4">
                  {activities.slice(0, 5).map(act => (
                    <div key={act.id} className="p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/40 rounded-2xl flex gap-3 transition-colors">
                      {act.image && (
                        <div className="h-14 w-20 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                          <img src={act.image} alt="Berita" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] font-extrabold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                            {act.category}
                          </span>
                          <span className="text-[10px] text-slate-400">📅 {act.date}</span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-950 truncate">{act.title}</h5>
                        <p className="text-[10px] text-slate-400 font-bold truncate">Oleh: {act.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pengumuman Terbaru Card (Max 5) */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-amber-600" />
                    Memo & Pengumuman Terbaru
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">Maksimal 5 maklumat penting dari madrasah</p>
                </div>
                <button 
                  onClick={() => setActiveTab('pengumuman')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer"
                >
                  Semua Memo
                </button>
              </div>

              {announcements.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">Belum ada pengumuman terbit</div>
              ) : (
                <div className="space-y-4">
                  {announcements.slice(0, 5).map(ann => (
                    <div key={ann.id} className={`p-3.5 border rounded-2xl space-y-2 text-left transition-colors ${
                      ann.isImportant 
                        ? 'bg-rose-50/40 border-rose-100 hover:bg-rose-50' 
                        : 'bg-slate-50/50 border-slate-200/40 hover:bg-slate-50'
                    }`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {ann.isImportant && (
                            <span className="bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase">PENTING</span>
                          )}
                          <h5 className="text-xs font-bold text-slate-950 truncate max-w-[200px]">{ann.title}</h5>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">📅 {ann.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                        {ann.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. VIEW: STATISTIK SEKOLAH */}
      {activeTab === 'statistik' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 text-left">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Panel Statistik & Visualisasi Data Sekolah
            </h3>
            <p className="text-xs text-slate-400 mt-1">Monitoring representatif jumlah murid, keaktifan guru, dan publikasi website secara visual</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* PPDB Distribution Chart */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-1.5">
                📊 Progres Registrasi PPDB
              </h4>
              
              <div className="space-y-5">
                {/* Visual Horizontal Stacked Progress Bar */}
                <div className="w-full bg-slate-100 h-8 rounded-2xl flex overflow-hidden border border-slate-200/50 p-1">
                  {/* Accepted (Emerald) */}
                  {statsPPDB.accepted > 0 && (
                    <div 
                      className="bg-emerald-500 h-full rounded-l-xl transition-all duration-500"
                      style={{ width: `${(statsPPDB.accepted / submissions.length) * 100}%` }}
                      title={`Diterima: ${statsPPDB.accepted}`}
                    />
                  )}
                  {/* Interview (Blue) */}
                  {statsPPDB.interview > 0 && (
                    <div 
                      className="bg-blue-500 h-full transition-all duration-500"
                      style={{ width: `${(statsPPDB.interview / submissions.length) * 100}%` }}
                      title={`Wawancara: ${statsPPDB.interview}`}
                    />
                  )}
                  {/* Pending (Amber) */}
                  {statsPPDB.pending > 0 && (
                    <div 
                      className="bg-amber-500 h-full transition-all duration-500"
                      style={{ width: `${(statsPPDB.pending / submissions.length) * 100}%` }}
                      title={`Review: ${statsPPDB.pending}`}
                    />
                  )}
                  {/* Rejected (Rose) */}
                  {statsPPDB.rejected > 0 && (
                    <div 
                      className="bg-rose-500 h-full rounded-r-xl transition-all duration-500"
                      style={{ width: `${(statsPPDB.rejected / submissions.length) * 100}%` }}
                      title={`Ditolak: ${statsPPDB.rejected}`}
                    />
                  )}
                </div>

                {/* Status List with Numbers & Percentage */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 bg-slate-50 border border-slate-200/40 rounded-2xl flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Diterima</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">
                        {statsPPDB.accepted} Siswa <span className="text-slate-400 font-normal">({submissions.length > 0 ? Math.round((statsPPDB.accepted / submissions.length) * 100) : 0}%)</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200/40 rounded-2xl flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wawancara</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">
                        {statsPPDB.interview} Siswa <span className="text-slate-400 font-normal">({submissions.length > 0 ? Math.round((statsPPDB.interview / submissions.length) * 100) : 0}%)</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200/40 rounded-2xl flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Menunggu Review</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">
                        {statsPPDB.pending} Siswa <span className="text-slate-400 font-normal">({submissions.length > 0 ? Math.round((statsPPDB.pending / submissions.length) * 100) : 0}%)</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200/40 rounded-2xl flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-rose-500" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ditolak</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">
                        {statsPPDB.rejected} Siswa <span className="text-slate-400 font-normal">({submissions.length > 0 ? Math.round((statsPPDB.rejected / submissions.length) * 100) : 0}%)</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kabar Kelas Distribution per Class */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-1.5">
                📊 Keaktifan Kabar Kelas (Per Kelas)
              </h4>

              <div className="space-y-4">
                {['Kelas I', 'Kelas II', 'Kelas III', 'Kelas IV', 'Kelas V', 'Kelas VI'].map((className) => {
                  const count = kabarKelas.filter(k => k.className === className).length;
                  const maxCount = Math.max(...['Kelas I', 'Kelas II', 'Kelas III', 'Kelas IV', 'Kelas V', 'Kelas VI'].map(cn => kabarKelas.filter(k => k.className === cn).length), 1);
                  const percentage = (count / maxCount) * 100;

                  return (
                    <div key={className} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{className}</span>
                        <span>{count} Berita</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-pink-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${percentage}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* News & Content Volume */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-1.5">
                📈 Komparasi Volume Konten Website
              </h4>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Simple SVG Pie Chart */}
                <div className="relative h-32 w-32 shrink-0">
                  <svg viewBox="0 0 36 36" className="h-full w-full transform -rotate-90">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                    
                    {/* News Portion (Blue) */}
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="15.915" 
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="3.2" 
                      strokeDasharray={`${(activities.length / (activities.length + announcements.length + kabarKelas.length || 1)) * 100} ${100 - (activities.length / (activities.length + announcements.length + kabarKelas.length || 1)) * 100}`}
                      strokeDashoffset="0" 
                    />
                    
                    {/* Announcements Portion (Amber) */}
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="15.915" 
                      fill="none" 
                      stroke="#f59e0b" 
                      strokeWidth="3.2" 
                      strokeDasharray={`${(announcements.length / (activities.length + announcements.length + kabarKelas.length || 1)) * 100} ${100 - (announcements.length / (activities.length + announcements.length + kabarKelas.length || 1)) * 100}`}
                      strokeDashoffset={`-${(activities.length / (activities.length + announcements.length + kabarKelas.length || 1)) * 100}`} 
                    />

                    {/* Kabar Kelas (Pink) */}
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="15.915" 
                      fill="none" 
                      stroke="#ec4899" 
                      strokeWidth="3.2" 
                      strokeDasharray={`${(kabarKelas.length / (activities.length + announcements.length + kabarKelas.length || 1)) * 100} ${100 - (kabarKelas.length / (activities.length + announcements.length + kabarKelas.length || 1)) * 100}`}
                      strokeDashoffset={`-${((activities.length + announcements.length) / (activities.length + announcements.length + kabarKelas.length || 1)) * 100}`} 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-slate-800">{activities.length + announcements.length + kabarKelas.length}</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 w-full">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Berita (News)</span>
                    <span>{activities.length} Post</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Pengumuman</span>
                    <span>{announcements.length} Post</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-pink-500" /> Kabar Kelas</span>
                    <span>{kabarKelas.length} Post</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Status Break-down */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-1.5">
                👥 Status Aktif Dewan Guru & Staf
              </h4>

              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-4 border border-slate-200/30 rounded-2xl">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guru Status Aktif</span>
                    <p className="text-base font-black text-emerald-700 mt-0.5">
                      {teachers.filter(t => t.status === 'Aktif' || !t.status).length} Orang
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-800">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-4 border border-slate-200/30 rounded-2xl">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guru Status Cuti / Izin</span>
                    <p className="text-base font-black text-amber-600 mt-0.5">
                      {teachers.filter(t => t.status && t.status !== 'Aktif').length} Orang
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700">
                    <Info className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. VIEW: PPDB MONITORING (READ ONLY) */}
      {activeTab === 'pendaftar' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" />
                Registrasi Calon Siswa Baru (PPDB)
              </h3>
              <p className="text-xs text-slate-400 mt-1">Status Keamanan: 🛡️ Hak Akses View-Only Kepala Madrasah (Tidak dapat mengubah/menghapus data)</p>
            </div>
            <div className="bg-amber-50 border border-amber-200/50 text-amber-800 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full inline-block">
              ⚠️ Mode Baca Saja Aktif
            </div>
          </div>

          {/* Search and filter controls */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  value={ppdbSearch}
                  onChange={(e) => setPpdbSearch(e.target.value)}
                  placeholder="Cari Nama Siswa/Wali..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                <select 
                  value={ppdbFilterStatus}
                  onChange={(e) => setPpdbFilterStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Menunggu Review">Menunggu Review</option>
                  <option value="Jadwal Wawancara">Jadwal Wawancara</option>
                  <option value="Diterima">Diterima</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
              </div>

              {/* Grade Filter */}
              <select 
                value={ppdbFilterGrade}
                onChange={(e) => setPpdbFilterGrade(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all cursor-pointer"
              >
                <option value="Semua">Semua Pilihan Kelas</option>
                <option value="Kelas 1 MI (Baru)">Kelas 1 MI (Baru)</option>
                <option value="Kelas 2-3 (Pindahan)">Kelas 2-3 (Pindahan)</option>
                <option value="Kelas 4-5 (Pindahan)">Kelas 4-5 (Pindahan)</option>
              </select>
            </div>
          </div>

          {/* List/Table view */}
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden text-left">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
                    <th className="px-6 py-4">No</th>
                    <th className="px-6 py-4">Calon Siswa</th>
                    <th className="px-6 py-4">Wali Murid</th>
                    <th className="px-6 py-4">Pilihan Kelas</th>
                    <th className="px-6 py-4">Tanggal Daftar</th>
                    <th className="px-6 py-4">Status PPDB</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400 font-bold">
                        Tidak ada pendaftar yang cocok dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((sub, idx) => {
                      let statusBadge = '';
                      if (sub.status === 'Menunggu Review') {
                        statusBadge = 'bg-amber-100 text-amber-800 border-amber-200';
                      } else if (sub.status === 'Jadwal Wawancara') {
                        statusBadge = 'bg-blue-100 text-blue-800 border-blue-200';
                      } else if (sub.status === 'Diterima') {
                        statusBadge = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                      } else {
                        statusBadge = 'bg-rose-100 text-rose-800 border-rose-200';
                      }

                      return (
                        <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-400">{idx + 1}</td>
                          <td className="px-6 py-4 font-extrabold text-slate-900">{sub.studentName}</td>
                          <td className="px-6 py-4">
                            <div>{sub.parentName}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{sub.phone}</div>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-600">{sub.grade}</td>
                          <td className="px-6 py-4 font-mono text-slate-500">{sub.date}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full border text-[9px] font-extrabold uppercase ${statusBadge}`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button 
                              onClick={() => setSelectedSubmission(sub)}
                              className="px-3 py-1.5 bg-slate-900 text-white hover:bg-emerald-800 text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                            >
                              Periksa Detail
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Student details inspection modal */}
          {selectedSubmission && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
              <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 text-left">
                {/* Header */}
                <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-black">Detail Registrasi Siswa</h4>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">ID Pendaftar: {selectedSubmission.id}</p>
                  </div>
                  <button onClick={() => setSelectedSubmission(null)} className="text-slate-400 hover:text-white cursor-pointer">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 overflow-y-auto max-h-[450px]">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Nama Calon Siswa</p>
                      <p className="text-xs font-black text-slate-900 mt-1">{selectedSubmission.studentName}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Pilihan Kelas</p>
                      <p className="text-xs font-black text-slate-900 mt-1">{selectedSubmission.grade}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Nama Orang Tua / Wali</p>
                      <p className="text-xs font-bold text-slate-800 mt-1">{selectedSubmission.parentName}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Asal Sekolah Sebelumnya</p>
                      <p className="text-xs font-bold text-slate-800 mt-1">{selectedSubmission.prevSchool || '-'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Nomor Kontak WhatsApp</p>
                      <p className="text-xs font-bold text-slate-800 mt-1">{selectedSubmission.phone}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Alamat Email Wali</p>
                      <p className="text-xs font-bold text-slate-800 mt-1">{selectedSubmission.email || '-'}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tanggal & Waktu Daftar</p>
                    <p className="text-xs font-mono text-slate-700 mt-1">{selectedSubmission.date}</p>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Catatan Tambahan Pendaftar</p>
                    <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl text-xs mt-1 text-slate-600 italic">
                      {selectedSubmission.notes || 'Tidak ada catatan khusus.'}
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status Kelulusan</p>
                    <span className={`inline-block px-3 py-1 text-xs font-extrabold uppercase rounded-full mt-1 border ${
                      selectedSubmission.status === 'Diterima' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      selectedSubmission.status === 'Jadwal Wawancara' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      selectedSubmission.status === 'Menunggu Review' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {selectedSubmission.status}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => setSelectedSubmission(null)}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Selesai Memeriksa
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. VIEW: PENGUMUMAN (READ ONLY) */}
      {activeTab === 'pengumuman' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 flex items-center justify-between text-left">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-emerald-600" />
                Semua Memo & Pengumuman Sekolah
              </h3>
              <p className="text-xs text-slate-400 mt-1">Daftar maklumat penting dan memo dinas yang diterbitkan madrasah</p>
            </div>
            <span className="bg-amber-50 text-amber-800 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full">
              Mode Monitor
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 text-left">
            {announcements.length === 0 ? (
              <div className="bg-white p-12 text-center text-slate-400 border border-slate-200 rounded-3xl">
                <Info className="mx-auto h-12 w-12 opacity-30 mb-2" />
                <p className="text-sm font-bold">Belum ada pengumuman yang diterbitkan</p>
              </div>
            ) : (
              announcements.map(ann => (
                <div key={ann.id} className={`p-6 bg-white rounded-3xl border shadow-sm space-y-3 relative overflow-hidden ${
                  ann.isImportant ? 'border-rose-200 ring-1 ring-rose-100' : 'border-slate-200/60'
                }`}>
                  {ann.isImportant && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {ann.isImportant && (
                        <span className="bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase">URGENT</span>
                      )}
                      <h4 className="text-sm font-black text-slate-900">{ann.title}</h4>
                    </div>
                    <span className="text-xs text-slate-400 font-bold">📅 {ann.date}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {ann.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. VIEW: BERITA TERBARU (READ ONLY) */}
      {activeTab === 'kegiatan' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-emerald-600" />
                Katalog Berita & Kegiatan Siswa
              </h3>
              <p className="text-xs text-slate-400 mt-1">Daftar artikel publikasi kegiatan madrasah di website publik</p>
            </div>
            <span className="bg-amber-50 text-amber-800 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full inline-block">
              Mode Monitor
            </span>
          </div>

          {/* Search bar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  value={newsSearch}
                  onChange={(e) => setNewsSearch(e.target.value)}
                  placeholder="Cari berita berdasarkan judul..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all"
                />
              </div>

              <select 
                value={newsCategoryFilter}
                onChange={(e) => setNewsCategoryFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all cursor-pointer"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Akademik">Akademik</option>
                <option value="Prestasi">Prestasi</option>
                <option value="Ekskul">Ekskul</option>
                <option value="Sosial">Sosial</option>
                <option value="Keagamaan">Keagamaan</option>
              </select>
            </div>
          </div>

          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {filteredNews.length === 0 ? (
              <div className="col-span-3 bg-white p-12 text-center text-slate-400 border border-slate-200 rounded-3xl">
                <p className="text-sm font-bold">Tidak ada berita yang ditemukan</p>
              </div>
            ) : (
              filteredNews.map(act => (
                <div key={act.id} className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col h-full">
                  {act.image && (
                    <div className="h-44 w-full overflow-hidden border-b border-slate-100">
                      <img src={act.image} alt={act.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-extrabold">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded uppercase tracking-wider">{act.category}</span>
                        <span>📅 {act.date}</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 leading-snug line-clamp-2">{act.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{act.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400 font-bold">
                      <User className="h-3.5 w-3.5" />
                      <span>Penulis: <span className="text-slate-600">{act.author}</span></span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 6. VIEW: AGENDA SEKOLAH */}
      {activeTab === 'agenda' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 text-left">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-600" />
              Kalender & Agenda Pendidikan MI Cibungur I
            </h3>
            <p className="text-xs text-slate-400 mt-1">Rencana jadwal program, asesmen, liburan sekolah, serta hari besar keagamaan tahun pelajaran 2026/2027</p>
          </div>

          {/* Agenda Timeline List */}
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 text-left space-y-6">
            <div className="border-l-2 border-emerald-500 pl-6 ml-2 space-y-8 relative py-1">
              {agendaList.map((item, index) => {
                let badgeColor = 'bg-slate-100 text-slate-700';
                if (item.type === 'akademik') badgeColor = 'bg-emerald-100 text-emerald-800';
                if (item.type === 'internal') badgeColor = 'bg-amber-100 text-amber-800';
                if (item.type === 'keagamaan') badgeColor = 'bg-purple-100 text-purple-800';
                if (item.type === 'kegiatan') badgeColor = 'bg-rose-100 text-rose-800';

                return (
                  <div key={index} className="relative group">
                    <div className="absolute -left-[32px] top-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                    
                    <div className="space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-sm font-black text-slate-900">{item.title}</span>
                        <div className="flex items-center gap-2 text-[10px] font-extrabold">
                          <span className="text-slate-400">📅 {item.date}</span>
                          <span className={`px-2 py-0.5 rounded uppercase tracking-wider ${badgeColor}`}>{item.type}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 7. VIEW: PROFIL KEPALA MADRASAH (READ ONLY) */}
      {activeTab === 'profil' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 text-left">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Settings className="h-5 w-5 text-emerald-600" />
              Verifikasi Profil & Sambutan Kepala Madrasah
            </h3>
            <p className="text-xs text-slate-400 mt-1">Data profil Anda yang dipublikasikan secara resmi di halaman Beranda website</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* Visual Avatar Card */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-44 w-36 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-md">
                <img 
                  src={schoolProfile?.principalAvatar || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=350&h=440"} 
                  alt="Kepala Madrasah" 
                  className="h-full w-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">{schoolProfile?.principalName || 'Kepala Madrasah'}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{schoolProfile?.principalRole || 'Kepala Madrasah'}</p>
              </div>

              <div className="bg-emerald-50/50 p-3.5 border border-emerald-100 rounded-2xl w-full text-xs text-emerald-800 leading-relaxed font-bold">
                ✨ {schoolProfile?.principalTitle || '"Ikhlas Beramal, Mengabdi Demi Pendidikan Akhlak & Karakter Anak"'}
              </div>
            </div>

            {/* Profile fields and speech */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                  📜 Sambutan Resmi Kepala Madrasah
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed italic whitespace-pre-line">
                  "{schoolProfile?.principalSpeech || ''}"
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  🔑 Kredensial Akses Monitoring Anda
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 border border-slate-200/40 rounded-2xl">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Email Terdaftar</p>
                    <p className="text-xs font-bold text-slate-700 mt-1">{schoolProfile?.principalEmail || 'kepala@cibungur1.sch.id'}</p>
                  </div>

                  <div className="bg-slate-50 p-4 border border-slate-200/40 rounded-2xl">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">PIN Keamanan Portal</p>
                    <p className="text-xs font-mono text-slate-700 mt-1">****** (PIN Terproteksi)</p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200/50 rounded-2xl text-xs text-amber-800 flex gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p className="leading-relaxed">
                    <strong>Pemberitahuan Keamanan:</strong> Demi menghindari modifikasi yang tidak sengaja, perubahan data profil, sambutan, foto, email, dan PIN Kepala Madrasah hanya dapat dilakukan oleh <strong>Super Administrator</strong> melalui menu "Pengaturan Sekolah" di dashboard mereka.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
