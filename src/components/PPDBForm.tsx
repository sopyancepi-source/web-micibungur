/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  FileText, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  HelpCircle,
  Percent,
  BadgeAlert,
  Download
} from 'lucide-react';
import { PPDBSubmission } from '../types';

interface PPDBFormProps {
  onRegisterSubmit: (submission: Omit<PPDBSubmission, 'id' | 'date' | 'status'>) => void;
}

export default function PPDBForm({ onRegisterSubmit }: PPDBFormProps) {
  // Simulator State
  const [gradeAverage, setGradeAverage] = useState<number>(85);
  const [achievementLevel, setAchievementLevel] = useState<string>('tidak-ada');
  const [isTahfidz, setIsTahfidz] = useState<string>('0'); // juz
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPrediction, setShowPrediction] = useState(true);

  // Form State
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [prevSchool, setPrevSchool] = useState('');
  const [gradeSelection, setGradeSelection] = useState('Kelas 1 MI (Baru)');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Calculate Scholarship tier
  const getScholarshipEstimation = () => {
    let title = "Jalur Umum (Reguler)";
    let discount = "Terjangkau";
    let benefit = "Akses fasilitas kelas nyaman, bimbingan akhlak harian, bimbingan shalat dhuha.";
    let bg = "bg-slate-50 border-slate-200 text-slate-800";
    let badgeColor = "bg-slate-200 text-slate-700";

    const juzNum = parseInt(isTahfidz);

    if (juzNum >= 10) {
      title = "Beasiswa Utama Tahfidz Juz 30";
      discount = "Gratis Seragam & Gedung";
      benefit = "Pemberian kitab suci gratis, pembinaan kelas tahfidz khusus dan keanggotaan klub cilik Al-Qur'an.";
      bg = "bg-emerald-50 border-emerald-300 text-emerald-950";
      badgeColor = "bg-emerald-500 text-white";
    } else if (juzNum >= 3 || achievementLevel === 'nasional' || gradeAverage >= 95) {
      title = "Beasiswa Anak Sholeh & Berprestasi";
      discount = "Diskon Gedung 75%";
      benefit = "Akses peminjaman buku perpustakaan lengkap gratis, prioritas bimbingan perlombaan Porseni MI.";
      bg = "bg-amber-50/70 border-amber-300 text-amber-950";
      badgeColor = "bg-amber-500 text-white";
    } else if (achievementLevel === 'provinsi' || gradeAverage >= 90) {
      title = "Bantuan Afirmasi Komite Madrasah";
      discount = "Diskon Gedung 50%";
      benefit = "Disubsidi komite wali murid bagi yang kurang mampu demi menjamin hak belajar anak.";
      bg = "bg-blue-50 border-blue-200 text-blue-950";
      badgeColor = "bg-blue-500 text-white";
    } else if (achievementLevel === 'kabupaten' || gradeAverage >= 85) {
      title = "Subsidi Khusus Saudara Kandung";
      discount = "Diskon Daftar 25%";
      benefit = "Kemudahan pembayaran bagi wali murid yang memiliki lebih dari 1 anak bersekolah di MI Cibungur I.";
      bg = "bg-purple-50 border-purple-200 text-purple-950";
      badgeColor = "bg-purple-500 text-white";
    }

    return { title, discount, benefit, bg, badgeColor };
  };

  // Estimate admission probability
  const getAdmissionChance = () => {
    const juzNum = parseInt(isTahfidz);
    let chance = "Sangat Tinggi (95%+)";
    let color = "text-emerald-600 font-bold";
    let note = "Siswa memiliki modal kelayakan dasar yang sangat baik untuk langsung diterima setelah verifikasi berkas.";

    if (juzNum >= 3 || achievementLevel === 'nasional' || gradeAverage >= 90) {
      chance = "Jaminan Lolos Otomatis (99%)";
      color = "text-amber-600 font-extrabold animate-pulse";
      note = "Selamat! Calon siswa memenuhi kriteria pendaftaran Bebas Tes Akademik MI Cibungur I.";
    } else if (gradeAverage < 80 && achievementLevel === 'tidak-ada' && juzNum === 0) {
      chance = "Tinggi (85%)";
      color = "text-emerald-600";
      note = "Akan dibantu pembinaan minat bakat membaca & menulis oleh dewan guru kami.";
    }

    return { chance, color, note };
  };

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
      notes: `Estimasi Beasiswa: ${getScholarshipEstimation().title} (${getScholarshipEstimation().discount}). Nilai Rata-rata: ${gradeAverage}. Hafalan: ${isTahfidz} Juz.`
    });

    setIsSubmitted(true);
  };

  const est = getScholarshipEstimation();
  const chance = getAdmissionChance();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12" id="ppdb-container">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
          Penerimaan Peserta Didik Baru (PPDB) 2026/2027
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mt-3">
          Pendaftaran Siswa Baru MI Cibungur I
        </h2>
        <p className="text-slate-600 mt-4 text-base md:text-lg">
          Membimbing putra-putri Anda tumbuh cerdas, sholeh, dan berakhlak mulia sejak dini. Gunakan simulator sederhana di bawah untuk melihat perkiraan program beasiswa atau keringanan biaya yang berhak didapatkan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Scholarship Predictor (The Hook) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 shadow-xl shadow-slate-100/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                Simulator PPDB Cerdas
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Cek kelolosan & beasiswa instan
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Input 1: Grade Average */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  Nilai Rapor TK / Kesiapan Belajar Anak
                </label>
                <span className="text-base font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                  {gradeAverage}
                </span>
              </div>
              <input 
                type="range" 
                min="70" 
                max="100" 
                value={gradeAverage} 
                onChange={(e) => setGradeAverage(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
                <span>Cukup Mandiri</span>
                <span>Siap Belajar</span>
                <span>Sangat Berbakat</span>
              </div>
            </div>

            {/* Input 2: Non-Academic Achievement */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Prestasi Non-Akademik (Seni/Sains/Olahraga)
              </label>
              <select 
                value={achievementLevel} 
                onChange={(e) => setAchievementLevel(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50 font-medium text-slate-700"
              >
                <option value="tidak-ada">Belum Ada Prestasi Khusus</option>
                <option value="kabupaten">Tingkat Kota / Kabupaten (Juara 1-3)</option>
                <option value="provinsi">Tingkat Provinsi (Juara 1-3)</option>
                <option value="nasional">Tingkat Nasional / Internasional (Juara 1-3)</option>
              </select>
            </div>

            {/* Input 3: Tahfidz Qur'an */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Hafalan Surah Pendek (Juz Amma)
              </label>
              <select 
                value={isTahfidz} 
                onChange={(e) => setIsTahfidz(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-slate-50 font-medium text-slate-700"
              >
                <option value="0">Baru Mengenal Huruf Hijaiyah</option>
                <option value="1">Hafal 5 - 10 Surah Pendek</option>
                <option value="3">Hafal Sebagian Juz Amma (10+ Surah)</option>
                <option value="10">Hafal Juz 30 Lengkap (Istimewa)</option>
              </select>
            </div>

            {/* Output Result Dashboard */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 ${est.bg}`}>
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-lg ${est.badgeColor} mt-0.5 shrink-0`}>
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 leading-none mb-1">
                    ESTIMASI BEASISWA
                  </p>
                  <h4 className="font-extrabold text-base tracking-tight mb-1">
                    {est.title}
                  </h4>
                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-2xl font-black tracking-tight text-emerald-600">
                      {est.discount}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">Uang SPP Pokok</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {est.benefit}
                  </p>
                </div>
              </div>

              {/* Admission Chance */}
              <div className="mt-4 pt-4 border-t border-slate-100/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-500">Peluang Kelolosan Seleksi:</span>
                  <span className={`text-xs font-extrabold ${chance.color}`}>{chance.chance}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {chance.note}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Registration Draft Form */}
        <div className="lg:col-span-7">
          {!isSubmitted ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xl shadow-slate-100/50">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="h-5.5 w-5.5 text-emerald-600" />
                  Formulir Pendaftaran Draf PPDB
                </h3>
                <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                  Isi informasi dasar di bawah ini untuk mengunci kuota beasiswa Anda. Tim humas dan penerimaan siswa baru akan segera memvalidasi dan memproses draf berkas ini.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5" id="ppdb-form">
                {/* Grade Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tingkat Peminatan Pendaftaran
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Kelas 1 MI (Baru)', 'Kelas 2-3 (Pindahan)', 'Kelas 4-5 (Pindahan)'].map((grade) => (
                      <button
                        type="button"
                        key={grade}
                        onClick={() => setGradeSelection(grade)}
                        className={`py-3 px-1 text-center text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                          gradeSelection === grade
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
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
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Dengan mendaftar draf ini, anak Anda diprioritaskan mendapatkan **kuota khusus wawancara** dan hak klaim beasiswa <span className="font-semibold text-emerald-700">{est.title} ({est.discount})</span> jika hasil tes wawancara berkas sesuai.
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
            <div className="bg-emerald-50/40 rounded-3xl border border-emerald-100 p-8 text-center shadow-lg flex flex-col items-center justify-center min-h-[450px]">
              <div className="h-16 w-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Pendaftaran Draf Berhasil!
              </h3>
              <p className="text-emerald-800 text-xs font-semibold uppercase tracking-wider bg-emerald-100/60 px-3 py-1 rounded-full mt-2">
                Nomor Tiket: PPDB-2026-{Math.floor(Math.random() * 9000 + 1000)}
              </p>
              
              <div className="max-w-md mx-auto my-6 space-y-4 text-left bg-white border border-emerald-100/60 p-5 rounded-2xl">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Terima kasih Ibu/Bapak <strong className="text-slate-900">{parentName}</strong>, draf pendaftaran untuk putra-putri tercinta <strong className="text-slate-900">{studentName}</strong> telah kami terima di database penerimaan siswa baru.
                </p>
                <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
                  <p className="text-slate-500 flex justify-between">
                    <span>Program Minat:</span> <strong className="text-slate-800">{gradeSelection}</strong>
                  </p>
                  <p className="text-slate-500 flex justify-between">
                    <span>Estimasi Beasiswa:</span> <strong className="text-emerald-700">{est.title}</strong>
                  </p>
                  <p className="text-slate-500 flex justify-between">
                    <span>Klaim Potongan:</span> <strong className="text-emerald-700 font-extrabold">{est.discount} SPP</strong>
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6">
                Panitia PPDB Sekolah akan menghubungi Bapak/Ibu melalui nomor WhatsApp <strong className="text-slate-700">{phone}</strong> dalam kurun waktu 1x24 jam untuk pengiriman berkas kelengkapan digital.
              </p>

              <div className="flex gap-3">
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
