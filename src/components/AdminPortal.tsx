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
  ShieldAlert,
  GraduationCap,
  Upload,
  ArrowUp,
  ArrowDown,
  Building,
  Edit2
} from 'lucide-react';
import { Activity, PPDBSubmission, Announcement, SchoolProfile, Teacher, Testimonial, Facility } from '../types';

interface AdminPortalProps {
  activities: Activity[];
  submissions: PPDBSubmission[];
  announcements: Announcement[];
  teachers: Teacher[];
  testimonials: Testimonial[];
  facilities: Facility[];
  onAddActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
  onUpdateSubmissionStatus: (id: string, status: PPDBSubmission['status']) => void;
  onUpdateSubmission: (submission: PPDBSubmission) => void;
  onDeleteSubmission: (id: string) => void;
  onAddAnnouncement: (announcement: Announcement) => void;
  onDeleteAnnouncement?: (id: string) => void;
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
  onAddTestimonial: (testimonial: Testimonial) => void;
  onUpdateTestimonial: (testimonial: Testimonial) => void;
  onDeleteTestimonial: (id: string) => void;
  onAddFacility: (facility: Facility) => void;
  onUpdateFacility: (facility: Facility) => void;
  onDeleteFacility: (id: string) => void;
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

const TESTIMONIAL_AVATAR_PRESETS = [
  { label: 'Bapak Jajang', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
  { label: 'Ibu Nenden', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
  { label: 'Alumni Pria', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200' },
  { label: 'Alumni Wanita', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' },
  { label: 'Siswa', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
];

const FACILITY_IMAGE_PRESETS = [
  { label: 'Ruang Kelas Nyaman', url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800' },
  { label: 'Masjid Al-Ikhlas', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800' },
  { label: 'Perpustakaan Islami', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800' },
  { label: 'Halaman & Olahraga', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800' },
  { label: 'Lab Komputer Baru', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800' },
  { label: 'Peralatan Ekstrakurikuler', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800' }
];

const compressImage = (file: File, maxWidth = 800, maxHeight = 1000, quality = 0.92): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (e) {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = () => {
        resolve(event.target?.result as string);
      };
    };
    reader.onerror = () => {
      resolve('');
    };
  });
};

export default function AdminPortal({
  activities,
  submissions,
  announcements,
  teachers,
  testimonials,
  facilities,
  onAddActivity,
  onDeleteActivity,
  onUpdateSubmissionStatus,
  onUpdateSubmission,
  onDeleteSubmission,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onAddTestimonial,
  onUpdateTestimonial,
  onDeleteTestimonial,
  onAddFacility,
  onUpdateFacility,
  onDeleteFacility,
  schoolProfile,
  onUpdateSchoolProfile,
  firebaseStatus,
  firebaseError
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'kegiatan' | 'pendaftar' | 'pengumuman' | 'profil' | 'guru' | 'testimoni' | 'fasilitas'>('kegiatan');

  // Parse custom grades list
  const gradesList = schoolProfile?.ppdbGrades
    ? schoolProfile.ppdbGrades.split(',').map(s => s.trim()).filter(Boolean)
    : ['Kelas 1 MI (Baru)', 'Kelas 2-3 (Pindahan)', 'Kelas 4-5 (Pindahan)'];

  // Secure Role-Based Gate State
  const [loginMode, setLoginMode] = useState<'guru' | 'admin'>('guru');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPin, setInputPin] = useState('');
  const [userRole, setUserRole] = useState<'guru' | 'admin' | null>(() => {
    return sessionStorage.getItem('admin_role') as 'guru' | 'admin' | null;
  });
  const [pinError, setPinError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);

  React.useEffect(() => {
    if (userRole !== 'admin' && (activeTab === 'testimoni' || activeTab === 'profil')) {
      setActiveTab('kegiatan');
    }
  }, [userRole, activeTab]);

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

  // Teacher Form State & Handlers
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [isUploadingTeacher, setIsUploadingTeacher] = useState(false);
  const [teacherImageSource, setTeacherImageSource] = useState<'upload' | 'link'>('upload');
  const [teacherForm, setTeacherForm] = useState<Omit<Teacher, 'id'>>({
    name: '',
    role: '',
    photo: '',
    education: '',
    bio: '',
    biography: '',
    status: 'Aktif',
    joinedYear: new Date().getFullYear().toString(),
    order: undefined
  });

  const handleTeacherPhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingTeacher(true);
      try {
        const compressed = await compressImage(file, 800, 1000, 0.92);
        setTeacherForm(prev => ({ ...prev, photo: compressed }));
      } catch (err) {
        console.error('Failed to compress teacher photo:', err);
      } finally {
        setIsUploadingTeacher(false);
      }
    }
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeacherId) {
      onUpdateTeacher({
        id: editingTeacherId,
        ...teacherForm,
        order: teacherForm.order !== undefined ? Number(teacherForm.order) : undefined
      });
      setEditingTeacherId(null);
    } else {
      onAddTeacher({
        id: `guru-${Date.now()}`,
        ...teacherForm,
        order: teacherForm.order !== undefined ? Number(teacherForm.order) : teachers.length + 1
      });
    }
    setTeacherForm({
      name: '',
      role: '',
      photo: '',
      education: '',
      bio: '',
      biography: '',
      status: 'Aktif',
      joinedYear: new Date().getFullYear().toString(),
      order: undefined
    });
  };

  const handleStartEditTeacher = (teacher: Teacher) => {
    setEditingTeacherId(teacher.id);
    setTeacherForm({
      name: teacher.name,
      role: teacher.role,
      photo: teacher.photo,
      education: teacher.education,
      bio: teacher.bio || '',
      biography: teacher.biography || '',
      status: teacher.status,
      joinedYear: teacher.joinedYear || '',
      order: teacher.order
    });
    if (teacher.photo && teacher.photo.startsWith('data:image')) {
      setTeacherImageSource('upload');
    } else {
      setTeacherImageSource('link');
    }
  };

  const handleCancelEditTeacher = () => {
    setEditingTeacherId(null);
    setTeacherForm({
      name: '',
      role: '',
      photo: '',
      education: '',
      bio: '',
      biography: '',
      status: 'Aktif',
      joinedYear: new Date().getFullYear().toString(),
      order: undefined
    });
  };

  // Testimonial Form State & Handlers
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [isUploadingTestimonial, setIsUploadingTestimonial] = useState(false);
  const [testimonialImageSource, setTestimonialImageSource] = useState<'upload' | 'link' | 'preset'>('preset');
  const [testimonialForm, setTestimonialForm] = useState<{
    name: string;
    role: 'Orang Tua' | 'Alumni' | 'Siswa';
    text: string;
    avatar: string;
    year: string;
  }>({
    name: '',
    role: 'Orang Tua',
    text: '',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    year: ''
  });

  const handleTestimonialPhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingTestimonial(true);
      try {
        const compressed = await compressImage(file, 200, 200, 0.9);
        setTestimonialForm(prev => ({ ...prev, avatar: compressed }));
      } catch (err) {
        console.error('Failed to compress testimonial avatar:', err);
      } finally {
        setIsUploadingTestimonial(false);
      }
    }
  };

  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTestimonialId) {
      onUpdateTestimonial({
        id: editingTestimonialId,
        ...testimonialForm
      });
      setEditingTestimonialId(null);
    } else {
      onAddTestimonial({
        id: `test-${Date.now()}`,
        ...testimonialForm
      });
    }
    setTestimonialForm({
      name: '',
      role: 'Orang Tua',
      text: '',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
      year: ''
    });
    setTestimonialImageSource('preset');
  };

  const handleStartEditTestimonial = (test: Testimonial) => {
    setEditingTestimonialId(test.id);
    setTestimonialForm({
      name: test.name,
      role: test.role,
      text: test.text,
      avatar: test.avatar,
      year: test.year || ''
    });
    if (test.avatar && test.avatar.startsWith('data:image')) {
      setTestimonialImageSource('upload');
    } else if (TESTIMONIAL_AVATAR_PRESETS.some(preset => preset.url === test.avatar)) {
      setTestimonialImageSource('preset');
    } else {
      setTestimonialImageSource('link');
    }
  };

  const handleCancelEditTestimonial = () => {
    setEditingTestimonialId(null);
    setTestimonialForm({
      name: '',
      role: 'Orang Tua',
      text: '',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
      year: ''
    });
    setTestimonialImageSource('preset');
  };

  // Facilities Form State & Handlers
  const [editingFacilityId, setEditingFacilityId] = useState<string | null>(null);
  const [isUploadingFacility, setIsUploadingFacility] = useState(false);
  const [facilityImageSource, setFacilityImageSource] = useState<'upload' | 'link' | 'preset'>('preset');
  const [facilityForm, setFacilityForm] = useState<{
    name: string;
    description: string;
    tag: string;
    image: string;
  }>({
    name: '',
    description: '',
    tag: 'Kelas',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800'
  });

  const handleFacilityPhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingFacility(true);
      try {
        const compressed = await compressImage(file, 800, 600, 0.85);
        setFacilityForm(prev => ({ ...prev, image: compressed }));
      } catch (err) {
        console.error('Failed to compress facility photo:', err);
      } finally {
        setIsUploadingFacility(false);
      }
    }
  };

