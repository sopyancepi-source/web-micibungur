import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  FileText, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  Download,
  Gift
} from 'lucide-react';
import { PPDBSubmission, SchoolProfile } from '../types';

interface PPDBFormProps {
  onRegisterSubmit: (submission: Omit<PPDBSubmission, 'id' | 'date' | 'status'>) => void;
  schoolProfile?: SchoolProfile;
}

export default function PPDBForm({ 
  onRegisterSubmit, 
  schoolProfile 
}: PPDBFormProps) {
  // Parse custom grades list
  const gradesList = schoolProfile?.ppdbGrades
    ? schoolProfile.ppdbGrades.split(',').map(s => s.trim()).filter(Boolean)
    : ['Kelas 1 MI (Baru)', 'Kelas 2-3 (Pindahan)', 'Kelas 4-5 (Pindahan)'];

  // Form State
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [prevSchool, setPrevSchool] = useState('');
  const [gradeSelection, setGradeSelection] = useState(() => {
    return gradesList[0] || 'Kelas 1 MI (Baru)';
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle grade fallback when the list changes
  useEffect(() => {
    if (gradesList.length > 0 && !gradesList.includes(gradeSelection)) {
      setGradeSelection(gradesList[0]);
    }
  }, [schoolProfile?.ppdbGrades]);

  // Parse custom programs list
  const programsList = schoolProfile?.ppdbBannerPrograms
    ? schoolProfile.ppdbBannerPrograms.split('\n').map(p => p.trim()).filter(Boolean)
    : [
        'Gratis Seragam Sekolah Lengkap (Seragam Utama & Olahraga)',
        'Bebas Biaya Gedung / Pembangunan 100% bagi Anak Yatim Piatu',
        'Klaim Kuota Beasiswa Khusus Komite Madrasah',
        'Subsidi Buku Pelajaran & Alat Tulis untuk Wali Murid Kurang Mampu'
      ];

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!studentName.trim()) errors.studentName = "Nama lengkap siswa wajib diisi";
    if (!parentName.trim()) errors.parentName = "Nama orang tua/wali wajib diisi";
    if (!phone.trim()) {
      errors.phone = "Nomor WhatsApp wajib diisi";
    } else if (!/^\+?[0-9]{8,15}$/.test(phone.replace(/\s+/g, ''))) {
      errors.phone = "Format nomor HP tidak valid (gunakan format angka)";
    }
    if (!email.trim()) {
      errors.email = "Alamat email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Format email tidak valid";
    }
    if (!prevSchool.trim()) errors.prevSchool = "Sekolah asal (TK/PAUD/RA) wajib diisi";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onRegisterSubmit({
      studentName,
      parentName,
      phone,
      email,
      prevSchool,
      grade: gradeSelection,
      notes: `Pendaftaran PPDB Mandiri Online. Program Peminatan: ${gradeSelection}. Sekolah Asal: ${prevSchool}.`
    });

    setIsSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 animate-fade-in" id="ppdb-container">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
          {schoolProfile?.ppdbSubtitle || 'Penerimaan Peserta Didik Baru (PPDB) 2026/2027'}
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mt-3">
          {schoolProfile?.ppdbTitle || 'Pendaftaran Siswa Baru MI Cibungur I'}
        </h2>
        <p className="text-slate-600 mt-4 text-sm sm:text-base leading-relaxed">
          {schoolProfile?.ppdbDesc || 'Membimbing putra-putri Anda tumbuh cerdas, sholeh, dan berakhlak mulia sejak dini. Lihat program khusus siswa baru kami dan isi formulir pendaftaran draf PPDB di samping untuk mendaftar.'}
        </p>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customizable School Programs Banner */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xl shadow-slate-100/50 text-left relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl opacity-70 -mr-10 -mt-10"></div>
          
          <div className="flex items-center gap-3.5 mb-6 relative z-10">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl shadow-sm shadow-emerald-100">
              <Gift className="h-5.5 w-5.5" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-extrabold text-slate-900 leading-snug">
                {schoolProfile?.ppdbBannerTitle || '🎁 Program Khusus Murid Baru'}
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                {schoolProfile?.ppdbBannerSubtitle || 'Program unggulan dan kemudahan biaya pendaftaran'}
              </p>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            {programsList.map((program, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3.5 p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100/30 text-left transition-all hover:-translate-y-0.5 hover:bg-emerald-50/60"
              >
                <div className="p-1 rounded-lg bg-emerald-500 text-white shrink-0 mt-0.5 shadow-sm shadow-emerald-500/20">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm leading-relaxed">
                    {program}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          {/* Secure application badge */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3 text-slate-400">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
            <p className="text-[11px] font-semibold tracking-wider uppercase leading-none">
              MI Cibungur I • Terakreditasi A
            </p>
          </div>
        </div>

        {/* Right: Registration Draft Form */}
        <div className="lg:col-span-7">
          {!isSubmitted ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xl shadow-slate-100/50 text-left">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="h-5.5 w-5.5 text-emerald-600" />
                  {schoolProfile?.ppdbFormTitle || 'Formulir Pendaftaran Draf PPDB'}
                </h3>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                  {schoolProfile?.ppdbFormDesc || 'Isi informasi dasar di bawah ini untuk mengunci kuota pendaftaran Anda. Tim humas dan penerimaan siswa baru akan segera memvalidasi dan memproses draf berkas ini.'}
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5" id="ppdb-form">
                {/* Grade Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tingkat Peminatan Pendaftaran
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {gradesList.map((grade) => (
                      <button
                        type="button"
                        key={grade}
                        onClick={() => setGradeSelection(grade)}
                        className={`py-3 px-1.5 text-center text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                          gradeSelection === grade
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm font-bold'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Student Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-slate-400" /> Nama Lengkap Siswa
                    </label>
                    <input 
                      type="text" 
                      placeholder="Masukkan nama calon siswa..."
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50 ${
                        formErrors.studentName ? 'border-red-300 focus:border-red-500 bg-red-50/10' : 'border-slate-200'
                      }`}
                    />
                    {formErrors.studentName && (
                      <p className="text-[10px] font-semibold text-red-500 mt-1">{formErrors.studentName}</p>
                    )}
                  </div>

                  {/* Parent Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-slate-400" /> Nama Orang Tua / Wali
                    </label>
                    <input 
                      type="text" 
                      placeholder="Nama ayah, ibu, atau wali..."
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50 ${
                        formErrors.parentName ? 'border-red-300 focus:border-red-500 bg-red-50/10' : 'border-slate-200'
                      }`}
                    />
                    {formErrors.parentName && (
                      <p className="text-[10px] font-semibold text-red-500 mt-1">{formErrors.parentName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-slate-400" /> No. WhatsApp Aktif
                    </label>
                    <input 
                      type="tel" 
                      placeholder="Contoh: 08123456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50 ${
                        formErrors.phone ? 'border-red-300 focus:border-red-500 bg-red-50/10' : 'border-slate-200'
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-[10px] font-semibold text-red-500 mt-1">{formErrors.phone}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-slate-400" /> Alamat Email Kontak
                    </label>
                    <input 
                      type="email" 
                      placeholder="Masukkan email aktif..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50 ${
                        formErrors.email ? 'border-red-300 focus:border-red-500 bg-red-50/10' : 'border-slate-200'
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-[10px] font-semibold text-red-500 mt-1">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Previous School */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" /> Sekolah Asal (TK / PAUD / RA / KB / SD)
                  </label>
                  <input 
                    type="text" 
                    placeholder="Contoh: RA Al-Mukhtar / TK Pembina"
                    value={prevSchool}
                    onChange={(e) => setPrevSchool(e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50/50 ${
                      formErrors.prevSchool ? 'border-red-300 focus:border-red-500 bg-red-50/10' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.prevSchool && (
                    <p className="text-[10px] font-semibold text-red-500 mt-1">{formErrors.prevSchool}</p>
                  )}
                </div>

                {/* Live Info card (Dynamic reassurance) */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3">
                  <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    {schoolProfile?.ppdbReassurance || 'Dengan mendaftar draf ini, anak Anda diprioritaskan mendapatkan **kuota khusus wawancara** dan hak klaim seragam gratis'}
                  </p>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-4 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg hover:shadow-emerald-600/20 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <span>Kirim Formulir Draf Pendaftaran</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          ) : (
            /* Success State */
            <div id="ppdb-receipt" className="bg-emerald-50/40 rounded-3xl border border-emerald-100 p-8 text-center shadow-lg flex flex-col items-center justify-center min-h-[450px]">
              <div className="h-16 w-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6 animate-bounce">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Pendaftaran Draf Berhasil!
              </h3>
              <p className="text-emerald-800 text-xs font-semibold uppercase tracking-wider bg-emerald-100/60 px-3 py-1 rounded-full mt-2">
                Nomor Tiket: PPDB-2026-{Math.floor(Math.random() * 9000 + 1000)}
              </p>
              
              <div className="max-w-md mx-auto my-6 space-y-4 text-left bg-white border border-emerald-100/60 p-5 rounded-2xl shadow-sm">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Terima kasih Ibu/Bapak <strong className="text-slate-900">{parentName}</strong>, draf pendaftaran untuk putra-putri tercinta <strong className="text-slate-900">{studentName}</strong> telah kami terima di database penerimaan siswa baru.
                </p>
                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                  <p className="text-slate-500 flex justify-between">
                    <span>Program Minat:</span> <strong className="text-slate-800">{gradeSelection}</strong>
                  </p>
                  <p className="text-slate-500 flex justify-between">
                    <span>Sekolah Asal:</span> <strong className="text-slate-800">{prevSchool}</strong>
                  </p>
                  <p className="text-slate-500 flex justify-between">
                    <span>Prioritas Hak Klaim:</span> <strong className="text-emerald-700 font-extrabold">Seragam Gratis & Buku Pelajaran</strong>
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6">
                Panitia PPDB Sekolah akan menghubungi Bapak/Ibu melalui nomor WhatsApp <strong className="text-slate-700">{phone}</strong> dalam kurun waktu 1x24 jam untuk pengiriman berkas kelengkapan digital.
              </p>

              <div className="flex gap-3 no-print">
                <button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setStudentName('');
                    setParentName('');
                    setPhone('');
                    setEmail('');
                    setPrevSchool('');
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                >
                  Daftarkan Anak Lain
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Cetak Tanda Terima</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
