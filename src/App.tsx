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
  ArrowUpRight,
  X,
  Megaphone
} from 'lucide-react';
import Navbar from './components/Navbar';
import PPDBForm from './components/PPDBForm';
import AdminPortal from './components/AdminPortal';
import VirtualTour from './components/VirtualTour';
import StatsSection from './components/StatsSection';
import TestimonialsSection from './components/TestimonialsSection';
import ActivitiesShowcase from './components/ActivitiesShowcase';
import TeacherProfile from './components/TeacherProfile';
import SekilasMadrasah from './components/SekilasMadrasah';
import KabarKelasView from './components/KabarKelasView';

import { db, auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';

import { Activity, PPDBSubmission, Announcement, Testimonial, SchoolProfile, Teacher, Facility, HistoricalFigure, TeacherMenu, KabarKelas } from './types';
import { 
  INITIAL_ACTIVITIES, 
  INITIAL_FACILITIES, 
  INITIAL_TESTIMONIALS, 
  INITIAL_ANNOUNCEMENTS,
  DEFAULT_SCHOOL_PROFILE,
  INITIAL_TEACHERS,
  INITIAL_HISTORICAL_FIGURES,
  INITIAL_TEACHER_MENUS,
  INITIAL_KABAR_KELAS
} from './data';

export default function App() {
  const [currentView, setView] = useState<string>(() => {
    const hash = window.location.hash;
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    if (hash === '#/admin-cibungur' || hash === '#admin-cibungur' || path === '/admin-cibungur' || searchParams.get('admin') === 'true') {
      return 'admin';
    }
    if (hash === '#/ppdb' || hash === '#ppdb') return 'ppdb';
    if (hash === '#/kabar-kelas' || hash === '#kabar-kelas') return 'kabar-kelas';
    if (hash === '#/sekilas' || hash === '#sekilas') return 'sekilas';
    if (hash === '#/fasilitas' || hash === '#fasilitas') return 'fasilitas';
    if (hash === '#/guru' || hash === '#guru') return 'guru';
    if (hash === '#/kegiatan' || hash === '#kegiatan') return 'kegiatan';
    return 'beranda';
  });
  const [audienceTrack, setAudienceTrack] = useState<'parent' | 'student' | 'alumni'>('parent');

  const [firebaseStatus, setFirebaseStatus] = useState<'loading' | 'connected' | 'error'>('loading');

  // Sync view state to URL hash
  useEffect(() => {
    if (currentView === 'admin') {
      if (window.location.hash !== '#/admin-cibungur') {
        window.location.hash = '#/admin-cibungur';
      }
    } else if (currentView === 'beranda') {
      if (window.location.hash !== '' && window.location.hash !== '#/beranda') {
        window.location.hash = '';
      }
    } else {
      const expectedHash = `#/${currentView}`;
      if (window.location.hash !== expectedHash) {
        window.location.hash = expectedHash;
      }
    }
  }, [currentView]);

  // Listen for browser navigation changes (Back/Forward, manual URL typing)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);

      if (hash === '#/admin-cibungur' || hash === '#admin-cibungur' || path === '/admin-cibungur' || searchParams.get('admin') === 'true') {
        setView('admin');
      } else if (hash === '#/ppdb' || hash === '#ppdb') {
        setView('ppdb');
      } else if (hash === '#/kabar-kelas' || hash === '#kabar-kelas') {
        setView('kabar-kelas');
      } else if (hash === '#/sekilas' || hash === '#sekilas') {
        setView('sekilas');
      } else if (hash === '#/fasilitas' || hash === '#fasilitas') {
        setView('fasilitas');
      } else if (hash === '#/guru' || hash === '#guru') {
        setView('guru');
      } else if (hash === '#/kegiatan' || hash === '#kegiatan') {
        setView('kegiatan');
      } else if (hash === '#/beranda' || hash === '#beranda' || hash === '') {
        setView('beranda');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  // Load state from LocalStorage or fall back to Initial Mock Data
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('school_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [submissions, setSubmissions] = useState<PPDBSubmission[]>([]);

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

  const [showAnnouncementCenter, setShowAnnouncementCenter] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('school_teachers');
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('school_testimonials');
    return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  const [facilities, setFacilities] = useState<Facility[]>(() => {
    const saved = localStorage.getItem('school_facilities');
    return saved ? JSON.parse(saved) : INITIAL_FACILITIES;
  });

  const [historicalFigures, setHistoricalFigures] = useState<HistoricalFigure[]>(() => {
    const saved = localStorage.getItem('school_historical_figures');
    return saved ? JSON.parse(saved) : INITIAL_HISTORICAL_FIGURES;
  });

  const [teacherMenus, setTeacherMenus] = useState<TeacherMenu[]>(INITIAL_TEACHER_MENUS);

  const [kabarKelas, setKabarKelas] = useState<KabarKelas[]>(() => {
    const saved = localStorage.getItem('school_kabar_kelas');
    return saved ? JSON.parse(saved) : INITIAL_KABAR_KELAS;
  });

  // Try to load and seed Firebase on Mount
  useEffect(() => {
    async function loadDataFromFirebase() {
      let isAnyLoaded = false;
      let errorOccurred = false;
      let lastErrorMessage = '';

      // 1. Fetch school profile
      try {
        const profileRef = doc(db, 'school_profile', 'main_profile');
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          const activeProfile = { ...DEFAULT_SCHOOL_PROFILE, ...profileSnap.data() } as SchoolProfile;
          setSchoolProfile(activeProfile);
        } else {
          // Seed default profile to user's Firestore!
          await setDoc(profileRef, DEFAULT_SCHOOL_PROFILE);
          setSchoolProfile(DEFAULT_SCHOOL_PROFILE);
        }
        isAnyLoaded = true;
      } catch (err: any) {
        console.error('Error loading school profile:', err);
        errorOccurred = true;
        lastErrorMessage = err.message;
      }

      // 2. Fetch activities
      try {
        const activitiesCol = collection(db, 'activities');
        const activitiesSnap = await getDocs(activitiesCol);
        if (!activitiesSnap.empty) {
          const activeActivities = activitiesSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as Activity[];
          setActivities(activeActivities);
        } else {
          // Seed activities
          for (const act of INITIAL_ACTIVITIES) {
            await setDoc(doc(db, 'activities', act.id), act);
          }
          setActivities(INITIAL_ACTIVITIES);
        }
        isAnyLoaded = true;
      } catch (err: any) {
        console.error('Error loading activities:', err);
        errorOccurred = true;
        lastErrorMessage = err.message;
      }

      // 3. Fetch announcements
      try {
        const announcementsCol = collection(db, 'announcements');
        const announcementsSnap = await getDocs(announcementsCol);
        if (!announcementsSnap.empty) {
          const activeAnnouncements = announcementsSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as Announcement[];
          setAnnouncements(activeAnnouncements);
        } else {
          // Seed announcements
          for (const ann of INITIAL_ANNOUNCEMENTS) {
            await setDoc(doc(db, 'announcements', ann.id), ann);
          }
          setAnnouncements(INITIAL_ANNOUNCEMENTS);
        }
        isAnyLoaded = true;
      } catch (err: any) {
        console.error('Error loading announcements:', err);
        errorOccurred = true;
        lastErrorMessage = err.message;
      }

      // 5. Fetch teachers
      try {
        const teachersCol = collection(db, 'teachers');
        const teachersSnap = await getDocs(teachersCol);
        if (!teachersSnap.empty) {
          const activeTeachers = teachersSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as Teacher[];
          setTeachers(activeTeachers);
        } else {
          // Seed teachers
          for (const teacher of INITIAL_TEACHERS) {
            await setDoc(doc(db, 'teachers', teacher.id), teacher);
          }
          setTeachers(INITIAL_TEACHERS);
        }
        isAnyLoaded = true;
      } catch (err: any) {
        console.error('Error loading teachers:', err);
        errorOccurred = true;
        lastErrorMessage = err.message;
      }

      // 6. Fetch testimonials
      try {
        const testimonialsCol = collection(db, 'testimonials');
        const testimonialsSnap = await getDocs(testimonialsCol);
        if (!testimonialsSnap.empty) {
          const activeTestimonials = testimonialsSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as Testimonial[];
          setTestimonials(activeTestimonials);
        } else {
          // Seed testimonials
          for (const test of INITIAL_TESTIMONIALS) {
            await setDoc(doc(db, 'testimonials', test.id), test);
          }
          setTestimonials(INITIAL_TESTIMONIALS);
        }
        isAnyLoaded = true;
      } catch (err: any) {
        console.error('Error loading testimonials:', err);
        errorOccurred = true;
        lastErrorMessage = err.message;
      }

      // 7. Fetch facilities
      try {
        const facilitiesCol = collection(db, 'facilities');
        const facilitiesSnap = await getDocs(facilitiesCol);
        if (!facilitiesSnap.empty) {
          const activeFacilities = facilitiesSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as Facility[];
          setFacilities(activeFacilities);
        } else {
          // Seed facilities
          for (const fac of INITIAL_FACILITIES) {
            await setDoc(doc(db, 'facilities', fac.id), fac);
          }
          setFacilities(INITIAL_FACILITIES);
        }
        isAnyLoaded = true;
      } catch (err: any) {
        console.error('Error loading facilities:', err);
        errorOccurred = true;
        lastErrorMessage = err.message;
      }

      // 8. Fetch historical figures (founders / retired teachers)
      try {
        const historicalCol = collection(db, 'historical_figures');
        const historicalSnap = await getDocs(historicalCol);
        if (!historicalSnap.empty) {
          const activeHistorical = historicalSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as HistoricalFigure[];
          setHistoricalFigures(activeHistorical);
        } else {
          // Seed historical figures
          for (const hf of INITIAL_HISTORICAL_FIGURES) {
            await setDoc(doc(db, 'historical_figures', hf.id), hf);
          }
          setHistoricalFigures(INITIAL_HISTORICAL_FIGURES);
        }
        isAnyLoaded = true;
      } catch (err: any) {
        console.error('Error loading historical figures:', err);
        errorOccurred = true;
        lastErrorMessage = err.message;
      }

      // 10. Fetch kabar kelas
      try {
        const kabarCol = collection(db, 'kabar_kelas');
        const kabarSnap = await getDocs(kabarCol);
        if (!kabarSnap.empty) {
          const activeKabar = kabarSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as KabarKelas[];
          setKabarKelas(activeKabar);
        } else {
          // Seed
          for (const k of INITIAL_KABAR_KELAS) {
            await setDoc(doc(db, 'kabar_kelas', k.id), k);
          }
          setKabarKelas(INITIAL_KABAR_KELAS);
        }
        isAnyLoaded = true;
      } catch (err: any) {
        console.error('Error loading kabar kelas:', err);
        errorOccurred = true;
        lastErrorMessage = err.message;
      }

      if (isAnyLoaded) {
        setFirebaseStatus('connected');
        setFirebaseError(null);
      } else if (errorOccurred) {
        setFirebaseStatus('error');
        setFirebaseError(lastErrorMessage || 'Permission or network error');
      }
    }

    loadDataFromFirebase();
  }, []);

  // Securely load private/sensitive collections only when an administrator or staff member is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const cleanEmail = user.email?.trim().toLowerCase();
        
        // 1. If Super Admin or Admin, load PPDB submissions
        const isSuperAdmin = cleanEmail === 'sopyancepi@gmail.com';
        const isRegisteredAdmin = schoolProfile?.registeredAdmins?.includes(cleanEmail || '') || false;
        
        if (isSuperAdmin || isRegisteredAdmin) {
          try {
            const submissionsCol = collection(db, 'submissions');
            const submissionsSnap = await getDocs(submissionsCol);
            if (!submissionsSnap.empty) {
              const activeSubmissions = submissionsSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as PPDBSubmission[];
              setSubmissions(activeSubmissions);
            } else {
              setSubmissions([]);
            }
          } catch (err) {
            console.error('Error loading private PPDB submissions:', err);
          }
        } else {
          setSubmissions([]);
        }

        // 2. If any staff member (Super Admin, Admin, or Guru), load teacher menus
        const isGuru = cleanEmail === 'guru@cibungur1.sch.id';
        if (isSuperAdmin || isRegisteredAdmin || isGuru) {
          try {
            const menusCol = collection(db, 'teacher_menus');
            const menusSnap = await getDocs(menusCol);
            if (!menusSnap.empty) {
              const activeMenus = menusSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as TeacherMenu[];
              setTeacherMenus(activeMenus);
            } else {
              setTeacherMenus(INITIAL_TEACHER_MENUS);
            }
          } catch (err) {
            console.error('Error loading private teacher menus:', err);
          }
        } else {
          setTeacherMenus(INITIAL_TEACHER_MENUS);
        }
      } else {
        // Logged out! Immediately clear memory state for high security
        setSubmissions([]);
        setTeacherMenus(INITIAL_TEACHER_MENUS);
      }
    });
    return () => unsubscribe();
  }, [schoolProfile]);

  // Sync state to LocalStorage when changed (as safe local fallback)
  useEffect(() => {
    localStorage.setItem('school_profile', JSON.stringify(schoolProfile));
  }, [schoolProfile]);

  useEffect(() => {
    localStorage.setItem('school_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('school_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('school_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('school_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('school_facilities', JSON.stringify(facilities));
  }, [facilities]);

  useEffect(() => {
    localStorage.setItem('school_historical_figures', JSON.stringify(historicalFigures));
  }, [historicalFigures]);

  useEffect(() => {
    localStorage.setItem('school_kabar_kelas', JSON.stringify(kabarKelas));
  }, [kabarKelas]);

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

  const handleUpdateSubmission = async (updatedSub: PPDBSubmission) => {
    setSubmissions(submissions.map(sub => 
      sub.id === updatedSub.id ? updatedSub : sub
    ));
    if (firebaseStatus === 'connected') {
      try {
        await setDoc(doc(db, 'submissions', updatedSub.id), updatedSub);
      } catch (err) {
        console.error('Error updating submission in Firebase:', err);
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

  const handleAddTeacher = async (newTeacher: Teacher) => {
    setTeachers([newTeacher, ...teachers]);
    if (firebaseStatus === 'connected') {
      try {
        await setDoc(doc(db, 'teachers', newTeacher.id), newTeacher);
      } catch (err) {
        console.error('Error writing teacher to Firebase:', err);
      }
    }
  };

  const handleUpdateTeacher = async (updatedTeacher: Teacher) => {
    setTeachers(teachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
    if (firebaseStatus === 'connected') {
      try {
        await setDoc(doc(db, 'teachers', updatedTeacher.id), updatedTeacher);
      } catch (err) {
        console.error('Error updating teacher in Firebase:', err);
      }
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    setTeachers(teachers.filter(t => t.id !== id));
    if (firebaseStatus === 'connected') {
      try {
        await deleteDoc(doc(db, 'teachers', id));
      } catch (err) {
        console.error('Error deleting teacher from Firebase:', err);
      }
    }
  };

  const handleAddHistoricalFigure = async (newFigure: HistoricalFigure) => {
    setHistoricalFigures([newFigure, ...historicalFigures]);
    if (firebaseStatus === 'connected') {
      try {
        await setDoc(doc(db, 'historical_figures', newFigure.id), newFigure);
      } catch (err) {
        console.error('Error writing historical figure to Firebase:', err);
      }
    }
  };

  const handleUpdateHistoricalFigure = async (updatedFigure: HistoricalFigure) => {
    setHistoricalFigures(historicalFigures.map(f => f.id === updatedFigure.id ? updatedFigure : f));
    if (firebaseStatus === 'connected') {
      try {
        await setDoc(doc(db, 'historical_figures', updatedFigure.id), updatedFigure);
      } catch (err) {
        console.error('Error updating historical figure in Firebase:', err);
      }
    }
  };

  const handleDeleteHistoricalFigure = async (id: string) => {
    setHistoricalFigures(historicalFigures.filter(f => f.id !== id));
    if (firebaseStatus === 'connected') {
      try {
        await deleteDoc(doc(db, 'historical_figures', id));
      } catch (err) {
        console.error('Error deleting historical figure from Firebase:', err);
      }
    }
  };

  const handleAddTestimonial = async (newTest: Testimonial) => {
    setTestimonials([newTest, ...testimonials]);
    if (firebaseStatus === 'connected') {
      try {
        await setDoc(doc(db, 'testimonials', newTest.id), newTest);
      } catch (err) {
        console.error('Error writing testimonial to Firebase:', err);
      }
    }
  };

  const handleUpdateTestimonial = async (updatedTest: Testimonial) => {
    setTestimonials(testimonials.map(t => t.id === updatedTest.id ? updatedTest : t));
    if (firebaseStatus === 'connected') {
      try {
        await setDoc(doc(db, 'testimonials', updatedTest.id), updatedTest);
      } catch (err) {
        console.error('Error updating testimonial in Firebase:', err);
      }
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
    if (firebaseStatus === 'connected') {
      try {
        await deleteDoc(doc(db, 'testimonials', id));
      } catch (err) {
        console.error('Error deleting testimonial from Firebase:', err);
      }
    }
  };

  const handleAddFacility = async (newFac: Facility) => {
    setFacilities([newFac, ...facilities]);
    if (firebaseStatus === 'connected') {
      try {
        await setDoc(doc(db, 'facilities', newFac.id), newFac);
      } catch (err) {
        console.error('Error writing facility to Firebase:', err);
      }
    }
  };

  const handleUpdateFacility = async (updatedFac: Facility) => {
    setFacilities(facilities.map(f => f.id === updatedFac.id ? updatedFac : f));
    if (firebaseStatus === 'connected') {
      try {
        await setDoc(doc(db, 'facilities', updatedFac.id), updatedFac);
      } catch (err) {
        console.error('Error updating facility in Firebase:', err);
      }
    }
  };

  const handleDeleteFacility = async (id: string) => {
    setFacilities(facilities.filter(f => f.id !== id));
    if (firebaseStatus === 'connected') {
      try {
        await deleteDoc(doc(db, 'facilities', id));
      } catch (err) {
        console.error('Error deleting facility from Firebase:', err);
      }
    }
  };

  // Teacher Menus CRUD Handlers
  const handleAddTeacherMenu = async (newMenu: TeacherMenu) => {
    setTeacherMenus([newMenu, ...teacherMenus]);
    if (firebaseStatus === 'connected') {
      try {
        await setDoc(doc(db, 'teacher_menus', newMenu.id), newMenu);
      } catch (err) {
        console.error('Error writing teacher menu to Firebase:', err);
      }
    }
  };

  const handleUpdateTeacherMenu = async (updatedMenu: TeacherMenu) => {
    setTeacherMenus(teacherMenus.map(m => m.id === updatedMenu.id ? updatedMenu : m));
    if (firebaseStatus === 'connected') {
      try {
        await setDoc(doc(db, 'teacher_menus', updatedMenu.id), updatedMenu);
      } catch (err) {
        console.error('Error updating teacher menu in Firebase:', err);
      }
    }
  };

  const handleDeleteTeacherMenu = async (id: string) => {
    setTeacherMenus(teacherMenus.filter(m => m.id !== id));
    if (firebaseStatus === 'connected') {
      try {
        await deleteDoc(doc(db, 'teacher_menus', id));
      } catch (err) {
        console.error('Error deleting teacher menu from Firebase:', err);
      }
    }
  };

  // Kabar Kelas CRUD Handlers
  const handleAddKabarKelas = async (newKabar: KabarKelas) => {
    setKabarKelas([newKabar, ...kabarKelas]);
    if (firebaseStatus === 'connected') {
      try {
        await setDoc(doc(db, 'kabar_kelas', newKabar.id), newKabar);
      } catch (err) {
        console.error('Error writing kabar kelas to Firebase:', err);
      }
    }
  };

  const handleUpdateKabarKelas = async (updatedKabar: KabarKelas) => {
    setKabarKelas(kabarKelas.map(k => k.id === updatedKabar.id ? updatedKabar : k));
    if (firebaseStatus === 'connected') {
      try {
        await setDoc(doc(db, 'kabar_kelas', updatedKabar.id), updatedKabar);
      } catch (err) {
        console.error('Error updating kabar kelas in Firebase:', err);
      }
    }
  };

  const handleDeleteKabarKelas = async (id: string) => {
    setKabarKelas(kabarKelas.filter(k => k.id !== id));
    if (firebaseStatus === 'connected') {
      try {
        await deleteDoc(doc(db, 'kabar_kelas', id));
      } catch (err) {
        console.error('Error deleting kabar kelas from Firebase:', err);
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

  // Find all active important announcements and join them to show in the running marquee header
  const activeImportantAnnouncements = announcements.filter(ann => ann.isImportant);
  const importantAnnouncement = activeImportantAnnouncements.length > 0
    ? activeImportantAnnouncements.map(ann => ann.title).join('  ✦  ')
    : undefined;

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
        onOpenAnnouncements={() => setShowAnnouncementCenter(true)}
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
                      <span>{schoolProfile.heroTopBadge || 'Akreditasi A & Madrasah Ibtidaiyah Rujukan Karakter'}</span>
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
                        <span className="text-xs font-extrabold text-slate-500 border border-slate-200 px-2.5 py-1 rounded bg-slate-50/50">{schoolProfile.seal1 || 'KURIKULUM KEMENAG RI'}</span>
                        <span className="text-xs font-extrabold text-slate-500 border border-slate-200 px-2.5 py-1 rounded bg-slate-50/50">{schoolProfile.seal2 || 'BAN-SM TERAKREDITASI A'}</span>
                        <span className="text-xs font-extrabold text-slate-500 border border-slate-200 px-2.5 py-1 rounded bg-slate-50/50">{schoolProfile.seal3 || 'PEMBIASAAN TAHFIDZ JUZ 30'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Graphic Mockup */}
                  <div className="lg:col-span-5 relative">
                    <div className="absolute -inset-4 bg-emerald-800/5 rounded-[40px] blur-3xl transform rotate-3" />
                    <div className="relative bg-gradient-to-b from-emerald-50 to-white rounded-3xl border border-slate-100/90 p-4 shadow-2xl overflow-hidden aspect-square flex flex-col justify-between">
                      <div className="relative w-full h-[72%] overflow-hidden rounded-2xl group">
                        <img 
                          src={schoolProfile.heroImage || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200'} 
                          alt="Siswa Belajar Bersama" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 to-transparent" />
                        <span className="absolute top-4 left-4 bg-slate-900/95 backdrop-blur text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-md border border-slate-800">
                          {schoolProfile.heroBadge || 'KAMPUS UNGGUL'}
                        </span>
                      </div>
                      
                      {/* Live strategic stats ticker inside graphic mock */}
                      <div className="grid grid-cols-2 gap-3 pt-3">
                        <div className="bg-emerald-900/5 hover:bg-emerald-900/10 transition-colors p-3.5 rounded-xl border border-emerald-500/10 text-left">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 leading-none mb-1.5">{schoolProfile.heroStat1Title || 'PENDAFTAR BULAN INI'}</p>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-extrabold text-slate-950 tracking-tight">{schoolProfile.heroStat1Value || '+182'}</span>
                            <span className="text-[10px] text-emerald-600 font-bold">{schoolProfile.heroStat1Label || 'Terverifikasi'}</span>
                          </div>
                        </div>
                        <div className="bg-amber-500/5 hover:bg-amber-500/10 transition-colors p-3.5 rounded-xl border border-amber-500/10 text-left">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-800 leading-none mb-1.5">{schoolProfile.heroStat2Title || 'KUOTA JALUR BEASISWA'}</p>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-extrabold text-slate-950 tracking-tight">{schoolProfile.heroStat2Value || '14 Kursi'}</span>
                            <span className="text-[10px] text-red-500 font-bold animate-pulse">{schoolProfile.heroStat2Label || 'Sisa'}</span>
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
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-8 space-y-6 text-left">
                    <div className="inline-flex items-center gap-1.5 text-amber-700 text-xs font-bold uppercase tracking-widest">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <span>Sambutan Kepala Madrasah</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug">
                      "{schoolProfile.principalTitle || 'Ikhlas Beramal, Mengabdi Demi Pendidikan Akhlak & Karakter Anak'}"
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
                        {schoolProfile.principalSubtext || 'KKG Kabupaten Bandung Barat'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* NEW SECTION: Papan Pengumuman Madrasah */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
              <div className="bg-gradient-to-br from-emerald-50/50 via-white to-slate-50/30 rounded-3xl border border-emerald-100 p-6 md:p-10 shadow-sm text-left">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-emerald-100/60 pb-4 gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-emerald-100/60 text-emerald-900 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 shadow-xs">
                      <Bell className="h-3.5 w-3.5 text-amber-500 animate-bounce" />
                      <span>Informasi Terkini</span>
                    </div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">Papan Pengumuman Madrasah</h2>
                  </div>
                  <button 
                    onClick={() => setShowAnnouncementCenter(true)} 
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 mt-2 md:mt-0 cursor-pointer group bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-100 transition-all shadow-xs"
                  >
                    <span>Buka Pusat Informasi ({announcements.length})</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {announcements.length === 0 ? (
                    <div className="col-span-2 text-center py-12 text-slate-400 text-sm bg-white rounded-2xl border border-slate-100">
                      Belum ada pengumuman yang diterbitkan saat ini.
                    </div>
                  ) : (
                    announcements.slice(0, 4).map((ann) => (
                      <div 
                        key={ann.id}
                        onClick={() => setSelectedAnnouncement(ann)}
                        className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer flex flex-col justify-between group text-left relative overflow-hidden"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-4 mb-3">
                            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" /> {ann.date}
                            </span>
                            {ann.isImportant && (
                              <span className="bg-amber-100 text-amber-900 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse border border-amber-200">
                                Penting
                              </span>
                            )}
                          </div>
                          <h4 className="font-extrabold text-sm text-slate-950 group-hover:text-emerald-800 line-clamp-2 transition-colors leading-snug">
                            {ann.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                            {ann.content}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-emerald-800 font-bold group-hover:text-emerald-950 transition-colors">
                          <span>Baca Detail Pengumuman</span>
                          <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* 3. Interactive Audience Tracks (Parent vs Student strategic choices) */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="bg-slate-950 text-white rounded-3xl p-8 md:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 h-96 w-96 bg-emerald-500 rounded-full blur-3xl opacity-5 transform translate-x-32 -translate-y-32" />
                
                <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto mb-10">
                  <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-2.5">
                    {schoolProfile.audienceSectionTag || 'PEMBELAJARAN BERFOKUS AKHLAK'}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                    {schoolProfile.audienceSectionTitle || 'Program & Pembiasaan Terbaik bagi Calon Siswa'}
                  </h2>
                  <p className="text-slate-400 mt-2 text-xs md:text-sm max-w-2xl">
                    {schoolProfile.audienceSectionDesc || 'Silakan pilih profil Anda di bawah ini untuk melihat komitmen pelayanan pendidikan serta nilai tambah yang kami hadirkan bagi keluarga Anda.'}
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
                        <span className="text-emerald-400 text-xs font-bold font-mono">
                          {schoolProfile.parentTrack1Tag || '01 / SILATURAHMI'}
                        </span>
                        <h4 className="text-base font-bold text-white mt-2 mb-3">
                          {schoolProfile.parentTrack1Title || 'Monitoring Perkembangan Anak'}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {schoolProfile.parentTrack1Desc || 'Kemudahan berkomunikasi langsung dengan wali kelas via WhatsApp untuk memantau ibadah shalat dan progres hafalan surat pendek anak di rumah.'}
                        </p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-left hover:border-emerald-500/30 transition-all">
                        <span className="text-emerald-400 text-xs font-bold font-mono">
                          {schoolProfile.parentTrack2Tag || '02 / AKHLAK MULIA'}
                        </span>
                        <h4 className="text-base font-bold text-white mt-2 mb-3">
                          {schoolProfile.parentTrack2Title || 'Bimbingan Sopan Santun'}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {schoolProfile.parentTrack2Desc || 'Kurikulum kami menekankan adab menghormati orang tua, menyayangi sesama, dan kemandirian perilaku anak dalam kehidupan sehari-hari.'}
                        </p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-left hover:border-emerald-500/30 transition-all">
                        <span className="text-emerald-400 text-xs font-bold font-mono">
                          {schoolProfile.parentTrack3Tag || '03 / BEASISWA'}
                        </span>
                        <h4 className="text-base font-bold text-white mt-2 mb-3">
                          {schoolProfile.parentTrack3Title || 'Biaya Terjangkau & Subsidi'}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {schoolProfile.parentTrack3Desc || 'Madrasah kami mendukung penuh seluruh lapisan masyarakat dengan skema subsidi silang, beasiswa komite, serta kemudahan biaya bagi anak yatim/piatu.'}
                        </p>
                      </div>
                    </>
                  )}
                  {audienceTrack === 'student' && schoolProfile.isStudentAccessActive !== false && (
                    <>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-left hover:border-emerald-500/30 transition-all">
                        <span className="text-amber-400 text-xs font-bold font-mono">
                          {schoolProfile.studentTrack1Tag || '01 / KEAGAMAAN'}
                        </span>
                        <h4 className="text-base font-bold text-white mt-2 mb-3">
                          {schoolProfile.studentTrack1Title || "Bimbingan Iqra & Al-Qur'an"}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {schoolProfile.studentTrack1Desc || 'Belajar mengaji dengan metode yang menyenangkan, dibimbing ustadz/ustadzah penyabar mulai dari nol hingga lancar membaca Al-Qur\'an.'}
                        </p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-left hover:border-emerald-500/30 transition-all">
                        <span className="text-amber-400 text-xs font-bold font-mono">
                          {schoolProfile.studentTrack2Tag || '02 / CERITA ISLAMI'}
                        </span>
                        <h4 className="text-base font-bold text-white mt-2 mb-3">
                          {schoolProfile.studentTrack2Title || 'Kisah Teladan Rasul'}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {schoolProfile.studentTrack2Desc || 'Pembelajaran disisipi dongeng Islami menarik, menceritakan perjuangan nabi dan sahabat untuk menumbuhkan rasa cinta pada agama sejak kecil.'}
                        </p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-left hover:border-emerald-500/30 transition-all">
                        <span className="text-amber-400 text-xs font-bold font-mono">
                          {schoolProfile.studentTrack3Tag || '03 / BERMAIN'}
                        </span>
                        <h4 className="text-base font-bold text-white mt-2 mb-3">
                          {schoolProfile.studentTrack3Title || 'Pramuka & Silat Tapak Suci'}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {schoolProfile.studentTrack3Desc || 'Ikuti kegiatan luar kelas yang asyik mulai dari Pramuka Siaga/Penggalang, mewarnai bersama, hingga olahraga bela diri fisik yang melatih ketangkasan.'}
                        </p>
                      </div>
                    </>
                  )}
                  {audienceTrack === 'alumni' && schoolProfile.isAlumniAccessActive !== false && (
                    <>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-left hover:border-emerald-500/30 transition-all">
                        <span className="text-blue-400 text-xs font-bold font-mono">
                          {schoolProfile.alumniTrack1Tag || '01 / JEJARING ALUMNI'}
                        </span>
                        <h4 className="text-base font-bold text-white mt-2 mb-3">
                          {schoolProfile.alumniTrack1Title || 'Ikatan Alumni MI Cibungur'}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {schoolProfile.alumniTrack1Desc || 'Menjaga silaturahmi antar alumni lintas angkatan untuk bertukar info jenjang SMP/MTS, pondok pesantren, hingga kolaborasi demi kemajuan bersama.'}
                        </p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-left hover:border-emerald-500/30 transition-all">
                        <span className="text-blue-400 text-xs font-bold font-mono">
                          {schoolProfile.alumniTrack2Tag || '02 / DONASI & KONTRIBUSI'}
                        </span>
                        <h4 className="text-base font-bold text-white mt-2 mb-3">
                          {schoolProfile.alumniTrack2Title || 'Sumbangsih Almamater'}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {schoolProfile.alumniTrack2Desc || 'Wadah bagi alumni yang ingin mendonasikan buku perpustakaan, peralatan ibadah, atau sumbangan sarana pendidikan bagi adik kelas yang membutuhkan.'}
                        </p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-left hover:border-emerald-500/30 transition-all">
                        <span className="text-blue-400 text-xs font-bold font-mono">
                          {schoolProfile.alumniTrack3Tag || '03 / KISAH SUKSES'}
                        </span>
                        <h4 className="text-base font-bold text-white mt-2 mb-3">
                          {schoolProfile.alumniTrack3Title || 'Motivasi & Inspirasi'}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {schoolProfile.alumniTrack3Desc || 'Berbagi cerita sukses alumni yang melanjutkan ke pesantren terkemuka atau sekolah favorit untuk memotivasi adik-adik kelas yang masih belajar.'}
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
                  <h4 className="font-extrabold text-sm text-slate-950 mb-2">{schoolProfile.roadmap1Title || 'Kelas I - II: Pembiasaan Adab & Iqra'}</h4>
                  <ul className="text-xs text-slate-500 space-y-2 mt-3 leading-relaxed">
                    {(schoolProfile.roadmap1Points || 'Belajar mengaji Iqra secara bertahap, lancar, dan tanpa paksaan\nPenanaman karakter dasar 5S (Senyum, Sapa, Salam, Sopan, Santun)\nPembelajaran motorik dasar, menggambar Islami, & calistung ramah anak')
                      .split('\n')
                      .filter(Boolean)
                      .map((point, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-emerald-700 font-bold">&bull;</span>
                          <span>{point}</span>
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Step 2 */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all relative z-10 text-left">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-extrabold mb-5 shadow-lg shadow-emerald-900/10">
                    III-IV
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-950 mb-2">{schoolProfile.roadmap2Title || 'Kelas III - IV: Kemandirian & Hafalan Juz Amma'}</h4>
                  <ul className="text-xs text-slate-500 space-y-2 mt-3 leading-relaxed">
                    {(schoolProfile.roadmap2Points || 'Mulai menghafal surat-surat pendek Juz 30 secara rutin berulang\nKegiatan Kepramukaan Siaga melatih kepemimpinan, kerjasama, dan disiplin\nEksplorasi ilmu sains dasar berbasis lingkungan sekitar madrasah')
                      .split('\n')
                      .filter(Boolean)
                      .map((point, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-emerald-700 font-bold">&bull;</span>
                          <span>{point}</span>
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Step 3 */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all relative z-10 text-left">
                  <div className="h-12 w-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-extrabold mb-5 shadow-lg shadow-amber-600/10">
                    V-VI
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-950 mb-2">{schoolProfile.roadmap3Title || 'Kelas V - VI: Kepemimpinan & Kelulusan Berkah'}</h4>
                  <ul className="text-xs text-slate-500 space-y-2 mt-3 leading-relaxed">
                    {(schoolProfile.roadmap3Points || 'Pemantapan hafalan Juz 30 sebagai mahkota kelulusan utama madrasah\nBimbingan belajar intensif menyongsong SMP / MTs favorit Kabupaten\nBakti sosial cilik, tadabbur alam, dan pembiasaan shalat berjamaah mandiri')
                      .split('\n')
                      .filter(Boolean)
                      .map((point, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-amber-600 font-bold">&bull;</span>
                          <span>{point}</span>
                        </li>
                      ))}
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
                  Mengapa {schoolProfile.schoolName} Dipercaya Masyarakat?
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
                  <h3 className="font-extrabold text-sm text-slate-900 mb-2">{schoolProfile.usp1Title || 'Kurikulum Terpadu'}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {schoolProfile.usp1Desc || 'Sinergi apik Kurikulum Merdeka Nasional dengan kurikulum keagamaan Kementerian Agama Republik Indonesia.'}
                  </p>
                </div>

                {/* USP 2 */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 group text-left">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 mb-2">{schoolProfile.usp2Title || 'Pembiasaan Ibadah'}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {schoolProfile.usp2Desc || 'Melatih shalat dhuha, shalat dzuhur berjamaah, zikir harian, hafalan hadits, serta doa fardhu sejak usia dini.'}
                  </p>
                </div>

                {/* USP 3 */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 group text-left">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                    <Globe className="h-5 w-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 mb-2">{schoolProfile.usp3Title || 'Rasio Kelas Nyaman'}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {schoolProfile.usp3Desc || 'Jumlah murid per kelas dibatasi proporsional agar guru dapat memberikan perhatian penuh, sabar, dan kasih sayang intensif.'}
                  </p>
                </div>

                {/* USP 4 */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 group text-left">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 mb-2">{schoolProfile.usp4Title || 'Sangat Ringan & Terjangkau'}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {schoolProfile.usp4Desc || 'Biaya SPP bulanan yang ringan, subsidi khusus anak berprestasi, yatim, dhuafa, serta beasiswa komite komprehensif.'}
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
              <TestimonialsSection testimonials={testimonials} />
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

        {/* VIEW: SEKILAS / SELAYANG PANDANG */}
        {currentView === 'sekilas' && (
          <SekilasMadrasah schoolProfile={schoolProfile} historicalFigures={historicalFigures} />
        )}

        {/* VIEW 2: FASILITAS / VIRTUAL TOUR */}
        {currentView === 'fasilitas' && (
          <VirtualTour facilities={facilities} />
        )}

        {/* VIEW: PROFIL GURU */}
        {currentView === 'guru' && (
          <TeacherProfile teachers={teachers} />
        )}

        {/* VIEW 3: KEGIATAN SISWA */}
        {currentView === 'kegiatan' && (
          <ActivitiesShowcase activities={activities} setView={setView} />
        )}

        {/* VIEW: KABAR KELAS */}
        {currentView === 'kabar-kelas' && (
          <KabarKelasView kabarKelas={kabarKelas} />
        )}

        {/* VIEW 4: PENDAFTARAN PPDB */}
        {currentView === 'ppdb' && (
          <PPDBForm onRegisterSubmit={handleRegisterSubmit} schoolProfile={schoolProfile} />
        )}

        {/* VIEW 5: ADMIN / PORTAL GURU */}
        {currentView === 'admin' && (
          <AdminPortal 
            activities={activities}
            submissions={submissions}
            announcements={announcements}
            teachers={teachers}
            testimonials={testimonials}
            facilities={facilities}
            onAddActivity={handleAddActivity}
            onDeleteActivity={handleDeleteActivity}
            onUpdateSubmissionStatus={handleUpdateSubmissionStatus}
            onUpdateSubmission={handleUpdateSubmission}
            onDeleteSubmission={handleDeleteSubmission}
            onAddAnnouncement={handleAddAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            onAddTeacher={handleAddTeacher}
            onUpdateTeacher={handleUpdateTeacher}
            onDeleteTeacher={handleDeleteTeacher}
            historicalFigures={historicalFigures}
            onAddHistoricalFigure={handleAddHistoricalFigure}
            onUpdateHistoricalFigure={handleUpdateHistoricalFigure}
            onDeleteHistoricalFigure={handleDeleteHistoricalFigure}
            onAddTestimonial={handleAddTestimonial}
            onUpdateTestimonial={handleUpdateTestimonial}
            onDeleteTestimonial={handleDeleteTestimonial}
            onAddFacility={handleAddFacility}
            onUpdateFacility={handleUpdateFacility}
            onDeleteFacility={handleDeleteFacility}
            schoolProfile={schoolProfile}
            onUpdateSchoolProfile={handleUpdateSchoolProfile}
            firebaseStatus={firebaseStatus}
            firebaseError={firebaseError}
            onBackToHome={() => setView('beranda')}
            teacherMenus={teacherMenus}
            onAddTeacherMenu={handleAddTeacherMenu}
            onUpdateTeacherMenu={handleUpdateTeacherMenu}
            onDeleteTeacherMenu={handleDeleteTeacherMenu}
            kabarKelas={kabarKelas}
            onAddKabarKelas={handleAddKabarKelas}
            onUpdateKabarKelas={handleUpdateKabarKelas}
            onDeleteKabarKelas={handleDeleteKabarKelas}
          />
        )}

      </main>

      {/* High Trust Professional Footer */}
      <footer className="bg-slate-950 text-slate-300 mt-20 border-t border-slate-800 shrink-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-left">
            
            {/* School Profile Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                {schoolProfile.logo ? (
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white border border-slate-700 overflow-hidden shrink-0">
                    <img 
                      src={schoolProfile.logo} 
                      alt="Logo" 
                      className="h-full w-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <GraduationCap className="h-6 w-6 text-emerald-500" />
                )}
                <span className="font-extrabold text-sm tracking-tight">{schoolProfile.schoolName}</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {schoolProfile.footerDescription || 'Menyelenggarakan sistem pendidikan dasar berciri khas Islami yang membina generasi sholeh, berakhlak mulia, cerdas, dan mandiri.'}
              </p>
              <div className="flex gap-2.5">
                <a href={schoolProfile.footerInstagram || '#'} target="_blank" rel="noreferrer" className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white text-slate-400 transition-all">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href={schoolProfile.footerFacebook || '#'} target="_blank" rel="noreferrer" className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white text-slate-400 transition-all">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href={schoolProfile.footerYoutube || '#'} target="_blank" rel="noreferrer" className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white text-slate-400 transition-all">
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">{schoolProfile.footerNavTitle || 'Akses Navigasi'}</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><button onClick={() => setView('beranda')} className="hover:text-emerald-500 transition-colors cursor-pointer">Profil Beranda</button></li>
                <li><button onClick={() => setView('fasilitas')} className="hover:text-emerald-500 transition-colors cursor-pointer">Fasilitas Kampus</button></li>
                <li><button onClick={() => setView('kabar-kelas')} className="hover:text-emerald-500 transition-colors cursor-pointer">Kabar Kelas</button></li>
                <li><button onClick={() => setView('kegiatan')} className="hover:text-emerald-500 transition-colors cursor-pointer">Dokumentasi Kegiatan</button></li>
                <li><button onClick={() => setView('ppdb')} className="hover:text-emerald-500 transition-colors cursor-pointer">Pendaftaran PPDB {schoolProfile.ppdbYear || '2026'}</button></li>
                <li className="pt-2 border-t border-slate-800/60 mt-2">
                  <button onClick={() => setView('admin')} className="text-amber-400 hover:text-amber-300 font-extrabold flex items-center gap-1 cursor-pointer">
                    🔑 Pintu Masuk Guru & Staf
                  </button>
                </li>
              </ul>
            </div>

            {/* Operational Info Column */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">{schoolProfile.footerOpTitle || 'Jam Operasional'}</h4>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex gap-2 items-center">
                  <Clock className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{schoolProfile.footerOp1 || 'Senin - Sabtu: 07:15 - 12:45 WIB'}</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Clock className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{schoolProfile.footerOp2 || 'Kegiatan Ekstra: Sabtu setelah Ashar'}</span>
                </li>
                <li className="flex gap-2 items-center">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{schoolProfile.footerOp3 || 'Minggu / Libur Nasional: Tutup'}</span>
                </li>
              </ul>
            </div>

            {/* Kontak Info Column */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">{schoolProfile.footerContactTitle || 'Hubungi Kami'}</h4>
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
            <p>&copy; 2026 Cepi Sopyan DEV. Hak Cipta Dilindungi Undang-Undang.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-emerald-500">Kebijakan Privasi</a>
              <span>&bull;</span>
              <a href="#" className="hover:text-emerald-500">Syarat Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>

      {/* 1. PUSAT PENGUMUMAN MODAL */}
      {showAnnouncementCenter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs animate-fade-in" onClick={() => setShowAnnouncementCenter(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/15">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-extrabold text-base text-slate-950">Pusat Informasi & Pengumuman</h3>
                  <p className="text-[10px] font-bold tracking-wider text-emerald-800 uppercase">Kabar Resmi MI Cibungur I</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAnnouncementCenter(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body / Scrollable List */}
            <div className="p-6 overflow-y-auto space-y-4 max-h-[50vh] scrollbar-thin">
              {announcements.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  Belum ada pengumuman yang diterbitkan saat ini.
                </div>
              ) : (
                announcements.map((ann) => (
                  <div 
                    key={ann.id}
                    onClick={() => {
                      setSelectedAnnouncement(ann);
                    }}
                    className="p-5 bg-slate-50/50 hover:bg-emerald-50/30 border border-slate-100 hover:border-emerald-200 rounded-2xl cursor-pointer transition-all text-left group"
                  >
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> {ann.date}
                      </span>
                      {ann.isImportant && (
                        <span className="bg-amber-100 text-amber-900 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse border border-amber-200">
                          Penting
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-slate-950 group-hover:text-emerald-800 transition-colors leading-snug">
                      {ann.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {ann.content}
                    </p>
                    <div className="mt-3.5 pt-2.5 border-t border-slate-100/50 flex items-center justify-between text-[11px] text-emerald-800 font-bold group-hover:text-emerald-950">
                      <span>Baca Pengumuman Lengkap</span>
                      <span>&rarr;</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowAnnouncementCenter(false)}
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DETAIL PENGUMUMAN MODAL */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs animate-fade-in" onClick={() => setSelectedAnnouncement(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-br from-slate-50 to-white text-left">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {selectedAnnouncement.date}
                  </span>
                  {selectedAnnouncement.isImportant && (
                    <span className="bg-amber-100 text-amber-900 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-200 animate-pulse">
                      Penting
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-base text-slate-950 leading-snug">
                  {selectedAnnouncement.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedAnnouncement(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors shrink-0 ml-4 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[45vh] text-left">
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {selectedAnnouncement.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedAnnouncement(null)}
                className="px-5 py-2.5 text-xs font-extrabold uppercase tracking-widest text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