  const handleFacilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityForm.name.trim()) return;

    if (editingFacilityId) {
      onUpdateFacility({
        id: editingFacilityId,
        ...facilityForm
      });
      setEditingFacilityId(null);
    } else {
      onAddFacility({
        id: `fac-${Date.now()}`,
        ...facilityForm
      });
    }

    setFacilityForm({
      name: '',
      description: '',
      tag: 'Kelas',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800'
    });
    setFacilityImageSource('preset');
  };

  const handleStartEditFacility = (fac: Facility) => {
    setEditingFacilityId(fac.id);
    setFacilityForm({
      name: fac.name,
      description: fac.description,
      tag: fac.tag,
      image: fac.image
    });
    if (fac.image && fac.image.startsWith('data:image')) {
      setFacilityImageSource('upload');
    } else if (FACILITY_IMAGE_PRESETS.some(preset => preset.url === fac.image)) {
      setFacilityImageSource('preset');
    } else {
      setFacilityImageSource('link');
    }
  };

  const handleCancelEditFacility = () => {
    setEditingFacilityId(null);
    setFacilityForm({
      name: '',
      description: '',
      tag: 'Kelas',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800'
    });
    setFacilityImageSource('preset');
  };

  // PPDB Submission Edit State & Handlers
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [submissionForm, setSubmissionForm] = useState<{
    id: string;
    studentName: string;
    parentName: string;
    phone: string;
    email: string;
    prevSchool: string;
    grade: string;
    notes: string;
    status: PPDBSubmission['status'];
    date: string;
  }>({
    id: '',
    studentName: '',
    parentName: '',
    phone: '',
    email: '',
    prevSchool: '',
    grade: '',
    notes: '',
    status: 'Menunggu Review',
    date: ''
  });

  const handleStartEditSubmission = (sub: PPDBSubmission) => {
    setEditingSubId(sub.id);
    setSubmissionForm({
      id: sub.id,
      studentName: sub.studentName,
      parentName: sub.parentName,
      phone: sub.phone,
      email: sub.email,
      prevSchool: sub.prevSchool,
      grade: sub.grade,
      notes: sub.notes || '',
      status: sub.status,
      date: sub.date
    });
  };

  const handleCancelEditSubmission = () => {
    setEditingSubId(null);
  };

  const handleSubmissionFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionForm.studentName.trim()) return;

    onUpdateSubmission({
      ...submissionForm
    });
    setEditingSubId(null);
  };

  const handleMoveTeacherUp = async (teacher: Teacher) => {
    const sortedList = [...teachers].sort((a, b) => {
      const orderA = a.order !== undefined && a.order !== null ? Number(a.order) : 9999;
      const orderB = b.order !== undefined && b.order !== null ? Number(b.order) : 9999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.name.localeCompare(b.name);
    });

    const index = sortedList.findIndex(t => t.id === teacher.id);
    if (index > 0) {
      const otherTeacher = sortedList[index - 1];
      const updatedList = sortedList.map((t, idx) => {
        if (idx === index) {
          return { ...t, order: index }; // Swap position
        }
        if (idx === index - 1) {
          return { ...t, order: index + 1 }; // Swap position
        }
        return { ...t, order: idx + 1 }; // Reset order sequentially
      });

      const movedTeacher = updatedList.find(t => t.id === teacher.id);
      const swappedTeacher = updatedList.find(t => t.id === otherTeacher.id);
      if (movedTeacher) await onUpdateTeacher(movedTeacher);
      if (swappedTeacher) await onUpdateTeacher(swappedTeacher);
    }
  };

  const handleMoveTeacherDown = async (teacher: Teacher) => {
    const sortedList = [...teachers].sort((a, b) => {
      const orderA = a.order !== undefined && a.order !== null ? Number(a.order) : 9999;
      const orderB = b.order !== undefined && b.order !== null ? Number(b.order) : 9999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.name.localeCompare(b.name);
    });

    const index = sortedList.findIndex(t => t.id === teacher.id);
    if (index >= 0 && index < sortedList.length - 1) {
      const otherTeacher = sortedList[index + 1];
      const updatedList = sortedList.map((t, idx) => {
        if (idx === index) {
          return { ...t, order: index + 2 }; // Swap position
        }
        if (idx === index + 1) {
          return { ...t, order: index + 1 }; // Swap position
        }
        return { ...t, order: idx + 1 }; // Reset order sequentially
      });

      const movedTeacher = updatedList.find(t => t.id === teacher.id);
      const swappedTeacher = updatedList.find(t => t.id === otherTeacher.id);
      if (movedTeacher) await onUpdateTeacher(movedTeacher);
      if (swappedTeacher) await onUpdateTeacher(swappedTeacher);
    }
  };

  // School Profile Form State
  const [profileForm, setProfileForm] = useState<SchoolProfile>(() => {
    return schoolProfile || {
      schoolName: '',
      schoolSlogan: '',
      headline: '',
      description: '',
      logo: '',
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
  const [isUploading, setIsUploading] = useState(false);

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
      <div className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-2xl mb-8">
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ${userRole === 'admin' ? 'lg:grid-cols-7' : 'lg:grid-cols-5'} gap-2`}>
          <button
            onClick={() => setActiveTab('kegiatan')}
            className={`group flex items-center gap-2.5 px-4 py-3 text-xs md:text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer shadow-sm border ${
              activeTab === 'kegiatan'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-500 shadow-emerald-600/20 shadow-md scale-[1.02]'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-200 hover:scale-[1.01]'
            }`}
          >
            <PlusCircle className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110 ${activeTab === 'kegiatan' ? 'text-white' : 'text-emerald-600'}`} />
            <span className="truncate">Upload Kegiatan</span>
          </button>

          <button
            onClick={() => setActiveTab('pendaftar')}
            className={`group flex items-center justify-between gap-2 px-4 py-3 text-xs md:text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer shadow-sm border ${
              activeTab === 'pendaftar'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-500 shadow-emerald-600/20 shadow-md scale-[1.02]'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-200 hover:scale-[1.01]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Users className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110 ${activeTab === 'pendaftar' ? 'text-white' : 'text-emerald-600'}`} />
              <span className="truncate">Kelola PPDB</span>
            </div>
            {submissions.length > 0 && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold shrink-0 shadow-sm ${
                activeTab === 'pendaftar'
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-amber-500 text-white'
              }`}>
                {submissions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('pengumuman')}
            className={`group flex items-center gap-2.5 px-4 py-3 text-xs md:text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer shadow-sm border ${
              activeTab === 'pengumuman'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-500 shadow-emerald-600/20 shadow-md scale-[1.02]'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-200 hover:scale-[1.01]'
            }`}
          >
            <FileCheck className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110 ${activeTab === 'pengumuman' ? 'text-white' : 'text-emerald-600'}`} />
            <span className="truncate">Tulis Pengumuman</span>
          </button>

          <button
            onClick={() => setActiveTab('guru')}
            className={`group flex items-center justify-between gap-2 px-4 py-3 text-xs md:text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer shadow-sm border ${
              activeTab === 'guru'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-500 shadow-emerald-600/20 shadow-md scale-[1.02]'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-200 hover:scale-[1.01]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <GraduationCap className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110 ${activeTab === 'guru' ? 'text-white font-black' : 'text-emerald-600'}`} />
              <span className="truncate">Kelola Guru</span>
            </div>
            {teachers.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold shrink-0 border ${
                activeTab === 'guru'
                  ? 'bg-white/20 text-white border-white/10'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-100/50'
              }`}>
                {teachers.length}
              </span>
            )}
          </button>

          {userRole === 'admin' && (
            <button
              onClick={() => setActiveTab('testimoni')}
              className={`group flex items-center justify-between gap-2 px-4 py-3 text-xs md:text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer shadow-sm border ${
                activeTab === 'testimoni'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-500 shadow-emerald-600/20 shadow-md scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-200 hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <MessageSquare className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110 ${activeTab === 'testimoni' ? 'text-white' : 'text-emerald-600'}`} />
                <span className="truncate">Alumni & Testimoni</span>
              </div>
              {testimonials.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold shrink-0 border ${
                  activeTab === 'testimoni'
                    ? 'bg-white/20 text-white border-white/10'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-100/50'
                }`}>
                  {testimonials.length}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => setActiveTab('fasilitas')}
            className={`group flex items-center justify-between gap-2 px-4 py-3 text-xs md:text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer shadow-sm border ${
              activeTab === 'fasilitas'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-500 shadow-emerald-600/20 shadow-md scale-[1.02]'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-200 hover:scale-[1.01]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Building className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110 ${activeTab === 'fasilitas' ? 'text-white' : 'text-emerald-600'}`} />
              <span className="truncate">Kelola Fasilitas</span>
            </div>
            {facilities.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold shrink-0 border ${
                activeTab === 'fasilitas'
                  ? 'bg-white/20 text-white border-white/10'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-100/50'
              }`}>
                {facilities.length}
              </span>
            )}
          </button>

          {userRole === 'admin' && (
            <button
              onClick={() => setActiveTab('profil')}
              className={`group flex items-center gap-2.5 px-4 py-3 text-xs md:text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer shadow-sm border ${
                activeTab === 'profil'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-500 shadow-emerald-600/20 shadow-md scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-200 hover:scale-[1.01]'
              }`}
            >
              <Sparkles className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110 ${activeTab === 'profil' ? 'text-white' : 'text-emerald-600'}`} />
              <span className="truncate">Edit Profil / Kustom</span>
            </button>
          )}
        </div>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Upload Foto dari Perangkat</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              setIsUploading(true);
                              const base64 = await compressImage(file, 1200, 900, 0.90);
                              setCustomImageURL(base64);
                            } catch (err) {
                              console.error(err);
                            } finally {
                              setIsUploading(false);
                            }
                          }
                        }}
                        className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer border border-slate-200 rounded-xl p-1 bg-slate-50/50"
                      />
                      {isUploading && (
                        <p className="text-[10px] text-emerald-600 mt-1 animate-pulse font-medium">Sedang memproses dan mengompres foto...</p>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Atau Gunakan Link URL Foto Custom</span>
                      <input
                        type="url"
                        placeholder="Masukkan URL foto custom (https://...)"
                        value={customImageURL.startsWith('data:') ? '' : customImageURL}
                        onChange={(e) => setCustomImageURL(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                      />
                    </div>
                  </div>

                  {customImageURL && (
                    <div className="mt-3 flex items-center gap-3 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                      <div className="h-14 w-14 rounded-lg overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-white">
                        <img src={customImageURL} className="h-full w-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Pratinjau Foto Kegiatan</p>
                        <p className="text-[10px] text-emerald-600 font-medium">
                          {customImageURL.startsWith('data:') ? '✓ Terunggah langsung dari perangkat (Optimal)' : '✓ Menggunakan URL link eksternal'}
                        </p>
                      </div>
                    </div>
                  )}
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
                              {/* Edit Submission Button */}
                              <button
                                onClick={() => handleStartEditSubmission(sub)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                                title="Edit Data Calon Siswa"
                              >
                                <Edit2 className="h-4.5 w-4.5" />
                              </button>
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

            {/* Modal Edit Pendaftar PPDB */}
            {editingSubId && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                <div className="bg-white rounded-3xl border border-slate-100 max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center shrink-0">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Edit2 className="h-4 w-4 text-emerald-600" />
                        <span>Edit Data Calon Siswa (PPDB)</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">ID: {editingSubId} • Terdaftar: {submissionForm.date}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCancelEditSubmission}
                      className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-all cursor-pointer font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSubmissionFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-grow text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Nama Lengkap Siswa */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Nama Lengkap Siswa *
                        </label>
                        <input
                          type="text"
                          required
                          value={submissionForm.studentName}
                          onChange={(e) => setSubmissionForm({ ...submissionForm, studentName: e.target.value })}
                          className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-semibold"
                        />
                      </div>

                      {/* Nama Orang Tua / Wali */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Nama Orang Tua / Wali *
                        </label>
                        <input
                          type="text"
                          required
                          value={submissionForm.parentName}
                          onChange={(e) => setSubmissionForm({ ...submissionForm, parentName: e.target.value })}
                          className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* No WhatsApp */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          No. WhatsApp Aktif *
                        </label>
                        <input
                          type="text"
                          required
                          value={submissionForm.phone}
                          onChange={(e) => setSubmissionForm({ ...submissionForm, phone: e.target.value })}
                          className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-semibold"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Alamat Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={submissionForm.email}
                          onChange={(e) => setSubmissionForm({ ...submissionForm, email: e.target.value })}
                          className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Sekolah Asal */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Sekolah Asal *
                        </label>
                        <input
                          type="text"
                          required
                          value={submissionForm.prevSchool}
                          onChange={(e) => setSubmissionForm({ ...submissionForm, prevSchool: e.target.value })}
                          className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-semibold"
                        />
                      </div>

                      {/* Pilihan Kelas */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Pilihan Kelas *
                        </label>
                        <select
                          value={submissionForm.grade}
                          onChange={(e) => setSubmissionForm({ ...submissionForm, grade: e.target.value })}
                          className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-bold cursor-pointer"
                        >
                          {gradesList.map((grade) => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Catatan / Estimasi Beasiswa */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Klaim Beasiswa & Catatan Khusus
                      </label>
                      <textarea
                        rows={3}
                        value={submissionForm.notes}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, notes: e.target.value })}
                        className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-semibold leading-relaxed"
                        placeholder="Contoh: Hafal Juz 30 (Klaim Beasiswa Utama Tahfidz)"
                      />
                    </div>

                    {/* Status Seleksi */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Status Pendaftaran
                      </label>
                      <select
                        value={submissionForm.status}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, status: e.target.value as PPDBSubmission['status'] })}
                        className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-bold cursor-pointer"
                      >
                        <option value="Menunggu Review">Review Berkas</option>
                        <option value="Jadwal Wawancara">Wawancara</option>
                        <option value="Diterima">Diterima</option>
                        <option value="Ditolak">Ditolak</option>
                      </select>
                    </div>

                    {/* Form Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-slate-100 justify-end">
                      <button
                        type="button"
                        onClick={handleCancelEditSubmission}
                        className="bg-slate-100 text-slate-700 text-xs font-bold py-2.5 px-5 rounded-xl hover:bg-slate-200 transition-all cursor-pointer text-center"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all shadow-md cursor-pointer text-center font-bold"
                      >
                        Simpan Perubahan
                      </button>
                    </div>
                  </form>
                </div>
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

        {activeTab === 'guru' && (
          <>
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm text-left flex flex-col h-fit">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                <GraduationCap className="h-5 w-5 text-emerald-600" />
                <span>{editingTeacherId ? 'Edit Profil Guru' : 'Tambah Guru / Staf Baru'}</span>
              </h3>

              <form onSubmit={handleTeacherSubmit} className="space-y-4">
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Nama Lengkap & Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ustadzah Siti Aminah, S.Pd."
                    value={teacherForm.name}
                    onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                  />
                </div>

                {/* Jabatan / Peran */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Jabatan / Peran Pengajaran *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Guru Kelas I & Pembimbing Tahfidz"
                    value={teacherForm.role}
                    onChange={(e) => setTeacherForm({ ...teacherForm, role: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                  />
                </div>

                {/* Riwayat Pendidikan */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Riwayat Pendidikan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: S1 PGMI - UIN Sunan Gunung Djati Bandung"
                    value={teacherForm.education}
                    onChange={(e) => setTeacherForm({ ...teacherForm, education: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                  />
                </div>

                 {/* Pesan Motivasi / Bio */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Pesan Pendidik & Motivasi
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Mendidik dengan sabar dan ikhlas untuk mencetak hafizh Qur'an yang beradab mulia."
                    value={teacherForm.bio}
                    onChange={(e) => setTeacherForm({ ...teacherForm, bio: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                  />
                </div>

                {/* Biografi Singkat */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Biografi Singkat Guru
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Lahir di Bandung Barat, mengabdi sejak tahun 2018 dengan keahlian khusus di bidang tahfizh Al-Qur'an dan bimbingan karakter anak usia dasar."
                    value={teacherForm.biography}
                    onChange={(e) => setTeacherForm({ ...teacherForm, biography: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Tahun Mulai Bertugas */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Tahun Gabung
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 2018"
                      value={teacherForm.joinedYear}
                      onChange={(e) => setTeacherForm({ ...teacherForm, joinedYear: e.target.value })}
                      className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>

                  {/* Status Keaktifan */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Keaktifan
                    </label>
                    <select
                      value={teacherForm.status}
                      onChange={(e) => setTeacherForm({ ...teacherForm, status: e.target.value })}
                      className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Cuti">Cuti</option>
                    </select>
                  </div>

                  {/* No. Urut Tampilan */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      No. Urutan
                    </label>
                    <input
                      type="number"
                      placeholder="No."
                      min={1}
                      value={teacherForm.order !== undefined ? teacherForm.order : ''}
                      onChange={(e) => setTeacherForm({ ...teacherForm, order: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* Foto Upload & Preview */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Foto Guru (Upload langsung dari HP / Laptop)
                  </label>
                  
                  {/* Image Source Toggle */}
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setTeacherImageSource('upload')}
                      className={`flex-1 py-1 px-2 text-[10px] font-bold rounded-lg border transition-all ${
                        teacherImageSource === 'upload'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 animate-pulse-once'
                          : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      Upload File Foto
                    </button>
                    <button
                      type="button"
                      onClick={() => setTeacherImageSource('link')}
                      className={`flex-1 py-1 px-2 text-[10px] font-bold rounded-lg border transition-all ${
                        teacherImageSource === 'link'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      Gunakan Link URL
                    </button>
                  </div>

                  {teacherImageSource === 'upload' ? (
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                          <Upload className="h-6 w-6 text-slate-400 mb-2" />
                          <p className="text-[10px] text-slate-500 font-semibold">
                            Klik untuk upload foto guru
                          </p>
                          <p className="text-[9px] text-slate-400 mt-1">
                            Format JPG/PNG, maksimal 2MB
                          </p>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleTeacherPhotoFileChange}
                        />
                      </label>
                    </div>
                  ) : (
                    <input
                      type="url"
                      placeholder="Masukkan link gambar (https://...)"
                      value={teacherForm.photo}
                      onChange={(e) => setTeacherForm({ ...teacherForm, photo: e.target.value })}
                      className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  )}

                  {/* Foto Preview */}
                  {teacherForm.photo && (
                    <div className="mt-3 flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <img 
                        src={teacherForm.photo} 
                        alt="Preview Guru" 
                        className="h-14 w-14 rounded-lg object-cover border border-slate-200 bg-white"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-grow">
                        <p className="text-[10px] text-slate-400 font-medium">Pratinjau Foto Guru</p>
                        <button
                          type="button"
                          onClick={() => setTeacherForm({ ...teacherForm, photo: '' })}
                          className="text-[10px] text-red-500 hover:text-red-700 font-bold mt-1 block"
                        >
                          Hapus Foto
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="pt-4 flex gap-2">
                  <button
                    type="submit"
                    disabled={isUploadingTeacher}
                    className="flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-xl shadow-md transition-all cursor-pointer text-center"
                  >
                    {isUploadingTeacher ? 'Mengompres...' : editingTeacherId ? 'Simpan Perubahan' : 'Tambahkan Guru'}
                  </button>
                  {editingTeacherId && (
                    <button
                      type="button"
                      onClick={handleCancelEditTeacher}
                      className="px-4 py-3 text-xs font-bold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List / Directory on the Right */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm text-left flex flex-col h-full">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  <span>Daftar Guru & Staf ({teachers.length})</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">Pilih guru untuk mengedit data</span>
              </div>

              {teachers.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
                  {[...teachers].sort((a, b) => {
                    const orderA = a.order !== undefined && a.order !== null ? Number(a.order) : 9999;
                    const orderB = b.order !== undefined && b.order !== null ? Number(b.order) : 9999;
                    if (orderA !== orderB) {
                      return orderA - orderB;
                    }
                    return a.name.localeCompare(b.name);
                  }).map((teacher, sortedIndex, sortedArr) => (
                    <div 
                      key={teacher.id} 
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-emerald-200 hover:bg-emerald-50/10 transition-all"
                    >
                      <div className="flex gap-3.5 items-center">
                        <img 
                          src={teacher.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'} 
                          alt={teacher.name} 
                          className="h-12 w-12 rounded-full object-cover border border-slate-200 bg-white"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-xs text-slate-800 leading-tight">
                              {teacher.name}
                            </h4>
                            <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md border border-emerald-100">
                              Urut: {teacher.order !== undefined ? teacher.order : sortedIndex + 1}
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                              teacher.status === 'Aktif'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {teacher.status || 'Aktif'}
                            </span>
                          </div>
                          <p className="text-[10px] text-emerald-700 font-bold mt-1">
                            {teacher.role}
                          </p>
                          <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">
                            Pendidikan: {teacher.education || '-'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 self-end sm:self-center items-center">
                        {/* Order/Layout Adjustment Controls */}
                        <div className="flex gap-1 pr-1.5 border-r border-slate-200/60 mr-1">
                          <button
                            type="button"
                            disabled={sortedIndex === 0}
                            onClick={() => handleMoveTeacherUp(teacher)}
                            className="p-1 rounded bg-slate-100 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 disabled:opacity-30 disabled:hover:bg-slate-100 disabled:hover:text-slate-500 cursor-pointer border border-slate-200/40"
                            title="Pindahkan ke Atas"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={sortedIndex === sortedArr.length - 1}
                            onClick={() => handleMoveTeacherDown(teacher)}
                            className="p-1 rounded bg-slate-100 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 disabled:opacity-30 disabled:hover:bg-slate-100 disabled:hover:text-slate-500 cursor-pointer border border-slate-200/40"
                            title="Pindahkan ke Bawah"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleStartEditTeacher(teacher)}
                          className="px-3 py-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg cursor-pointer border border-emerald-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteTeacher(teacher.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Hapus Profil Guru"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100/50 space-y-3">
                  <Users className="h-8 w-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">Belum ada data guru terdaftar.</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'testimoni' && (
          <>
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm text-left flex flex-col h-fit animate-fade-in">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                <MessageSquare className="h-5 w-5 text-emerald-600" />
                <span>{editingTestimonialId ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}</span>
              </h3>

              <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bapak H. Jajang"
                    value={testimonialForm.name}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-semibold"
                  />
                </div>

                {/* Peran / Kategori */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Peran / Kategori *
                  </label>
                  <select
                    value={testimonialForm.role}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value as any })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-medium"
                  >
                    <option value="Orang Tua">Orang Tua</option>
                    <option value="Alumni">Alumni</option>
                    <option value="Siswa">Siswa</option>
                  </select>
                </div>

                {/* Keterangan / Subtext (e.g. Wali Murid Kelas V) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Subtext Keterangan (Asal / Angkatan) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Wali Murid Kelas V (Asal Kp. Cibungur)"
                    value={testimonialForm.year}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, year: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-medium"
                  />
                </div>

                {/* Isi Testimoni */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Isi Testimoni / Pengalaman *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan pengalaman atau kesan pesan terhadap MI Cibungur I di sini..."
                    value={testimonialForm.text}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50 leading-relaxed font-medium"
                  />
                </div>

                {/* Pilihan Foto / Avatar */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Foto / Avatar Testimoni
                  </label>

                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setTestimonialImageSource('preset')}
                      className={`flex-1 py-1.5 px-2 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                        testimonialImageSource === 'preset'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                          : 'bg-white border-slate-200 text-slate-500 font-medium'
                      }`}
                    >
                      Preset Profil
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestimonialImageSource('upload')}
                      className={`flex-1 py-1.5 px-2 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                        testimonialImageSource === 'upload'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                          : 'bg-white border-slate-200 text-slate-500 font-medium'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestimonialImageSource('link')}
                      className={`flex-1 py-1.5 px-2 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                        testimonialImageSource === 'link'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                          : 'bg-white border-slate-200 text-slate-500 font-medium'
                      }`}
                    >
                      URL Link
                    </button>
                  </div>

                  {testimonialImageSource === 'preset' && (
                    <div className="grid grid-cols-5 gap-2 pt-1">
                      {TESTIMONIAL_AVATAR_PRESETS.map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => setTestimonialForm({ ...testimonialForm, avatar: preset.url })}
                          className={`relative p-1 rounded-lg border hover:border-emerald-500 transition-colors cursor-pointer ${
                            testimonialForm.avatar === preset.url ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 bg-slate-50/20'
                          }`}
                          title={preset.label}
                        >
                          <img src={preset.url} alt={preset.label} className="w-8 h-8 rounded-full object-cover mx-auto" />
                        </button>
                      ))}
                    </div>
                  )}

                  {testimonialImageSource === 'upload' && (
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-3 pb-3 text-center px-4">
                          <Upload className="h-5 w-5 text-slate-400 mb-1" />
                          <p className="text-[10px] text-slate-500 font-semibold">Upload foto profil</p>
                          <p className="text-[8px] text-slate-400">JPG/PNG</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleTestimonialPhotoFileChange}
                        />
                      </label>
                    </div>
                  )}

                  {testimonialImageSource === 'link' && (
                    <input
                      type="url"
                      placeholder="Masukkan link gambar (https://...)"
                      value={testimonialForm.avatar}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, avatar: e.target.value })}
                      className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-medium"
                    />
                  )}

                  {testimonialForm.avatar && (
                    <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100 mt-2">
                      <img src={testimonialForm.avatar} alt="Preview Avatar" className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 animate-fade-in" />
                      <div className="text-[10px] text-slate-400">
                        {isUploadingTestimonial ? 'Mengompres foto...' : 'Preview Foto Aktif'}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="submit"
                    className="flex-grow py-3 px-4 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-950 transition-colors cursor-pointer shadow-md"
                  >
                    {editingTestimonialId ? 'Simpan Perubahan' : 'Publish Testimoni'}
                  </button>
                  {editingTestimonialId && (
                    <button
                      type="button"
                      onClick={handleCancelEditTestimonial}
                      className="py-3 px-4 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col h-fit text-left animate-fade-in">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                <span>Daftar Testimoni Wali Murid & Alumni ({testimonials.length})</span>
                <span className="text-[10px] text-slate-400 font-mono">Tampil di Halaman Depan</span>
              </h3>

              {testimonials.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {testimonials.map((test) => (
                    <div key={test.id} className="p-4 rounded-xl border border-slate-100 hover:shadow-sm transition-all bg-slate-50/50 space-y-3 relative">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img src={test.avatar} alt={test.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" />
                          <div>
                            <h4 className="font-extrabold text-xs text-slate-900">{test.name}</h4>
                            <p className="text-[9px] text-slate-400 mt-0.5 font-semibold leading-none">{test.year}</p>
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          test.role === 'Orang Tua'
                            ? 'bg-emerald-100 text-emerald-800'
                            : test.role === 'Alumni'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                        }`}>
                          {test.role}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 italic leading-relaxed">
                        "{test.text}"
                      </p>

                      <div className="flex justify-end gap-2 border-t border-slate-100/60 pt-3 mt-1">
                        <button
                          type="button"
                          onClick={() => handleStartEditTestimonial(test)}
                          className="px-3 py-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg cursor-pointer border border-emerald-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteTestimonial(test.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Hapus Testimoni"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100/50 space-y-3">
                  <MessageSquare className="h-8 w-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">Belum ada testimoni terdaftar.</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'fasilitas' && (
          <>
            {/* Form Tambah/Edit Fasilitas */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm text-left flex flex-col h-fit animate-fade-in">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Building className="h-5 w-5 text-emerald-600" />
                <span>{editingFacilityId ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}</span>
              </h3>

              <form onSubmit={handleFacilitySubmit} className="space-y-4">
                {/* Nama Fasilitas */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Nama Fasilitas *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Lab Komputer MI Cibungur I"
                    value={facilityForm.name}
                    onChange={(e) => setFacilityForm({ ...facilityForm, name: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-semibold"
                  />
                </div>

                {/* Deskripsi Fasilitas */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Deskripsi / Penjelasan Singkat *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Jelaskan kenyamanan, kegunaan, atau alat pendukung yang ada di fasilitas ini..."
                    value={facilityForm.description}
                    onChange={(e) => setFacilityForm({ ...facilityForm, description: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-semibold leading-relaxed"
                  />
                </div>

                {/* Kategori / Label Tag */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Label Kategori / Tag *
                  </label>
                  <select
                    value={facilityForm.tag}
                    onChange={(e) => setFacilityForm({ ...facilityForm, tag: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-bold"
                  >
                    <option value="Kelas">Kelas</option>
                    <option value="Ibadah">Ibadah</option>
                    <option value="Literasi">Literasi</option>
                    <option value="Fisik">Olahraga / Fisik</option>
                    <option value="Laboratorium">Laboratorium</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Image Source Selection */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Sumber Foto Fasilitas
                  </label>
                  <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl mb-3">
                    <button
                      type="button"
                      onClick={() => setFacilityImageSource('preset')}
                      className={`py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        facilityImageSource === 'preset'
                          ? 'bg-white text-emerald-800 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Preset Galeri
                    </button>
                    <button
                      type="button"
                      onClick={() => setFacilityImageSource('upload')}
                      className={`py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        facilityImageSource === 'upload'
                          ? 'bg-white text-emerald-800 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Upload Foto
                    </button>
                    <button
                      type="button"
                      onClick={() => setFacilityImageSource('link')}
                      className={`py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        facilityImageSource === 'link'
                          ? 'bg-white text-emerald-800 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Link Web (URL)
                    </button>
                  </div>

                  {facilityImageSource === 'preset' && (
                    <div className="space-y-2">
                      <label className="block text-[10px] text-slate-400">Pilih dari preset berkualitas tinggi:</label>
                      <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                        {FACILITY_IMAGE_PRESETS.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setFacilityForm({ ...facilityForm, image: preset.url })}
                            className={`p-1 rounded-xl border text-left transition-all overflow-hidden flex flex-col gap-1 hover:border-emerald-500 bg-slate-50/50 ${
                              facilityForm.image === preset.url
                                ? 'border-emerald-500 ring-2 ring-emerald-100'
                                : 'border-slate-150'
                            }`}
                          >
                            <img src={preset.url} alt={preset.label} className="h-12 w-full object-cover rounded-lg" />
                            <span className="text-[9px] font-bold text-slate-700 truncate w-full px-1">{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {facilityImageSource === 'upload' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-emerald-500 transition-all">
                          <div className="flex flex-col items-center justify-center pt-3 pb-3">
                            <Upload className="w-5 h-5 text-slate-400 mb-1" />
                            <p className="text-[10px] text-slate-500 font-bold">
                              {isUploadingFacility ? 'Sedang memproses...' : 'Klik untuk Pilih & Upload'}
                            </p>
                            <p className="text-[9px] text-slate-400 mt-0.5">Format JPG/PNG (Kompresi otomatis)</p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingFacility}
                            onChange={handleFacilityPhotoFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {facilityImageSource === 'link' && (
                    <div>
                      <input
                        type="url"
                        placeholder="Masukkan URL Gambar (https://...)"
                        value={facilityForm.image}
                        onChange={(e) => setFacilityForm({ ...facilityForm, image: e.target.value })}
                        className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-mono"
                      />
                    </div>
                  )}

                  {/* Image Preview */}
                  {facilityForm.image && (
                    <div className="mt-3 p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                      <img
                        src={facilityForm.image}
                        alt="Preview"
                        className="h-12 w-16 object-cover rounded-lg border border-slate-200 shrink-0"
                      />
                      <div className="overflow-hidden">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Preview Gambar Terpilih</p>
                        <p className="text-[10px] text-slate-400 truncate font-mono">{facilityForm.image}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex gap-2 pt-2 border-t border-slate-50">
                  {editingFacilityId && (
                    <button
                      type="button"
                      onClick={handleCancelEditFacility}
                      className="flex-1 bg-slate-100 text-slate-700 text-xs font-bold py-3 rounded-xl hover:bg-slate-200 transition-all cursor-pointer text-center"
                    >
                      Batal
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isUploadingFacility}
                    className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md cursor-pointer text-center font-bold"
                  >
                    {editingFacilityId ? 'Simpan Perubahan' : 'Tambah Fasilitas'}
                  </button>
                </div>
              </form>
            </div>

            {/* List Fasilitas Terdaftar */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm text-left flex flex-col animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Fasilitas Madrasah ({facilities.length})</h3>
                  <p className="text-xs text-slate-400">Seluruh fasilitas penunjang yang ditampilkan di halaman depan web.</p>
                </div>
              </div>

              {facilities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[640px] overflow-y-auto pr-1">
                  {facilities.map((fac) => (
                    <div
                      key={fac.id}
                      className="group border border-slate-150 rounded-2xl overflow-hidden flex flex-col bg-slate-50/20 hover:border-emerald-300 hover:shadow-md transition-all duration-300"
                    >
                      <div className="h-32 w-full overflow-hidden relative">
                        <img src={fac.image} alt={fac.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                        <span className="absolute top-2.5 left-2.5 bg-emerald-800 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-sm tracking-wide uppercase">
                          {fac.tag}
                        </span>
                      </div>
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div className="space-y-1">
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{fac.name}</h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3 h-12 overflow-hidden">{fac.description}</p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 border-t border-slate-100 pt-3 mt-3">
                          <button
                            onClick={() => handleStartEditFacility(fac)}
                            className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus fasilitas "${fac.name}"?`)) {
                                onDeleteFacility(fac.id);
                              }
                            }}
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl transition-all cursor-pointer"
                            title="Hapus Fasilitas"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100/50 space-y-3">
                  <Building className="h-8 w-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">Belum ada fasilitas terdaftar.</p>
                </div>
              )}
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

                {/* Logo Madrasah Input & Direct Upload */}
                <div className="bg-emerald-50/30 rounded-2xl border border-emerald-100/50 p-4 space-y-3">
                  <h5 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">Logo Madrasah</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Upload Logo dari Perangkat</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              setIsUploading(true);
                              const base64 = await compressImage(file, 600, 600, 0.95); // 600x600 for high sharpness
                              setProfileForm({ ...profileForm, logo: base64 });
                            } catch (err) {
                              console.error(err);
                            } finally {
                              setIsUploading(false);
                            }
                          }
                        }}
                        className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer border border-slate-200 rounded-xl p-1 bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Atau Gunakan Link URL Logo</span>
                      <input
                        type="url"
                        placeholder="Masukkan URL logo (https://...)"
                        value={profileForm.logo?.startsWith('data:') ? '' : (profileForm.logo || '')}
                        onChange={(e) => setProfileForm({ ...profileForm, logo: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-white flex items-center justify-center">
                      {profileForm.logo ? (
                        <img src={profileForm.logo} className="h-full w-full object-cover" alt="Logo Preview" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-slate-300 text-[10px] text-center px-1">Default (Topi)</span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">Logo Madrasah Terpilih</p>
                      <p className="text-[10px] text-slate-400">
                        {profileForm.logo ? (
                          profileForm.logo.startsWith('data:') ? 'Terunggah dari perangkat (Base64)' : 'Menggunakan link URL'
                        ) : (
                          'Menggunakan logo default (Topi Wisuda)'
                        )}
                      </p>
                      {profileForm.logo && (
                        <button
                          type="button"
                          onClick={() => setProfileForm({ ...profileForm, logo: '' })}
                          className="text-[10px] font-semibold text-red-500 hover:text-red-700 mt-1 block hover:underline"
                        >
                          Hapus Logo & Gunakan Default
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Group 2: Sambutan Kepala Sekolah */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider border-l-4 border-emerald-500 pl-2">
                  2. Profil & Sambutan Kepala Sekolah
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                {/* Foto Profil Kepala Sekolah - Input & Direct Upload */}
                <div className="bg-emerald-50/30 rounded-2xl border border-emerald-100/50 p-4 space-y-3">
                  <h5 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">Foto Profil Kepala Sekolah</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Upload Foto dari Perangkat</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              setIsUploading(true);
                              const base64 = await compressImage(file, 800, 1000, 0.92); // Principal profile can be mid-size
                              setProfileForm({ ...profileForm, principalAvatar: base64 });
                            } catch (err) {
                              console.error(err);
                            } finally {
                              setIsUploading(false);
                            }
                          }
                        }}
                        className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer border border-slate-200 rounded-xl p-1 bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Atau Gunakan Link URL Foto</span>
                      <input
                        type="text"
                        placeholder="Masukkan URL foto kepala sekolah (https://...)"
                        value={profileForm.principalAvatar?.startsWith('data:') ? '' : (profileForm.principalAvatar || '')}
                        onChange={(e) => setProfileForm({ ...profileForm, principalAvatar: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                      />
                    </div>
                  </div>

                  {profileForm.principalAvatar && (
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-11 rounded-lg overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-white">
                        <img src={profileForm.principalAvatar} className="h-full w-full object-cover" alt="Principal Preview" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">Foto Kepala Sekolah Terpilih</p>
                        <p className="text-[10px] text-emerald-600 font-medium">
                          {profileForm.principalAvatar.startsWith('data:') ? '✓ Terunggah dari perangkat (Base64)' : '✓ Menggunakan link URL'}
                        </p>
                      </div>
                    </div>
                  )}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Headline Sambutan (Kutipan/Slogan)</label>
                    <input
                      type="text"
                      placeholder="Contoh: Ikhlas Beramal, Mengabdi Demi Pendidikan Akhlak..."
                      value={profileForm.principalTitle || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, principalTitle: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Label Badge Penyelenggara Sambutan</label>
                    <input
                      type="text"
                      placeholder="Contoh: KKG Kabupaten Bandung Barat"
                      value={profileForm.principalSubtext || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, principalSubtext: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
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

              {/* Group 4: Kustomisasi Angka Statistik Utama (Bento Grid) */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider border-l-4 border-emerald-500 pl-2">
                  4. Kustomisasi Angka Statistik Utama (Bento Grid)
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Konfigurasikan 4 kotak pencapaian/statistik yang ditampilkan dalam grid di halaman depan. Anda dapat mengubah angka besar, judul statistik, dan deskripsi pendeknya.
                </p>
                
                <div className="space-y-6">
                  {/* Stat 1 */}
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3 text-left">
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">Statistik 1: Akreditasi</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Angka / Nilai Besar</label>
                        <input
                          type="text"
                          value={profileForm.bigStat1Number || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, bigStat1Number: e.target.value })}
                          placeholder="Contoh: A (Sangat Baik)"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Judul Ringkas</label>
                        <input
                          type="text"
                          value={profileForm.bigStat1Title || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, bigStat1Title: e.target.value })}
                          placeholder="Contoh: Akreditasi Madrasah"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Deskripsi Pendek</label>
                        <input
                          type="text"
                          required
                          value={profileForm.statAcreditation}
                          onChange={(e) => setProfileForm({ ...profileForm, statAcreditation: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3 text-left">
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">Statistik 2: Pendidikan Akhlak</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Angka / Nilai Besar</label>
                        <input
                          type="text"
                          value={profileForm.bigStat2Number || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, bigStat2Number: e.target.value })}
                          placeholder="Contoh: 100% Terbina"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Judul Ringkas</label>
                        <input
                          type="text"
                          value={profileForm.bigStat2Title || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, bigStat2Title: e.target.value })}
                          placeholder="Contoh: Pendidikan Akhlak"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Deskripsi Pendek</label>
                        <input
                          type="text"
                          required
                          value={profileForm.statAdab}
                          onChange={(e) => setProfileForm({ ...profileForm, statAdab: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3 text-left">
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">Statistik 3: Guru Ramah Anak</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Angka / Nilai Besar</label>
                        <input
                          type="text"
                          value={profileForm.bigStat3Number || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, bigStat3Number: e.target.value })}
                          placeholder="Contoh: 100% Kompeten"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Judul Ringkas</label>
                        <input
                          type="text"
                          value={profileForm.bigStat3Title || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, bigStat3Title: e.target.value })}
                          placeholder="Contoh: Guru Ramah Anak"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Deskripsi Pendek</label>
                        <input
                          type="text"
                          required
                          value={profileForm.statTeachers}
                          onChange={(e) => setProfileForm({ ...profileForm, statTeachers: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stat 4 */}
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3 text-left">
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">Statistik 4: Hafalan Juz 30</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Angka / Nilai Besar</label>
                        <input
                          type="text"
                          value={profileForm.bigStat4Number || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, bigStat4Number: e.target.value })}
                          placeholder="Contoh: 15+ Juara"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Judul Ringkas</label>
                        <input
                          type="text"
                          value={profileForm.bigStat4Title || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, bigStat4Title: e.target.value })}
                          placeholder="Contoh: Hafalan Juz 30"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Deskripsi Pendek</label>
                        <input
                          type="text"
                          required
                          value={profileForm.statTahfidz}
                          onChange={(e) => setProfileForm({ ...profileForm, statTahfidz: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Group 4B: Kustomisasi Banner Utama (Hero Section) & Ticker */}
              <div className="space-y-4 pt-4 border-t border-slate-100 text-left">
                <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider border-l-4 border-emerald-500 pl-2">
                  4b. Kustomisasi Banner Utama (Hero Section) & Ticker Live
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Edit badge informasi di bagian paling atas, gambar utama beranda, serta tiga segel kurikulum penunjang madrasah.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Pita Pengumuman Atas (Top Badge)</label>
                    <input
                      type="text"
                      value={profileForm.heroTopBadge || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, heroTopBadge: e.target.value })}
                      placeholder="Akreditasi A & Madrasah Ibtidaiyah Rujukan Karakter"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Overlay Banner Label (Badge Gambar)</label>
                    <input
                      type="text"
                      value={profileForm.heroBadge || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, heroBadge: e.target.value })}
                      placeholder="KAMPUS UNGGUL"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* Hero Image File Upload */}
                <div className="bg-emerald-50/30 rounded-2xl border border-emerald-100/50 p-4 space-y-3">
                  <h5 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">Gambar Utama Banner Beranda (Hero Image)</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Upload Banner Baru</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              setIsUploading(true);
                              const base64 = await compressImage(file, 1200, 800, 0.88);
                              setProfileForm({ ...profileForm, heroImage: base64 });
                            } catch (err) {
                              console.error(err);
                            } finally {
                              setIsUploading(false);
                            }
                          }
                        }}
                        className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer border border-slate-200 rounded-xl p-1 bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Atau Gunakan Link URL Gambar</span>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={profileForm.heroImage?.startsWith('data:') ? '' : (profileForm.heroImage || '')}
                        onChange={(e) => setProfileForm({ ...profileForm, heroImage: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                  {profileForm.heroImage && (
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-24 rounded-lg overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-white">
                        <img src={profileForm.heroImage} className="h-full w-full object-cover" alt="Hero Preview" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">Gambar Banner Terpilih</p>
                        <p className="text-[10px] text-emerald-600 font-medium">
                          {profileForm.heroImage.startsWith('data:') ? '✓ Terunggah (Base64)' : '✓ Link URL Eksternal'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3 Seals */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-600 block">Segel Kurikulum / Lembaga Penunjang</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Segel Lembaga 1</label>
                      <input
                        type="text"
                        value={profileForm.seal1 || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, seal1: e.target.value })}
                        placeholder="KURIKULUM KEMENAG RI"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Segel Lembaga 2</label>
                      <input
                        type="text"
                        value={profileForm.seal2 || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, seal2: e.target.value })}
                        placeholder="BAN-SM TERAKREDITASI A"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Segel Lembaga 3</label>
                      <input
                        type="text"
                        value={profileForm.seal3 || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, seal3: e.target.value })}
                        placeholder="PEMBIASAAN TAHFIDZ JUZ 30"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Live ticker counters */}
                <div className="space-y-3 bg-amber-50/20 rounded-2xl border border-amber-100/50 p-4">
                  <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block">Kustomisasi Ticker Live (Kanan Atas)</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Ticker Stat 1 */}
                    <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 block uppercase">Ticker Live 1</span>
                      <input
                        type="text"
                        value={profileForm.heroStat1Title || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, heroStat1Title: e.target.value })}
                        placeholder="PENDAFTAR BULAN INI"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-slate-50/50 mb-1"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={profileForm.heroStat1Value || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, heroStat1Value: e.target.value })}
                          placeholder="Nilai: +182"
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                        />
                        <input
                          type="text"
                          value={profileForm.heroStat1Label || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, heroStat1Label: e.target.value })}
                          placeholder="Label: Terverifikasi"
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                        />
                      </div>
                    </div>

                    {/* Ticker Stat 2 */}
                    <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 block uppercase">Ticker Live 2</span>
                      <input
                        type="text"
                        value={profileForm.heroStat2Title || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, heroStat2Title: e.target.value })}
                        placeholder="KUOTA JALUR BEASISWA"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-slate-50/50 mb-1"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={profileForm.heroStat2Value || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, heroStat2Value: e.target.value })}
                          placeholder="Nilai: 14 Kursi"
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                        />
                        <input
                          type="text"
                          value={profileForm.heroStat2Label || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, heroStat2Label: e.target.value })}
                          placeholder="Label: Sisa"
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Group 4C: Kustomisasi Peta Perjalanan Belajar (Roadmap) */}
              <div className="space-y-4 pt-4 border-t border-slate-100 text-left">
                <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider border-l-4 border-emerald-500 pl-2">
                  4c. Kustomisasi Peta Perjalanan Belajar (Roadmap Siswa)
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Sesuaikan isi Peta Perjalanan Tumbuh Kembang murid. <span className="text-emerald-700 font-bold">Penting:</span> Pisahkan baris penjelasan dengan menekan tombol <kbd className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200 text-[10px] font-mono">Enter</kbd> (satu poin per baris) agar otomatis membentuk poin peluru (&bull;).
                </p>

                <div className="space-y-4">
                  {/* Stage 1 */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/80 space-y-3">
                    <span className="text-xs font-bold text-slate-700 block">Fase 1: Kelas I - II (Awal Kemandirian & Iqra)</span>
                    <div className="space-y-2.5">
                      <input
                        type="text"
                        value={profileForm.roadmap1Title || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, roadmap1Title: e.target.value })}
                        placeholder="Judul: Kelas I - II: Pembiasaan Adab & Iqra"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold focus:border-emerald-500 focus:outline-none bg-white"
                      />
                      <textarea
                        rows={3}
                        value={profileForm.roadmap1Points || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, roadmap1Points: e.target.value })}
                        placeholder="Contoh:&#10;Belajar mengaji Iqra secara bertahap&#10;Penanaman karakter dasar 5S&#10;Pembelajaran ramah anak"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white resize-y"
                      />
                    </div>
                  </div>

                  {/* Stage 2 */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/80 space-y-3">
                    <span className="text-xs font-bold text-slate-700 block">Fase 2: Kelas III - IV (Kemandirian & Hafalan)</span>
                    <div className="space-y-2.5">
                      <input
                        type="text"
                        value={profileForm.roadmap2Title || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, roadmap2Title: e.target.value })}
                        placeholder="Judul: Kelas III - IV: Kemandirian & Hafalan Juz Amma"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold focus:border-emerald-500 focus:outline-none bg-white"
                      />
                      <textarea
                        rows={3}
                        value={profileForm.roadmap2Points || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, roadmap2Points: e.target.value })}
                        placeholder="Contoh:&#10;Mulai menghafal surat-surat pendek Juz 30&#10;Kegiatan Kepramukaan Siaga&#10;Eksplorasi ilmu sains dasar"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white resize-y"
                      />
                    </div>
                  </div>

                  {/* Stage 3 */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/80 space-y-3">
                    <span className="text-xs font-bold text-slate-700 block">Fase 3: Kelas V - VI (Kepemimpinan & Lulus Berkah)</span>
                    <div className="space-y-2.5">
                      <input
                        type="text"
                        value={profileForm.roadmap3Title || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, roadmap3Title: e.target.value })}
                        placeholder="Judul: Kelas V - VI: Kepemimpinan & Kelulusan Berkah"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold focus:border-emerald-500 focus:outline-none bg-white"
                      />
                      <textarea
                        rows={3}
                        value={profileForm.roadmap3Points || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, roadmap3Points: e.target.value })}
                        placeholder="Contoh:&#10;Pemantapan hafalan Juz 30 utama&#10;Bimbingan belajar intensif&#10;Bakti sosial cilik"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white resize-y"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Group 4D: Kustomisasi Keunggulan Kompetitif (USPs) */}
              <div className="space-y-4 pt-4 border-t border-slate-100 text-left">
                <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider border-l-4 border-emerald-500 pl-2">
                  4d. Kustomisasi Keunggulan Kompetitif (4 USP Utama)
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ubah judul dan paragraf penjelasan bagi empat pilar keunggulan madrasah yang meyakinkan pendaftar.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* USP 1 */}
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 text-left space-y-2">
                    <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block">Keunggulan 1</span>
                    <input
                      type="text"
                      value={profileForm.usp1Title || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, usp1Title: e.target.value })}
                      placeholder="Judul: Kurikulum Terpadu"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold focus:border-emerald-500 focus:outline-none bg-white"
                    />
                    <textarea
                      rows={2}
                      value={profileForm.usp1Desc || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, usp1Desc: e.target.value })}
                      placeholder="Penjelasan ringkas keunggulan"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white resize-y"
                    />
                  </div>

                  {/* USP 2 */}
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 text-left space-y-2">
                    <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block">Keunggulan 2</span>
                    <input
                      type="text"
                      value={profileForm.usp2Title || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, usp2Title: e.target.value })}
                      placeholder="Judul: Pembiasaan Ibadah"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold focus:border-emerald-500 focus:outline-none bg-white"
                    />
                    <textarea
                      rows={2}
                      value={profileForm.usp2Desc || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, usp2Desc: e.target.value })}
                      placeholder="Penjelasan ringkas keunggulan"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white resize-y"
                    />
                  </div>

                  {/* USP 3 */}
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 text-left space-y-2">
                    <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block">Keunggulan 3</span>
                    <input
                      type="text"
                      value={profileForm.usp3Title || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, usp3Title: e.target.value })}
                      placeholder="Judul: Rasio Kelas Nyaman"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold focus:border-emerald-500 focus:outline-none bg-white"
                    />
                    <textarea
                      rows={2}
                      value={profileForm.usp3Desc || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, usp3Desc: e.target.value })}
                      placeholder="Penjelasan ringkas keunggulan"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white resize-y"
                    />
                  </div>

                  {/* USP 4 */}
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 text-left space-y-2">
                    <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block">Keunggulan 4</span>
                    <input
                      type="text"
                      value={profileForm.usp4Title || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, usp4Title: e.target.value })}
                      placeholder="Judul: Sangat Ringan & Terjangkau"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold focus:border-emerald-500 focus:outline-none bg-white"
                    />
                    <textarea
                      rows={2}
                      value={profileForm.usp4Desc || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, usp4Desc: e.target.value })}
                      placeholder="Penjelasan ringkas keunggulan"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* Group 4E: Kustomisasi Program & Pembiasaan Terbaik bagi Calon Siswa */}
              <div className="space-y-4 pt-4 border-t border-slate-100 text-left">
                <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider border-l-4 border-emerald-500 pl-2">
                  4e. Kustomisasi Program & Pembiasaan Terbaik bagi Calon Siswa
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Sesuaikan judul utama, slogan, dan rincian program interaktif pada section "Program & Pembiasaan Terbaik" di halaman depan.
                </p>

                {/* Sub-group 1: Judul Utama Section */}
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">Header & Deskripsi Section</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Tag Atas (Kecil)</label>
                      <input
                        type="text"
                        value={profileForm.audienceSectionTag || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, audienceSectionTag: e.target.value })}
                        placeholder="PEMBELAJARAN BERFOKUS AKHLAK"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Judul Section Utama</label>
                      <input
                        type="text"
                        value={profileForm.audienceSectionTitle || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, audienceSectionTitle: e.target.value })}
                        placeholder="Program & Pembiasaan Terbaik bagi Calon Siswa"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Keterangan / Deskripsi Section</label>
                    <textarea
                      rows={2}
                      value={profileForm.audienceSectionDesc || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, audienceSectionDesc: e.target.value })}
                      placeholder="Silakan pilih profil Anda di bawah ini..."
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none bg-white resize-y"
                    />
                  </div>
                </div>

                {/* Sub-group 2: Jalur Orang Tua Siswa */}
                <div className="p-4 bg-emerald-50/20 rounded-2xl border border-emerald-100/50 space-y-4">
                  <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block">Jalur Orang Tua Siswa (3 Kartu)</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Track 1 */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-2 text-left">
                      <span className="text-[10px] font-bold text-emerald-700 block uppercase">Kartu 1</span>
                      <input
                        type="text"
                        value={profileForm.parentTrack1Tag || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, parentTrack1Tag: e.target.value })}
                        placeholder="Tag: 01 / SILATURAHMI"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={profileForm.parentTrack1Title || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, parentTrack1Title: e.target.value })}
                        placeholder="Judul: Monitoring Perkembangan Anak"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                      />
                      <textarea
                        rows={3}
                        value={profileForm.parentTrack1Desc || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, parentTrack1Desc: e.target.value })}
                        placeholder="Keterangan..."
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none resize-none"
                      />
                    </div>

                    {/* Track 2 */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-2 text-left">
                      <span className="text-[10px] font-bold text-emerald-700 block uppercase">Kartu 2</span>
                      <input
                        type="text"
                        value={profileForm.parentTrack2Tag || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, parentTrack2Tag: e.target.value })}
                        placeholder="Tag: 02 / AKHLAK MULIA"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={profileForm.parentTrack2Title || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, parentTrack2Title: e.target.value })}
                        placeholder="Judul: Bimbingan Sopan Santun"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                      />
                      <textarea
                        rows={3}
                        value={profileForm.parentTrack2Desc || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, parentTrack2Desc: e.target.value })}
                        placeholder="Keterangan..."
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none resize-none"
                      />
                    </div>

                    {/* Track 3 */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-2 text-left">
                      <span className="text-[10px] font-bold text-emerald-700 block uppercase">Kartu 3</span>
                      <input
                        type="text"
                        value={profileForm.parentTrack3Tag || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, parentTrack3Tag: e.target.value })}
                        placeholder="Tag: 03 / BEASISWA"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={profileForm.parentTrack3Title || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, parentTrack3Title: e.target.value })}
                        placeholder="Judul: Biaya Terjangkau & Subsidi"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                      />
                      <textarea
                        rows={3}
                        value={profileForm.parentTrack3Desc || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, parentTrack3Desc: e.target.value })}
                        placeholder="Keterangan..."
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Sub-group 3: Jalur Calon Siswa */}
                <div className="p-4 bg-amber-50/20 rounded-2xl border border-amber-100/50 space-y-4">
                  <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block">Jalur Calon Siswa (3 Kartu)</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Track 1 */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-2 text-left">
                      <span className="text-[10px] font-bold text-amber-700 block uppercase">Kartu 1</span>
                      <input
                        type="text"
                        value={profileForm.studentTrack1Tag || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, studentTrack1Tag: e.target.value })}
                        placeholder="Tag: 01 / KEAGAMAAN"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={profileForm.studentTrack1Title || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, studentTrack1Title: e.target.value })}
                        placeholder="Judul: Bimbingan Iqra & Al-Qur'an"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                      />
                      <textarea
                        rows={3}
                        value={profileForm.studentTrack1Desc || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, studentTrack1Desc: e.target.value })}
                        placeholder="Keterangan..."
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none resize-none"
                      />
                    </div>

                    {/* Track 2 */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-2 text-left">
                      <span className="text-[10px] font-bold text-amber-700 block uppercase">Kartu 2</span>
                      <input
                        type="text"
                        value={profileForm.studentTrack2Tag || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, studentTrack2Tag: e.target.value })}
                        placeholder="Tag: 02 / CERITA ISLAMI"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={profileForm.studentTrack2Title || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, studentTrack2Title: e.target.value })}
                        placeholder="Judul: Kisah Teladan Rasul"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                      />
                      <textarea
                        rows={3}
                        value={profileForm.studentTrack2Desc || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, studentTrack2Desc: e.target.value })}
                        placeholder="Keterangan..."
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none resize-none"
                      />
                    </div>

                    {/* Track 3 */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-2 text-left">
                      <span className="text-[10px] font-bold text-amber-700 block uppercase">Kartu 3</span>
                      <input
                        type="text"
                        value={profileForm.studentTrack3Tag || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, studentTrack3Tag: e.target.value })}
                        placeholder="Tag: 03 / BERMAIN"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={profileForm.studentTrack3Title || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, studentTrack3Title: e.target.value })}
                        placeholder="Judul: Pramuka & Silat Tapak Suci"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                      />
                      <textarea
                        rows={3}
                        value={profileForm.studentTrack3Desc || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, studentTrack3Desc: e.target.value })}
                        placeholder="Keterangan..."
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Sub-group 4: Jalur Alumni */}
                <div className="p-4 bg-blue-50/20 rounded-2xl border border-blue-100/50 space-y-4">
                  <span className="text-xs font-extrabold text-blue-800 uppercase tracking-wider block">Jalur Alumni (3 Kartu)</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Track 1 */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-2 text-left">
                      <span className="text-[10px] font-bold text-blue-700 block uppercase">Kartu 1</span>
                      <input
                        type="text"
                        value={profileForm.alumniTrack1Tag || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, alumniTrack1Tag: e.target.value })}
                        placeholder="Tag: 01 / JEJARING ALUMNI"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={profileForm.alumniTrack1Title || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, alumniTrack1Title: e.target.value })}
                        placeholder="Judul: Ikatan Alumni MI Cibungur"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                      />
                      <textarea
                        rows={3}
                        value={profileForm.alumniTrack1Desc || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, alumniTrack1Desc: e.target.value })}
                        placeholder="Keterangan..."
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none resize-none"
                      />
                    </div>

                    {/* Track 2 */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-2 text-left">
                      <span className="text-[10px] font-bold text-blue-700 block uppercase">Kartu 2</span>
                      <input
                        type="text"
                        value={profileForm.alumniTrack2Tag || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, alumniTrack2Tag: e.target.value })}
                        placeholder="Tag: 02 / DONASI & KONTRIBUSI"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={profileForm.alumniTrack2Title || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, alumniTrack2Title: e.target.value })}
                        placeholder="Judul: Sumbangsih Almamater"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                      />
                      <textarea
                        rows={3}
                        value={profileForm.alumniTrack2Desc || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, alumniTrack2Desc: e.target.value })}
                        placeholder="Keterangan..."
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none resize-none"
                      />
                    </div>

                    {/* Track 3 */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-2 text-left">
                      <span className="text-[10px] font-bold text-blue-700 block uppercase">Kartu 3</span>
                      <input
                        type="text"
                        value={profileForm.alumniTrack3Tag || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, alumniTrack3Tag: e.target.value })}
                        placeholder="Tag: 03 / KISAH SUKSES"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={profileForm.alumniTrack3Title || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, alumniTrack3Title: e.target.value })}
                        placeholder="Judul: Motivasi & Inspirasi"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                      />
                      <textarea
                        rows={3}
                        value={profileForm.alumniTrack3Desc || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, alumniTrack3Desc: e.target.value })}
                        placeholder="Keterangan..."
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Group 4F: Kustomisasi Footer & Jam Operasional */}
              <div className="space-y-4 pt-4 border-t border-slate-100 text-left">
                <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider border-l-4 border-emerald-500 pl-2">
                  4F. Kustomisasi Bagian Kaki Web (Footer) & Jam Operasional
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Gunakan bagian ini untuk merubah informasi deskripsi madrasah, link akun media sosial resmi, judul navigasi, serta rincian jam operasional yang tampil di bagian bawah seluruh halaman website.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Bagian Deskripsi & Judul Kolom */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Deskripsi Singkat Madrasah (Kaki Kiri)</label>
                      <textarea
                        rows={3}
                        value={profileForm.footerDescription || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, footerDescription: e.target.value })}
                        placeholder="Menyelenggarakan sistem pendidikan dasar berciri khas Islami..."
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Navigasi</label>
                        <input
                          type="text"
                          value={profileForm.footerNavTitle || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, footerNavTitle: e.target.value })}
                          placeholder="Akses Navigasi"
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Operasional</label>
                        <input
                          type="text"
                          value={profileForm.footerOpTitle || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, footerOpTitle: e.target.value })}
                          placeholder="Jam Operasional"
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Kontak</label>
                        <input
                          type="text"
                          value={profileForm.footerContactTitle || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, footerContactTitle: e.target.value })}
                          placeholder="Hubungi Kami"
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bagian Sosial Media & Jam Operasional */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Link Instagram</label>
                        <input
                          type="text"
                          value={profileForm.footerInstagram || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, footerInstagram: e.target.value })}
                          placeholder="https://instagram.com/..."
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Link Facebook</label>
                        <input
                          type="text"
                          value={profileForm.footerFacebook || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, footerFacebook: e.target.value })}
                          placeholder="https://facebook.com/..."
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Link YouTube</label>
                        <input
                          type="text"
                          value={profileForm.footerYoutube || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, footerYoutube: e.target.value })}
                          placeholder="https://youtube.com/..."
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">Rincian Jam Operasional</label>
                      <input
                        type="text"
                        value={profileForm.footerOp1 || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, footerOp1: e.target.value })}
                        placeholder="Baris 1: Senin - Sabtu: 07:15 - 12:45 WIB"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-medium"
                      />
                      <input
                        type="text"
                        value={profileForm.footerOp2 || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, footerOp2: e.target.value })}
                        placeholder="Baris 2: Kegiatan Ekstra: Sabtu setelah Ashar"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-medium"
                      />
                      <input
                        type="text"
                        value={profileForm.footerOp3 || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, footerOp3: e.target.value })}
                        placeholder="Baris 3: Minggu / Libur Nasional: Tutup"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-medium"
                      />
                    </div>
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

              {/* Group 6: Kustomisasi Template & Alur PPDB */}
              <div className="space-y-4 pt-4 border-t border-slate-100 text-left">
                <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider border-l-4 border-emerald-500 pl-2">
                  6. Kustomisasi Template & Alur PPDB (Siswa Baru)
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Gunakan pengaturan di bawah ini untuk mengustomisasi seluruh tampilan, kalimat ajakan, judul simulator, opsi pilihan kelas, hingga teks jaminan pada Formulir PPDB utama.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/50">
                  <div>
                    <label className="block text-xs font-bold text-emerald-950 mb-1.5">🗓️ Tahun PPDB (Aktif)</label>
                    <input
                      type="text"
                      value={profileForm.ppdbYear || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, ppdbYear: e.target.value })}
                      placeholder="2026"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-white font-semibold"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Mengubah tahun PPDB di navigasi, footer, dan form secara otomatis.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-950 mb-1.5">🟢 Teks Tombol Daftar (Navigasi)</label>
                    <input
                      type="text"
                      value={profileForm.ppdbButtonText || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, ppdbButtonText: e.target.value })}
                      placeholder="Daftar PPDB 2026"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-white font-semibold"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Mengubah tulisan tombol utama berwarna hijau di navigasi atas.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Slogan / Sub-judul Atas PPDB</label>
                    <input
                      type="text"
                      value={profileForm.ppdbSubtitle || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, ppdbSubtitle: e.target.value })}
                      placeholder="Penerimaan Peserta Didik Baru (PPDB) 2026/2027"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Judul Utama Halaman PPDB</label>
                    <input
                      type="text"
                      value={profileForm.ppdbTitle || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, ppdbTitle: e.target.value })}
                      placeholder="Pendaftaran Siswa Baru MI Cibungur I"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Deskripsi / Kalimat Ajakan PPDB</label>
                  <textarea
                    rows={2}
                    value={profileForm.ppdbDesc || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, ppdbDesc: e.target.value })}
                    placeholder="Membimbing putra-putri Anda tumbuh cerdas, sholeh, dan berakhlak mulia sejak dini. Gunakan simulator sederhana di bawah untuk melihat perkiraan program beasiswa atau keringanan biaya yang berhak didapatkan."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50 resize-y"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Judul Simulator PPDB</label>
                    <input
                      type="text"
                      value={profileForm.ppdbSimulatorTitle || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, ppdbSimulatorTitle: e.target.value })}
                      placeholder="Simulator PPDB Cerdas"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Sub-judul Simulator</label>
                    <input
                      type="text"
                      value={profileForm.ppdbSimulatorSubtitle || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, ppdbSimulatorSubtitle: e.target.value })}
                      placeholder="Cek kelolosan & beasiswa instan"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Judul Formulir Draf Pendaftaran</label>
                    <input
                      type="text"
                      value={profileForm.ppdbFormTitle || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, ppdbFormTitle: e.target.value })}
                      placeholder="Formulir Pendaftaran Draf PPDB"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Opsi Pilihan Kelas / Tingkat (Pisahkan dengan tanda koma `,`)</label>
                    <input
                      type="text"
                      value={profileForm.ppdbGrades || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, ppdbGrades: e.target.value })}
                      placeholder="Kelas 1 MI (Baru), Kelas 2-3 (Pindahan), Kelas 4-5 (Pindahan)"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Deskripsi Petunjuk Formulir PPDB</label>
                  <textarea
                    rows={2}
                    value={profileForm.ppdbFormDesc || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, ppdbFormDesc: e.target.value })}
                    placeholder="Isi informasi dasar di bawah ini untuk mengunci kuota beasiswa Anda. Tim humas dan penerimaan siswa baru akan segera memvalidasi dan memproses draf berkas ini."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50 resize-y"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Teks Jaminan / Reassurance di Kaki Formulir</label>
                  <textarea
                    rows={2}
                    value={profileForm.ppdbReassurance || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, ppdbReassurance: e.target.value })}
                    placeholder="Dengan mendaftar draf ini, anak Anda diprioritaskan mendapatkan **kuota khusus wawancara** dan hak klaim beasiswa"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50 resize-y"
                  />
                </div>

                {/* Sub-group: Kustomisasi Tipe Beasiswa Simulator */}
                <div className="pt-4 mt-2 border-t border-dashed border-slate-200 space-y-4">
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span>✨ Pengaturan Kriteria & Nilai Beasiswa Simulator</span>
                  </h5>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Sesuaikan nama beasiswa, potongan biaya (diskon), dan manfaat tambahan yang otomatis dikalkulasi serta ditampilkan oleh Simulator PPDB Cerdas saat orang tua/calon siswa memasukkan nilai atau kriteria mereka.
                  </p>

                  <div className="space-y-6">
                    {/* Tier 1: Beasiswa Utama Tahfidz */}
                    <div className="bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100/50 space-y-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-md">Kriteria 1: Tahfidz Juz 10+</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Beasiswa</label>
                          <input
                            type="text"
                            value={profileForm.ppdbSch1Title || ''}
                            onChange={(e) => setProfileForm({ ...profileForm, ppdbSch1Title: e.target.value })}
                            placeholder="Beasiswa Utama Tahfidz Juz 30"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-white font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Diskon / Potongan Biaya</label>
                          <input
                            type="text"
                            value={profileForm.ppdbSch1Discount || ''}
                            onChange={(e) => setProfileForm({ ...profileForm, ppdbSch1Discount: e.target.value })}
                            placeholder="Gratis Seragam & Gedung"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-white font-semibold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Fasilitas / Manfaat Tambahan</label>
                        <input
                          type="text"
                          value={profileForm.ppdbSch1Benefit || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, ppdbSch1Benefit: e.target.value })}
                          placeholder="Pemberian kitab suci gratis, pembinaan kelas tahfidz khusus dan keanggotaan klub cilik Al-Qur'an."
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                        />
                      </div>
                    </div>

                    {/* Tier 2: Beasiswa Anak Sholeh & Berprestasi */}
                    <div className="bg-amber-50/20 p-4 rounded-2xl border border-amber-100/40 space-y-3">
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-md">Kriteria 2: Tahfidz 3+ Juz / Prestasi Nasional / Rata-rata Nilai 95+</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Beasiswa</label>
                          <input
                            type="text"
                            value={profileForm.ppdbSch2Title || ''}
                            onChange={(e) => setProfileForm({ ...profileForm, ppdbSch2Title: e.target.value })}
                            placeholder="Beasiswa Anak Sholeh & Berprestasi"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-white font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Diskon / Potongan Biaya</label>
                          <input
                            type="text"
                            value={profileForm.ppdbSch2Discount || ''}
                            onChange={(e) => setProfileForm({ ...profileForm, ppdbSch2Discount: e.target.value })}
                            placeholder="Diskon Gedung 75%"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-white font-semibold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Fasilitas / Manfaat Tambahan</label>
                        <input
                          type="text"
                          value={profileForm.ppdbSch2Benefit || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, ppdbSch2Benefit: e.target.value })}
                          placeholder="Akses peminjaman buku perpustakaan lengkap gratis, prioritas bimbingan perlombaan Porseni MI."
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                        />
                      </div>
                    </div>

                    {/* Tier 3: Bantuan Afirmasi Komite Madrasah */}
                    <div className="bg-blue-50/20 p-4 rounded-2xl border border-blue-100/30 space-y-3">
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded-md">Kriteria 3: Prestasi Provinsi / Rata-rata Nilai 90+</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Beasiswa</label>
                          <input
                            type="text"
                            value={profileForm.ppdbSch3Title || ''}
                            onChange={(e) => setProfileForm({ ...profileForm, ppdbSch3Title: e.target.value })}
                            placeholder="Bantuan Afirmasi Komite Madrasah"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-white font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Diskon / Potongan Biaya</label>
                          <input
                            type="text"
                            value={profileForm.ppdbSch3Discount || ''}
                            onChange={(e) => setProfileForm({ ...profileForm, ppdbSch3Discount: e.target.value })}
                            placeholder="Diskon Gedung 50%"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-white font-semibold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Fasilitas / Manfaat Tambahan</label>
                        <input
                          type="text"
                          value={profileForm.ppdbSch3Benefit || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, ppdbSch3Benefit: e.target.value })}
                          placeholder="Disubsidi komite wali murid bagi yang kurang mampu demi menjamin hak belajar anak."
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                        />
                      </div>
                    </div>

                    {/* Tier 4: Subsidi Khusus Saudara Kandung */}
                    <div className="bg-purple-50/20 p-4 rounded-2xl border border-purple-100/30 space-y-3">
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-1 rounded-md">Kriteria 4: Prestasi Kabupaten / Rata-rata Nilai 85+</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Beasiswa</label>
                          <input
                            type="text"
                            value={profileForm.ppdbSch4Title || ''}
                            onChange={(e) => setProfileForm({ ...profileForm, ppdbSch4Title: e.target.value })}
                            placeholder="Subsidi Khusus Saudara Kandung"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-white font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Diskon / Potongan Biaya</label>
                          <input
                            type="text"
                            value={profileForm.ppdbSch4Discount || ''}
                            onChange={(e) => setProfileForm({ ...profileForm, ppdbSch4Discount: e.target.value })}
                            placeholder="Diskon Daftar 25%"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-white font-semibold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Fasilitas / Manfaat Tambahan</label>
                        <input
                          type="text"
                          value={profileForm.ppdbSch4Benefit || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, ppdbSch4Benefit: e.target.value })}
                          placeholder="Kemudahan pembayaran bagi wali murid yang memiliki lebih dari 1 anak bersekolah di MI Cibungur I."
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Group 7: Manajemen Keamanan & Hak Akses Portal */}
              <div className="space-y-4 pt-6 border-t border-slate-100 text-left">
                <h4 className="text-sm font-bold text-amber-800 uppercase tracking-wider border-l-4 border-amber-500 pl-2">
                  7. Manajemen Keamanan & Hak Akses Portal
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
