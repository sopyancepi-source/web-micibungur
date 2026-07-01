/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Target, History, Award, CheckCircle2, ShieldCheck, Heart, Users, Star } from 'lucide-react';
import { SchoolProfile, HistoricalFigure } from '../types';

interface SekilasMadrasahProps {
  schoolProfile: SchoolProfile;
  historicalFigures?: HistoricalFigure[];
}

export default function SekilasMadrasah({ schoolProfile, historicalFigures = [] }: SekilasMadrasahProps) {
  // Fallbacks in case properties are not configured yet
  const title = schoolProfile.sekilasTitle || 'Selayang Pandang MI Cibungur I';
  const subtitle = schoolProfile.sekilasSubtitle || 'Mengenal Sejarah, Visi Misi, dan Nilai Dasar Perjuangan Madrasah Kami';
  
  const historyText = schoolProfile.sekilasHistory || '';
  const visiText = schoolProfile.sekilasVisi || '';
  const misiText = schoolProfile.sekilasMisi || '';
  
  const nilaiTitle = schoolProfile.sekilasNilaiTitle || 'Falsafah Pendidikan "Panca Khidmat"';
  const nilaiDesc = schoolProfile.sekilasNilaiDesc || '';

  // Helpers to split lines nicely for Visi / Misi display
  const renderMisiPoints = () => {
    if (!misiText) return null;
    return misiText.split('\n').filter(line => line.trim().length > 0).map((line, idx) => {
      // Remove numbers if they already have "1." etc to avoid duplication
      const cleanedLine = line.replace(/^\d+[\.\s\-]+/g, '').trim();
      return (
        <li key={idx} className="flex items-start gap-3 group text-slate-700 text-sm leading-relaxed">
          <span className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs mt-0.5 border border-emerald-100/50 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-300">
            {idx + 1}
          </span>
          <span className="flex-1">{cleanedLine}</span>
        </li>
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20">
      {/* 1. Header Hero Area */}
      <section className="relative bg-gradient-to-b from-[#e6f4ed] via-[#f1f8f5] to-transparent py-16 sm:py-20 border-b border-emerald-100/30 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#059669_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2.5 bg-emerald-100/80 border border-emerald-200/50 text-emerald-950 text-xs font-extrabold px-4 py-2 rounded-full uppercase tracking-widest shadow-sm mb-6">
            <BookOpen className="h-4 w-4 text-emerald-700 animate-pulse" />
            <span>Mengenal Madrasah</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight max-w-3xl mx-auto font-sans">
            {title}
          </h1>
          <p className="mt-4 text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: History & Philosophy (8 Columns) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Sejarah Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 md:p-10 shadow-sm shadow-slate-100 hover:shadow-md transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-emerald-50/50 via-transparent to-transparent pointer-events-none rounded-full" />
              
              <div className="flex items-center gap-3.5 mb-6">
                <div className="h-11 w-11 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-950">Sejarah & Rekam Jejak</h2>
                  <p className="text-xs text-slate-500">Asal-usul berdirinya perjuangan pendidikan madrasah</p>
                </div>
              </div>

              {historyText ? (
                <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-wrap">
                  {historyText}
                </div>
              ) : (
                <p className="text-slate-400 text-xs italic">Sejarah madrasah belum dikonfigurasi.</p>
              )}
            </div>

            {/* Panca Khidmat / Values Card */}
            <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-xl shadow-emerald-950/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.3px,transparent_0.3px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
              
              <div className="flex items-center gap-3.5 mb-6 relative z-10">
                <div className="h-11 w-11 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">{nilaiTitle}</h2>
                  <p className="text-xs text-emerald-300">Nilai dasar dan landasan utama dedikasi guru</p>
                </div>
              </div>

              {nilaiDesc ? (
                <p className="text-emerald-50 text-sm sm:text-base leading-relaxed mb-8 relative z-10 font-medium">
                  {nilaiDesc}
                </p>
              ) : (
                <p className="text-emerald-300/60 text-xs italic mb-8 relative z-10">Falsafah pendidikan belum dikonfigurasi.</p>
              )}

              {/* Grid of Panca Khidmat values */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 relative z-10">
                {[
                  { label: 'Keikhlasan', desc: 'Ikhlas Mengajar' },
                  { label: 'Kasih Sayang', desc: 'Membimbing Intensif' },
                  { label: 'Kesabaran', desc: 'Mendidik Lembut' },
                  { label: 'Keteladanan', desc: 'Ibadah Nyata' },
                  { label: 'Kejujuran', desc: 'Amanah Teruji' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-colors duration-200">
                    <span className="block text-amber-300 text-sm font-extrabold mb-1">{item.label}</span>
                    <span className="text-[10px] text-emerald-200 leading-normal">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right: Vision & Mission (4 Columns) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Visi Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm shadow-slate-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3.5 mb-5">
                <div className="h-11 w-11 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-950">Visi Utama</h2>
                  <p className="text-xs text-slate-500">Cita-cita jangka panjang madrasah</p>
                </div>
              </div>

              {visiText ? (
                <div className="bg-amber-50/40 border border-amber-100/50 rounded-2xl p-5 text-slate-800 text-sm font-medium leading-relaxed italic relative">
                  <span className="absolute top-2 left-2 text-3xl text-amber-300 leading-none select-none">“</span>
                  <p className="pl-4 pr-2 pt-1">{visiText}</p>
                </div>
              ) : (
                <p className="text-slate-400 text-xs italic">Visi madrasah belum dikonfigurasi.</p>
              )}
            </div>

            {/* Misi Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm shadow-slate-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3.5 mb-5">
                <div className="h-11 w-11 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-950">Misi Perjuangan</h2>
                  <p className="text-xs text-slate-500">Langkah nyata mewujudkan visi</p>
                </div>
              </div>

              {misiText ? (
                <ul className="space-y-4">
                  {renderMisiPoints()}
                </ul>
              ) : (
                <p className="text-slate-400 text-xs italic">Misi madrasah belum dikonfigurasi.</p>
              )}
            </div>

            {/* Hubungi & Support Widget */}
            <div className="bg-gradient-to-tr from-slate-900 to-slate-950 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -top-10 -left-10 h-28 w-28 bg-emerald-500/10 rounded-full blur-xl" />
              <h3 className="font-bold text-sm mb-2 relative z-10">Dukung Masa Depan Anak Anda</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4 relative z-10">
                Mari daftarkan putra-putri Anda ke program PPDB unggulan untuk mengunci kuota beasiswa karakter kami sekarang juga.
              </p>
              <button 
                onClick={() => {
                  const btn = document.getElementById('nav-btn-ppdb');
                  if (btn) btn.click();
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Daftar PPDB Sekarang
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Galeri Tokoh Sejarah & Guru Purna Bakti */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 pt-12 border-t border-slate-200/60 text-left">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-100 uppercase tracking-wider mb-3">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span>Galeri Kehormatan & Pengabdian</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-none font-sans">
            Pendiri & Guru Purna Bakti
          </h2>
          <p className="mt-3 text-slate-500 text-xs sm:text-sm leading-relaxed">
            Segenap penghormatan dan doa terbaik kami haturkan kepada para perintis perjuangan pendidikan serta bapak/ibu guru yang telah tuntas mengabdikan hidupnya di MI Cibungur I.
          </p>
        </div>

        {historicalFigures.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pendiri Section */}
            <div className="bg-gradient-to-b from-amber-50/20 to-transparent rounded-3xl p-6 sm:p-8 border border-amber-100/40">
              <div className="flex items-center gap-2.5 mb-6">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                <h3 className="font-extrabold text-slate-950 text-sm sm:text-base uppercase tracking-wider font-sans">Perintis & Pendiri Madrasah</h3>
              </div>
              
              <div className="space-y-6">
                {historicalFigures.filter(f => f.role === 'pendiri').map((fig) => (
                  <div key={fig.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center hover:shadow-md hover:border-amber-100 transition-all duration-300">
                    <div className="h-24 w-24 rounded-2xl overflow-hidden bg-slate-100 border-2 border-amber-200 flex-shrink-0 relative">
                      <img src={fig.photo} alt={fig.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-slate-950 text-sm sm:text-base leading-tight font-sans">{fig.name}</h4>
                        <span className="bg-amber-100 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider">Pendiri</span>
                      </div>
                      <p className="text-xs font-semibold text-amber-700">{fig.period}</p>
                      {fig.bio && <p className="text-xs text-slate-600 leading-relaxed italic">"{fig.bio}"</p>}
                    </div>
                  </div>
                ))}
                {historicalFigures.filter(f => f.role === 'pendiri').length === 0 && (
                  <div className="text-center py-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                    <p className="text-xs text-slate-400 italic">Belum ada data pendiri madrasah yang dipajang.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Purna Bakti Section */}
            <div className="bg-gradient-to-b from-emerald-50/20 to-transparent rounded-3xl p-6 sm:p-8 border border-emerald-100/40">
              <div className="flex items-center gap-2.5 mb-6">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="font-extrabold text-slate-950 text-sm sm:text-base uppercase tracking-wider font-sans">Guru Purna Bakti (Pensiun)</h3>
              </div>
              
              <div className="space-y-6">
                {historicalFigures.filter(f => f.role === 'purna').map((fig) => (
                  <div key={fig.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center hover:shadow-md hover:border-emerald-100 transition-all duration-300">
                    <div className="h-24 w-24 rounded-2xl overflow-hidden bg-slate-100 border-2 border-emerald-200 flex-shrink-0 relative">
                      <img src={fig.photo} alt={fig.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-slate-950 text-sm sm:text-base leading-tight font-sans">{fig.name}</h4>
                        <span className="bg-emerald-100 text-emerald-900 font-extrabold px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider">Purna Bakti</span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-700">{fig.period}</p>
                      {fig.bio && <p className="text-xs text-slate-600 leading-relaxed italic">"{fig.bio}"</p>}
                    </div>
                  </div>
                ))}
                {historicalFigures.filter(f => f.role === 'purna').length === 0 && (
                  <div className="text-center py-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                    <p className="text-xs text-slate-400 italic">Belum ada data guru purna bakti yang dipajang.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
            <p className="text-sm text-slate-500 italic">Belum ada data perintis atau guru purna bakti yang dikonfigurasi.</p>
          </div>
        )}
      </section>

    </div>
  );
}
