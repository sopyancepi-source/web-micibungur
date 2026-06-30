/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  BookOpen, 
  Globe, 
  Award, 
  Cpu, 
  Users, 
  Instagram, 
  Facebook, 
  Youtube, 
  GraduationCap, 
  Calendar,
  Bell,
  ArrowUpRight
} from 'lucide-react';
import Navbar from './components/Navbar';
import PPDBForm from './components/PPDBForm';
import AdminPortal from './components/AdminPortal';
import VirtualTour from './components/VirtualTour';
import StatsSection from './components/StatsSection';
import TestimonialsSection from './components/TestimonialsSection';
import ActivitiesShowcase from './components/ActivitiesShowcase';

import { db } from './lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';

import { Activity, PPDBSubmission, Announcement, Testimonial, SchoolProfile } from './types';
import { 
  INITIAL_ACTIVITIES, 
  INITIAL_FACILITIES, 
  INITIAL_TESTIMONIALS, 
  INITIAL_ANNOUNCEMENTS,
  DEFAULT_SCHOOL_PROFILE
} from './data';

export default function App() {
  const [currentView, setView] = useState<string>('beranda');
  const [audienceTrack, setAudienceTrack] = useState<'parent' | 'student' | 'alumni'>('parent');

  const [firebaseStatus, setFirebaseStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  // Load state from LocalStorage or fall back to Initial Mock Data
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('school_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [submissions, setSubmissions] = useState<PPDBSubmission[]>(() => {
    const saved = localStorage.getItem('school_ppdb_submissions');
    return saved ? JSON.parse(saved) : [];
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('school_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    const saved = localStorage.getItem('school_profile');
    if (saved) {
      try {
        // Merge with DEFAULT_SCHOOL_PROFILE to make sure any newly added fields exist
        return { ...DEFAULT_SCHOOL_PROFILE, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_SCHOOL_PROFILE;
      }
    }
    return DEFAULT_SCHOOL_PROFILE;
  });

  // Try to load and seed Firebase on Mount
  useEffect(() => {
    async function loadDataFromFirebase() {
      try {
        // 1. Fetch school profile
        const profileRef = doc(db, 'school_profile', 'main_profile');
        const profileSnap = await getDoc(profileRef);
        let activeProfile = DEFAULT_SCHOOL_PROFILE;
        if (profileSnap.exists()) {
          activeProfile = { ...DEFAULT_SCHOOL_PROFILE, ...profileSnap.data() } as SchoolProfile;
          setSchoolProfile(activeProfile);
        } else {
          // Seed default profile to user's Firestore!
          await setDoc(profileRef, DEFAULT_SCHOOL_PROFILE);
          setSchoolProfile(DEFAULT_SCHOOL_PROFILE);
        }

        // 2. Fetch activities
        const activitiesCol = collection(db, 'activities');
        const activitiesSnap = await getDocs(activitiesCol);
        let activeActivities: Activity[] = [];
        if (!activitiesSnap.empty) {
          activeActivities = activitiesSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as Activity[];
          setActivities(activeActivities);
        } else {
          // Seed activities
          for (const act of INITIAL_ACTIVITIES) {
            await setDoc(doc(db, 'activities', act.id), act);
          }
          setActivities(INITIAL_ACTIVITIES);
        }

        // 3. Fetch announcements
        const announcementsCol = collection(db, 'announcements');
        const announcementsSnap = await getDocs(announcementsCol);
        let activeAnnouncements: Announcement[] = [];
        if (!announcementsSnap.empty) {
          activeAnnouncements = announcementsSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as Announcement[];
          setAnnouncements(activeAnnouncements);
        } else {
          // Seed announcements
          for (const ann of INITIAL_ANNOUNCEMENTS) {
            await setDoc(doc(db, 'announcements', ann.id), ann);
          }
          setAnnouncements(INITIAL_ANNOUNCEMENTS);
        }

        // 4. Fetch submissions (PPDB)
        const submissionsCol = collection(db, 'submissions');
        const submissionsSnap = await getDocs(submissionsCol);
        if (!submissionsSnap.empty) {
          const activeSubmissions = submissionsSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as PPDBSubmission[];
          setSubmissions(activeSubmissions);
        } else {
          setSubmissions([]);
        }

        setFirebaseStatus('connected');
        setFirebaseError(null);
      } catch (err: any) {
        console.error('Failed to load from Firebase:', err);
        setFirebaseStatus('error');
        setFirebaseError(err.message || 'Unknown permission/network error');
      }
    }

    loadDataFromFirebase();
  }, []);

  // Sync state to LocalStorage when changed (as safe local fallback)
  useEffect(() => {
    localStorage.setItem('school_profile', JSON.stringify(schoolProfile));
  }, [schoolProfile]);

  useEffect(() => {
    localStorage.setItem('school_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('school_ppdb_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('school_announcements', JSON.stringify(announcements));
  }, [announcements]);

  // Fallback for deactivated audience tracks
  useEffect(() => {
    if (audienceTrack === 'parent' && schoolProfile.isParentAccessActive === false) {
      if (schoolProfile.isStudentAccessActive !== false) {
        setAudienceTrack('student');
      } else if (schoolProfile.isAlumniAccessActive !== false) {
        setAudienceTrack('alumni');
      }
    } else if (audienceTrack === 'student' && schoolProfile.isStudentAccessActive === false) {
      if (schoolProfile.isParentAccessActive !== false) {
        setAudienceTrack('parent');
      } else if (schoolProfile.isAlumniAccessActive !== false) {
        setAudienceTrack('alumni');
      }
    } else if (audienceTrack === 'alumni' && schoolProfile.isAlumniAccessActive === false) {
      if (schoolProfile.isParentAccessActive !== false) {
        setAudienceTrack('parent');
      } else if (schoolProfile.isStudentAccessActive !== false) {
        setAudienceTrack('student');
      }
    }
  }, [schoolProfile.isParentAccessActive, schoolProfile.isStudentAccessActive, schoolProfile.isAlumniAccessActive, audienceTrack]);

  // Handle Handlers
  const handleAddActivity = async (newAct: Activity) => {
    setActivities([newAct, ...activities]);
    if (firebaseStatus === 'connected') {
      try {
        await setDoc(doc(db, 'activities', newAct.id), newAct);
      } catch (err) {
        console.error('Error writing activity to Firebase:', err);
      }
    }
  };

  const handleDeleteActivity = async (id: string) => {
    setActivities(activities.filter(act => act.id !== id));
    if (firebaseStatus === 'connected') {
      try {
        await deleteDoc(doc(db, 'activities', id));
      } catch (err) {
        console.error('Error deleting activity from Firebase:', err);
      }
    }
  };

  const handleRegisterSubmit = async (newReg: Omit<PPDBSubmission, 'id' | 'date' | 'status'>) => {
    const fullReg: PPDBSubmission = {
      ...newReg,
      id: `reg-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Menunggu Review'
    };
    setSubmissions([fullReg, ...submissions]);
    if (firebaseStatus === 'connected') {
      try {
        await setDoc(doc(db, 'submissions', fullReg.id), fullReg);
      } catch (err) {
        console.error('Error submitting to Firebase:', err);
      }
    }
  };

  const handleUpdateSubmissionStatus = async (id: string, newStatus: PPDBSubmission['status']) => {
    setSubmissions(submissions.map(sub => 
      sub.id === id ? { ...sub, status: newStatus } : sub
    ));
    if (firebaseStatus === 'connected') {
      try {
        await updateDoc(doc(db, 'submissions', id), { status: newStatus });
      } catch (err) {
        console.error('Error updating status in Firebase:', err);
      }
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    setSubmissions(submissions.filter(sub => sub.id !== id));
    if (firebaseStatus === 'connected') {
      try {
        await deleteDoc(doc(db, 'submissions', id));
      } catch (err) {
        console.error('Error deleting submission from Firebase:', err);
      }
    }
  };

  const handleAddAnnouncement = async (newAnn: Announcement) => {
    setAnnouncements([newAnn, ...announcements]);
    if (firebaseStatus === 'connected') {
      try {
        await setDoc(doc(db, 'announcements', newAnn.id), newAnn);
      } catch (err) {
        console.error('Error writing announcement to Firebase:', err);
      }
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    setAnnouncements(announcements.filter(ann => ann.id !== id));
    if (firebaseStatus === 'connected') {
      try {
        await deleteDoc(doc(db, 'announcements', id));
      } catch (err) {
        console.error('Error deleting announcement from Firebase:', err);
      }
    }
  };

  const handleUpdateSchoolProfile = async (newProfile: SchoolProfile) => {
    setSchoolProfile(newProfile);
    if (firebaseStatus === 'connected') {
      try {
        await setDoc(doc(db, 'school_profile', 'main_profile'), newProfile);
      } catch (err) {
        console.error('Error saving profile to Firebase:', err);
      }
    }
  };

  // Find latest important announcement to show in running header
  const importantAnnouncement = announcements.find(ann => ann.isImportant)?.title;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/40 text-slate-800 selection:bg-emerald-500 selection:text-white">
      {/* Dynamic Header & Navigation */}
      <Navbar 
        currentView={currentView} 
        setView={setView} 
        isAdminLoggedIn={submissions.length > 0} 
        onToggleAdmin={() => setView('admin')} 
        latestImportantAnnouncement={importantAnnouncement}
        schoolProfile={schoolProfile}
      />

      <main className="flex-grow">
        {/* VIEW 1: BERANDA / HOME */}
        {currentView === 'beranda' && (
          <div className="space-y-16 bg-grid-pattern pb-12">
            
            {/* 1. Hero Section (Prestige Intro) */}
            <section className="relative overflow-hidden bg-white py-16 lg:py-24 border-b border-slate-100" id="hero-section">
              <div className="absolute inset-0 bg-[radial-gradient(#0f766e_0.5px,transparent_0.5px)] [background-size:20px_20px] opacity-10 pointer-events-none" />
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                  
                  {/* Left Content */}
                  <div className="lg:col-span-7 space-y-8 text-left">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100/80 text-emerald-900 text-xs font-bold px-3.5 py-2 rounded-full uppercase tracking-wider shadow-sm">
                      <Award className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                      <span>Akreditasi A & Madrasah Ibtidaiyah Rujukan Karakter</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.08] font-sans">
                      {schoolProfile.headline}
                    </h1>

                    <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
                      {schoolProfile.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                      <button
                        onClick={() => setView('ppdb')}
                        className="px-8 py-4 text-center text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-slate-900 rounded-xl shadow-xl shadow-emerald-950/20 hover:shadow-emerald-950/30 transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2.5 border border-emerald-800/10"
                      >
                        <span>Daftar PPDB {schoolProfile.schoolName}</span>
                        <ArrowRight className="h-4 w-4 text-amber-400" />
                      </button>
                      
                      <button
                        onClick={() => setView('kegiatan')}
                        className="px-8 py-4 text-center text-xs font-bold uppercase tracking-widest text-slate-700 bg-slate-100/80 hover:bg-slate-200/50 border border-slate-200/60 hover:border-slate-300 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Eksplor Kegiatan Siswa</span>
                        <ArrowUpRight className="h-4 w-4 text-slate-400" />
                      </button>
                    </div>

                    {/* Elite Partner Seals */}
                    <div className="pt-8 border-t border-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Pendidikan & Karakter Madrasah:</p>
                      <div className="flex flex-wrap items-center gap-6 opacity-75">
                        <span className="text-xs font-extrabold text-slate-500 border border-slate-200 px-2.5 py-1 rounded bg-slate-50/50">KURIKULUM KEMENAG RI</span>
                        <span className="text-xs font-extrabold text-slate-500 border border-slate-200 px-2.5 py-1 rounded bg-slate-50/50">BAN-SM TERAKREDITASI A</span>
                        <span className="text-xs font-extrabold text-slate-500 border border-slate-200 px-2.5 py-1 rounded bg-slate-50/50">PEMBIASAAN TAHFIDZ JUZ 30</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Graphic Mockup */}
                  <div className="lg:col-span-5 relative">
                    <div className="absolute -inset-4 bg-emerald-800/5 rounded-[40px] blur-3xl transform rotate-3" />
                    <div className="relative bg-gradient-to-b from-emerald-50 to-white rounded-3xl border border-slate-100/90 p-4 shadow-2xl overflow-hidden aspect-square flex flex-col justify-between">
                      <div className="relative w-full h-[72%] overflow-hidden rounded-2xl group">
                        <img 
                          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
                          alt="Siswa Belajar Bersama" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 to-transparent" />
                        <span className="absolute top-4 left-4 bg-slate-900/95 backdrop-blur text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-md border border-slate-800">
                          KAMPUS UNGGUL
                        </span>
                      </div>
                      
                      {/* Live strategic stats ticker inside graphic mock */}
                      <div className="grid grid-cols-2 gap-3 pt-3">
                        <div className="bg-emerald-900/5 hover:bg-emerald-900/10 transition-colors p-3.5 rounded-xl border border-emerald-500/10 text-left">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 leading-none mb-1.5">PENDAFTAR BULAN INI</p>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-extrabold text-slate-950 tracking-tight">+182</span>
                            <span className="text-[10px] text-emerald-600 font-bold">Terverifikasi</span>
                          </div>
                        </div>
                        <div className="bg-amber-500/5 hover:bg-amber-500/10 transition-colors p-3.5 rounded-xl border border-amber-500/10 text-left">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-800 leading-none mb-1.5">KUOTA JALUR BEASISWA</p>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-extrabold text-slate-950 tracking-tight">14 Kursi</span>
                            <span className="text-[10px] text-red-500 font-bold animate-pulse">Sisa</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* 2. Sambutan Kepala Sekolah (Editorial Style) */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-slate-200/50 p-8 md:p-14 shadow-sm relative overflow-hidden">
                <div className="absolute top-10 right-10 opacity-5 text-emerald-950 pointer-events-none select-none text-[150px] font-serif leading-none">“</div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-4 flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-800 rounded-3xl transform rotate-3 scale-95 opacity-80 shadow-lg" />
                      <img 
                        src={schoolProfile.principalAvatar} 
                        alt={schoolProfile.principalName} 
                        className="relative z-10 w-52 md:w-60 rounded-3xl object-cover shadow-2xl border-4 border-white"
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-8 space-y-6 text-left">
                    <div className="inline-flex items-center gap-1.5 text-amber-700 text-xs font-bold uppercase tracking-widest">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <span>Sambutan Kepala Madrasah</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug">
                      "Ikhlas Beramal, Mengabdi Demi Pendidikan Akhlak & Karakter Anak"
                    </h3>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed italic font-serif">
                      "{schoolProfile.principalSpeech}"
                    </p>
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-base text-slate-900">{schoolProfile.principalName}</h5>
                        <p className="text-xs text-slate-400 font-medium">{schoolProfile.principalRole}</p>
                      </div>
                      <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 text-[10px] font-bold uppercase tracking-wider">
                        KKG Kabupaten Bandung Barat
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Interactive Audience Tracks (Parent vs Student strategic choices) */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="bg-slate-950 text-white rounded-3xl p-8 md:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 h-96 w-96 bg-emerald-500 rounded-full blur-3xl opacity-5 transform translate-x-32 -translate-y-32" />
                
                <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto mb-10">
                  <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-2.5">PEMBELAJARAN BERFOKUS AKHLAK</span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                    Program & Pembiasaan Terbaik bagi Calon Siswa
                  </h2>
                  <p className="text-slate-400 mt-2 text-xs md:text-sm max-w-2xl">
                    Silakan pilih profil Anda di bawah ini untuk melihat komitmen pelayanan pendidikan serta nilai tambah yang kami hadirkan bagi keluarga Anda.
                  </p>

                  {/* Toggle Selector Tabs */}
                  <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 mt-6 shrink-0 justify-center">
                    {schoolProfile.isParentAccessActive !== false && (
                      <button
                        onClick={() => setAudienceTrack('parent')}
                        className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                          audienceTrack === 'parent' 
                            ? 'bg-emerald-800 text-white shadow-lg' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Saya Orang Tua Siswa
                      </button>
                    )}
                    {schoolProfile.isStudentAccessActive !== false && (
                      <button
                        onClick={() => setAudienceTrack('student')}
                        className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                          audienceTrack === 'student' 
                            ? 'bg-emerald-800 text-white shadow-lg' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Saya Calon Siswa
                      </button>
                    )}
                    {schoolProfile.isAlumniAccessActive !== false && (
                      <button
                        onClick={() => setAudienceTrack('alumni')}
                        className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                          audienceTrack === 'alumni' 
                            ? 'bg-emerald-800 text-white shadow-lg' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Saya Alumni
                      </button>
                    )}
                  </div>
                </div>

                {/* Displaying track content based on choice */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {audienceTrack === 'parent' && schoolProfile.isParentAccessActive !== false && (
                    <>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-left hover:border-emerald-500/30 transition-all">
                        <span className="text-emerald-400 text-xs font-bold font-mono">01 / SILATURAHMI</span>
                        <h4 className="text-base font-bold text-white mt-2 mb-3">Monitoring Perkembangan Anak</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Kemudahan berkomunikasi langsung dengan wali kelas via WhatsApp untuk memantau ibadah shalat dan progres hafalan surat pendek anak di rumah.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-left hover:border-emerald-500/30 transition-all">
                        <span className="text-emerald-400 text-xs font-bold font-mono">02 / AKHLAK MULIA</span>
                        <h4 className="text-base font-bold text-white mt-2 mb-3">Bimbingan Sopan Santun</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Kurikulum kami menekankan adab menghormati orang tua, menyayangi sesama, dan kemandirian perilaku anak dalam kehidupan sehari-hari.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-left hover:border-emerald-500/30 transition-all">
                        <span className="text-emerald-400 text-xs font-bold font-mono">03 / BEASISWA</span>
                        <h4 className="text-base font-bold text-white mt-2 mb-3">Biaya Terjangkau & Subsidi</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Madrasah kami mendukung penuh seluruh lapisan masyarakat dengan skema subsidi silang, beasiswa komite, serta kemudahan biaya bagi anak yatim/piatu.
                        </p>
                      </div>
                    </>
                  )}
                  {audienceTrack === 'student' && schoolProfile.isStudentAccessActive !== false && (
                    <>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-left hover:border-emerald-500/30 transition-all">
                        <span className="text-amber-400 text-xs font-bold font-mono">01 / KEAGAMAAN</span>
                        <h4 className="text-base font-bold text-white mt-2 mb-3">Bimbingan Iqra & Al-Qur'an</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Belajar mengaji dengan metode yang menyenangkan, dibimbing ustadz/ustadzah penyabar mulai dari nol hingga lancar membaca Al-Qur'an.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-left hover:border-emerald-500/30 transition-all">
                        <span className="text-amber-400 text-xs font-bold font-mono">02 / CERITA ISLAMI</span>
                        <h4 className="text-base font-bold text-white mt-2 mb-3">Kisah Teladan Rasul</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Pembelajaran disisipi dongeng Islami menarik, menceritakan perjuangan nabi dan sahabat untuk menumbuhkan rasa cinta pada agama sejak kecil.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-left hover:border-emerald-500/30 transition-all">
                        <span className="text-amber-400 text-xs font-bold font-mono">03 / BERMAIN</span>
                        <h4 className="text-base font-bold text-white mt-2 mb-3">Pramuka & Silat Tapak Suci</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Ikuti kegiatan luar kelas yang asyik mulai dari Pramuka Siaga/Penggalang, mewarnai bersama, hingga olahraga bela diri fisik yang melatih ketangkasan.
                        </p>
                      </div>
                    </>
                  )}
                  {audienceTrack === 'alumni' && schoolProfile.isAlumniAccessActive !== false && (
                    <>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-left hover:border-emerald-500/30 transition-all">
                        <span className="text-blue-400 text-xs font-bold font-mono">01 / JEJARING ALUMNI</span>
                        <h4 className="text-base font-bold text-white mt-2 mb-3">Ikatan Alumni MI Cibungur</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Menjaga silaturahmi antar alumni lintas angkatan untuk bertukar info jenjang SMP/MTS, pondok pesantren, hingga kolaborasi demi kemajuan bersama.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-left hover:border-emerald-500/30 transition-all">
                        <span className="text-blue-400 text-xs font-bold font-mono">02 / DONASI & KONTRIBUSI</span>
                        <h4 className="text-base font-bold text-white mt-2 mb-3">Sumbangsih Almamater</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Wadah bagi alumni yang ingin mendonasikan buku perpustakaan, peralatan ibadah, atau sumbangan sarana pendidikan bagi adik kelas yang membutuhkan.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-left hover:border-emerald-500/30 transition-all">
                        <span className="text-blue-400 text-xs font-bold font-mono">03 / KISAH SUKSES</span>
                        <h4 className="text-base font-bold text-white mt-2 mb-3">Motivasi & Inspirasi</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Berbagi cerita sukses alumni yang melanjutkan ke pesantren terkemuka atau sekolah favorit untuk memotivasi adik-adik kelas yang masih belajar.
                        </p>
                      </div>
                    </>
                  )}
                  {schoolProfile.isParentAccessActive === false && schoolProfile.isStudentAccessActive === false && schoolProfile.isAlumniAccessActive === false && (
                    <div className="col-span-3 py-12 text-center text-slate-400 text-sm">
                      Semua jalur akses (Orang Tua, Siswa, & Alumni) sedang dinonaktifkan sementara oleh Administrator.
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 4. Interactive Student Journey Roadmap (Strategic Parenting Vision) */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Roadmap Tumbuh Kembang Anak
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-3">
                  Peta Perjalanan Belajar Menuju Karakter Qur'ani
                </h2>
                <p className="text-slate-500 mt-2 text-xs md:text-sm">
                  Kami menyusun bimbingan terarah dan kasih sayang berkesinambungan bagi putra-putri Anda sejak usia dini hingga siap melanjutkan ke jenjang berikutnya.
                </p>
              </div>

              {/* Responsive Roadmap Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Connecting background vector line (visible on desktop) */}
                <div className="absolute top-1/4 left-[15%] right-[15%] h-0.5 bg-slate-200 hidden md:block pointer-events-none" />

                {/* Step 1 */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all relative z-10 text-left">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-extrabold mb-5 shadow-lg shadow-emerald-900/10">
                    I-II
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-950 mb-2">Kelas I - II: Pembiasaan Adab & Iqra</h4>
                  <ul className="text-xs text-slate-500 space-y-2 mt-3 leading-relaxed">
                    <li className="flex gap-2">
                      <span className="text-emerald-700 font-bold">&bull;</span>
                      <span>Belajar mengaji Iqra secara bertahap, lancar, dan tanpa paksaan</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-700 font-bold">&bull;</span>
                      <span>Penanaman karakter dasar 5S (Senyum, Sapa, Salam, Sopan, Santun)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-700 font-bold">&bull;</span>
                      <span>Pembelajaran motorik dasar, menggambar Islami, & calistung ramah anak</span>
                    </li>
                  </ul>
                </div>

                {/* Step 2 */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all relative z-10 text-left">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-extrabold mb-5 shadow-lg shadow-emerald-900/10">
                    III-IV
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-950 mb-2">Kelas III - IV: Kemandirian & Hafalan Juz Amma</h4>
                  <ul className="text-xs text-slate-500 space-y-2 mt-3 leading-relaxed">
                    <li className="flex gap-2">
                      <span className="text-emerald-700 font-bold">&bull;</span>
                      <span>Mulai menghafal surat-surat pendek Juz 30 secara rutin berulang</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-700 font-bold">&bull;</span>
                      <span>Kegiatan Kepramukaan Siaga melatih kepemimpinan, kerjasama, dan disiplin</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-700 font-bold">&bull;</span>
                      <span>Eksplorasi ilmu sains dasar berbasis lingkungan sekitar madrasah</span>
                    </li>
                  </ul>
                </div>

                {/* Step 3 */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all relative z-10 text-left">
                  <div className="h-12 w-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-extrabold mb-5 shadow-lg shadow-amber-600/10">
                    V-VI
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-950 mb-2">Kelas V - VI: Kepemimpinan & Kelulusan Berkah</h4>
                  <ul className="text-xs text-slate-500 space-y-2 mt-3 leading-relaxed">
                    <li className="flex gap-2">
                      <span className="text-amber-600 font-bold">&bull;</span>
                      <span>Pemantapan hafalan Juz 30 sebagai mahkota kelulusan utama madrasah</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600 font-bold">&bull;</span>
                      <span>Bimbingan belajar intensif menyongsong SMP / MTs favorit Kabupaten</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600 font-bold">&bull;</span>
                      <span>Bakti sosial cilik, tadabbur alam, dan pembiasaan shalat berjamaah mandiri</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 5. Competitive Advantages / USPs */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Keunggulan Kompetitif
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 mt-3">
                  Mengapa MI Cibungur I Dipercaya Masyarakat?
                </h2>
                <p className="text-slate-500 mt-3 text-xs md:text-sm">
                  Kami mengintegrasikan pendidikan akhlak yang kokoh dengan metode belajar yang ramah untuk mengasah potensi terbaik setiap anak.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* USP 1 */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 group text-left">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 mb-2">Kurikulum Terpadu</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Sinergi apik Kurikulum Merdeka Nasional dengan kurikulum keagamaan Kementerian Agama Republik Indonesia.
                  </p>
                </div>

                {/* USP 2 */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 group text-left">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 mb-2">Pembiasaan Ibadah</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Melatih shalat dhuha, shalat dzuhur berjamaah, zikir harian, hafalan hadits, serta doa fardhu sejak usia dini.
                  </p>
                </div>

                {/* USP 3 */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 group text-left">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                    <Globe className="h-5 w-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 mb-2">Rasio Kelas Nyaman</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Jumlah murid per kelas dibatasi proporsional agar guru dapat memberikan perhatian penuh, sabar, dan kasih sayang intensif.
                  </p>
                </div>

                {/* USP 4 */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 group text-left">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 mb-2">Sangat Ringan & Terjangkau</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Biaya SPP bulanan yang ringan, subsidi khusus anak berprestasi, yatim, dhuafa, serta beasiswa komite komprehensif.
                  </p>
                </div>

              </div>
            </section>

            {/* 6. Running Stats Counter Bento Grid */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <StatsSection schoolProfile={schoolProfile} />
            </div>

            {/* 7. Highlight Kegiatan Terbaru */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8 border-b border-slate-100 pb-4">
                <div className="text-left">
                  <span className="text-emerald-800 text-xs font-bold uppercase tracking-widest block">Kabar Sekolah</span>
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">Kegiatan & Berita Teranyar</h2>
                </div>
                <button 
                  onClick={() => setView('kegiatan')} 
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                >
                  <span>Lihat Semua Berita</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Display top 3 activities */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activities.slice(0, 3).map((act) => (
                  <div 
                    key={act.id} 
                    onClick={() => setView('kegiatan')}
                    className="bg-white rounded-2xl border border-slate-100/80 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between text-left"
                  >
                    <div className="h-44 overflow-hidden relative">
                      <img src={act.image} alt={act.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 left-3 bg-emerald-800 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded">
                        {act.category}
                      </span>
                    </div>
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mb-1.5">
                          <Calendar className="h-3.5 w-3.5" /> {act.date}
                        </span>
                        <h4 className="font-bold text-sm text-slate-950 group-hover:text-emerald-800 line-clamp-1 transition-colors leading-snug">
                          {act.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                          {act.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-50 text-[11px] text-emerald-800 font-bold">
                        Baca Selengkapnya &rarr;
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 8. Testimonials Section */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-slate-100/40 rounded-3xl py-4 border border-slate-200/50">
              <TestimonialsSection testimonials={INITIAL_TESTIMONIALS} />
            </div>

            {/* 9. Bottom Call to Action (PPDB Invitation) */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-br from-emerald-800 via-emerald-950 to-slate-950 text-white rounded-3xl p-8 md:p-14 text-center relative overflow-hidden shadow-2xl border border-emerald-900/30">
                <div className="absolute inset-0 bg-[radial-gradient(#b45309_0.5px,transparent_0.5px)] [background-size:20px_20px] opacity-10 pointer-events-none" />
                <div className="absolute top-0 left-0 h-48 w-48 bg-emerald-500/10 rounded-full blur-2xl transform -translate-x-10 -translate-y-10" />
                <div className="absolute bottom-0 right-0 h-48 w-48 bg-amber-500/10 rounded-full blur-2xl transform translate-x-10 translate-y-10" />

                <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-widest bg-emerald-900/40 border border-emerald-500/10 px-3.5 py-1.5 rounded-full inline-block">
                    Penerimaan Gelombang II Sedang Berlangsung
                  </span>
                  <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-none text-white font-sans">
                    Amankan Kuota Calon Siswa {schoolProfile.schoolName} Sekarang
                  </h2>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl mx-auto">
                    Kuota penerimaan siswa baru dibatasi agar setiap anak didik kami mendapatkan perhatian bimbingan akhlak dan akademik secara maksimal dari ustadz/ustadzah kami. Amankan kursi putra-putri Anda hari ini!
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={() => setView('ppdb')}
                      className="px-8 py-4 text-xs font-bold uppercase tracking-wider bg-white text-emerald-950 hover:bg-amber-100 rounded-xl shadow-lg transition-all cursor-pointer border border-white"
                    >
                      Daftar & Cek Beasiswa PPDB
                    </button>
                    <a
                      href={`https://wa.me/${schoolProfile.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-8 py-4 text-xs font-bold uppercase tracking-wider bg-emerald-950/40 text-white hover:bg-emerald-900/30 border border-emerald-500/20 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      <Phone className="h-4 w-4 text-amber-400" /> Hubungi Humas (WA)
                    </a>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: FASILITAS / VIRTUAL TOUR */}
        {currentView === 'fasilitas' && (
          <VirtualTour facilities={INITIAL_FACILITIES} />
        )}

        {/* VIEW 3: KEGIATAN SISWA */}
        {currentView === 'kegiatan' && (
          <ActivitiesShowcase activities={activities} setView={setView} />
        )}

        {/* VIEW 4: PENDAFTARAN PPDB */}
        {currentView === 'ppdb' && (
          <PPDBForm onRegisterSubmit={handleRegisterSubmit} />
        )}

        {/* VIEW 5: ADMIN / PORTAL GURU */}
        {currentView === 'admin' && (
          <AdminPortal 
            activities={activities}
            submissions={submissions}
            announcements={announcements}
            onAddActivity={handleAddActivity}
            onDeleteActivity={handleDeleteActivity}
            onUpdateSubmissionStatus={handleUpdateSubmissionStatus}
            onDeleteSubmission={handleDeleteSubmission}
            onAddAnnouncement={handleAddAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            schoolProfile={schoolProfile}
            onUpdateSchoolProfile={handleUpdateSchoolProfile}
            firebaseStatus={firebaseStatus}
            firebaseError={firebaseError}
          />
        )}

      </main>

      {/* High Trust Professional Footer */}
      <footer className="bg-slate-950 text-slate-300 mt-20 border-t border-slate-800 shrink-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-left">
            
            {/* School Profile Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <GraduationCap className="h-6 w-6 text-emerald-500" />
                <span className="font-extrabold text-sm tracking-tight">{schoolProfile.schoolName}</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Menyelenggarakan sistem pendidikan dasar berciri khas Islami yang membina generasi sholeh, berakhlak mulia, cerdas, dan mandiri.
              </p>
              <div className="flex gap-2.5">
                <a href="#" className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white text-slate-400 transition-all">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white text-slate-400 transition-all">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#" className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white text-slate-400 transition-all">
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Akses Navigasi</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><button onClick={() => setView('beranda')} className="hover:text-emerald-500 transition-colors cursor-pointer">Profil Beranda</button></li>
                <li><button onClick={() => setView('fasilitas')} className="hover:text-emerald-500 transition-colors cursor-pointer">Fasilitas Kampus</button></li>
                <li><button onClick={() => setView('kegiatan')} className="hover:text-emerald-500 transition-colors cursor-pointer">Dokumentasi Kegiatan</button></li>
                <li><button onClick={() => setView('ppdb')} className="hover:text-emerald-500 transition-colors cursor-pointer">Pendaftaran PPDB 2026</button></li>
                <li><button onClick={() => setView('admin')} className="hover:text-emerald-500 transition-colors cursor-pointer">Portal Admin Guru & Staff</button></li>
              </ul>
            </div>

            {/* Operational Info Column */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Jam Operasional</h4>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex gap-2 items-center">
                  <Clock className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Senin - Sabtu: 07:15 - 12:45 WIB</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Clock className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Kegiatan Ekstra: Sabtu setelah Ashar</span>
                </li>
                <li className="flex gap-2 items-center">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Minggu / Libur Nasional: Tutup</span>
                </li>
              </ul>
            </div>

            {/* Kontak Info Column */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Hubungi Kami</h4>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex gap-2 items-start">
                  <MapPin className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{schoolProfile.address}</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{schoolProfile.phone} (WhatsApp PPDB)</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{schoolProfile.email}</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom copyright area */}
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <p>&copy; {new Date().getFullYear()} {schoolProfile.schoolName} {schoolProfile.schoolSlogan}. Hak Cipta Dilindungi Undang-Undang.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-emerald-500">Kebijakan Privasi</a>
              <span>&bull;</span>
              <a href="#" className="hover:text-emerald-500">Syarat Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
