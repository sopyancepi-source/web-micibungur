/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Calendar, 
  User, 
  BookOpen, 
  FileText, 
  X,
  Sparkles,
  Heart,
  Award
} from 'lucide-react';
import { Teacher } from '../types';

interface TeacherProfileProps {
  teachers: Teacher[];
}

export default function TeacherProfile({ teachers }: TeacherProfileProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [roleFilter, setRoleFilter] = useState('Semua');

  // Filter teachers by name and role
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          teacher.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (teacher.education && teacher.education.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesRole = true;
    if (roleFilter !== 'Semua') {
      if (roleFilter === 'Kepala') {
        matchesRole = teacher.role.toLowerCase().includes('kepala');
      } else if (roleFilter === 'Kelas') {
        matchesRole = teacher.role.toLowerCase().includes('kelas');
      } else if (roleFilter === 'Mapel') {
        matchesRole = !teacher.role.toLowerCase().includes('kepala') && !teacher.role.toLowerCase().includes('kelas');
      }
    }

    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-slate-50/50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-12">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            <Sparkles className="h-3 w-3 text-emerald-600" />
            <span>Pendidik & Tenaga Kependidikan</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-950 sm:text-4xl tracking-tight leading-none">
            Mengenal Dewan Guru & Staf MI Cibungur I
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Guru-guru kami adalah ustadz dan ustadzah berdedikasi tinggi yang mendidik anak-anak dengan kasih sayang, keteladanan ibadah nyata, serta bekal ilmu dunia dan akhirat.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-3xl border border-slate-200/60 p-5 shadow-sm max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          
          {/* Search Box */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, mata pelajaran, atau riwayat kuliah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl border border-slate-200 focus:border-emerald-500 focus:outline-none bg-slate-50/50 transition-colors"
            />
          </div>

          {/* Role Filter Tabs */}
          <div className="flex bg-slate-100 rounded-2xl p-1 gap-1">
            {['Semua', 'Kepala', 'Kelas', 'Mapel'].map((category) => (
              <button
                key={category}
                onClick={() => setRoleFilter(category)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  roleFilter === category
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Teachers */}
        {filteredTeachers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 max-w-7xl mx-auto">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                onClick={() => setSelectedTeacher(teacher)}
                className="group bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden hover:shadow-lg hover:border-emerald-500/20 hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col h-full text-left animate-in fade-in slide-in-from-bottom-4 duration-300 w-full"
              >
                {/* Photo frame - Tall portrait aspect ratio */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                  <img
                    src={teacher.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=350'}
                    alt={teacher.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="bg-emerald-500/95 text-white text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-sm">
                      {teacher.status || 'Aktif'}
                    </span>
                  </div>
                </div>

                {/* Content info card - Placed below the photo for perfect readability */}
                <div className="p-3.5 flex-grow flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    {/* Role & Name */}
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-widest leading-none line-clamp-1">
                        {teacher.role}
                      </p>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                        {teacher.name}
                      </h3>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Pendidikan */}
                    <div className="flex items-start gap-1.5 text-[11px] text-slate-500">
                      <GraduationCap className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-700 leading-tight">Pendidikan</p>
                        <p className="line-clamp-1 mt-0.5 text-slate-500 text-[10px]">{teacher.education || '-'}</p>
                      </div>
                    </div>

                    {/* Bio */}
                    {teacher.bio && (
                      <p className="text-[10px] text-slate-400 italic line-clamp-2 leading-relaxed bg-slate-50/50 p-2 rounded-xl border border-slate-100/30">
                        "{teacher.bio}"
                      </p>
                    )}
                  </div>

                  {/* Footer info */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 font-medium">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-emerald-600/70" />
                      <span className="line-clamp-1">Sejak {teacher.joinedYear || '-'}</span>
                    </div>
                    <span className="text-emerald-700 font-extrabold tracking-wide uppercase group-hover:translate-x-0.5 transition-transform duration-300 flex items-center gap-0.5 shrink-0">
                      Detail &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl max-w-xl mx-auto p-8 space-y-4">
            <Search className="h-10 w-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">Guru Tidak Ditemukan</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kami tidak dapat menemukan pendidik yang cocok dengan kata pencarian Anda. Coba periksa ejaan atau gunakan filter kategori.
            </p>
          </div>
        )}

        {/* Floating Detail Dialog / Modal */}
        {selectedTeacher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
            <div 
              className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedTeacher(null)}
                className="absolute top-4 right-4 z-10 bg-slate-900/40 hover:bg-slate-900/70 text-white rounded-full p-2 hover:scale-105 transition-all"
                title="Tutup Detail"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Photo Pane */}
              <div className="w-full md:w-5/12 h-64 md:h-auto min-h-[320px] relative bg-slate-50 shrink-0">
                <img
                  src={selectedTeacher.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=350'}
                  alt={selectedTeacher.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-950/20" />
                <div className="absolute bottom-6 left-6 text-white md:hidden">
                  <span className="bg-emerald-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                    {selectedTeacher.status || 'Aktif'}
                  </span>
                  <h3 className="text-xl font-extrabold leading-tight">{selectedTeacher.name}</h3>
                  <p className="text-xs font-bold text-emerald-300 mt-1 uppercase tracking-widest">{selectedTeacher.role}</p>
                </div>
              </div>

              {/* Detailed Specs Pane */}
              <div className="p-8 flex-grow space-y-6 text-left overflow-y-auto max-h-[80vh] md:max-h-[500px]">
                {/* Desktop Titles */}
                <div className="hidden md:block space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-100/50">
                      {selectedTeacher.status || 'Aktif'}
                    </span>
                    <span className="text-slate-400 text-xs font-medium">Mulai Mengajar: {selectedTeacher.joinedYear || '-'}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-950 tracking-tight leading-tight">
                    {selectedTeacher.name}
                  </h3>
                  <p className="text-sm font-bold text-emerald-800 tracking-wide">
                    {selectedTeacher.role}
                  </p>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Info sections */}
                <div className="space-y-4">
                  {/* Riwayat Pendidikan */}
                  <div className="flex items-start gap-3.5">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                      <GraduationCap className="h-4 w-4 text-emerald-700" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Riwayat Pendidikan</h4>
                      <p className="text-sm text-slate-800 font-semibold mt-1 leading-relaxed">
                        {selectedTeacher.education || 'Belum diisi'}
                      </p>
                    </div>
                  </div>

                  {/* Biografi Singkat */}
                  <div className="flex items-start gap-3.5">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                      <User className="h-4 w-4 text-emerald-700" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Biografi Singkat</h4>
                      <p className="text-sm text-slate-700 mt-1 leading-relaxed font-medium">
                        {selectedTeacher.biography || `Ustadz/Ustadzah ${selectedTeacher.name} adalah pendidik profesional di MI Cibungur I yang mengampu peran sebagai ${selectedTeacher.role}. Aktif berkontribusi meningkatkan kualitas pembelajaran dan membimbing siswa menjadi pribadi yang unggul, berkarakter, dan berakhlakul karimah.`}
                      </p>
                    </div>
                  </div>

                  {/* Motto Hidup / Pesan Pendidik */}
                  {selectedTeacher.bio && (
                    <div className="flex items-start gap-3.5">
                      <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                        <Heart className="h-4 w-4 text-emerald-700" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Pesan Pendidik & Motivasi</h4>
                        <p className="text-sm text-slate-600 italic mt-1.5 leading-relaxed bg-slate-50 border border-slate-100 p-3.5 rounded-2xl relative">
                          "{selectedTeacher.bio}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Pengabdian */}
                  <div className="flex items-start gap-3.5">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                      <Award className="h-4 w-4 text-emerald-700" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Pengabdian Kelembagaan</h4>
                      <p className="text-sm text-slate-700 mt-1 leading-relaxed font-medium">
                        Aktif mengabdi dan mendidik generasi muda di Kabupaten Bandung Barat secara istiqomah demi mencetak siswa cerdas berkarakter qur'ani.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setSelectedTeacher(null)}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg hover:scale-105"
                  >
                    Tutup Profil
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
