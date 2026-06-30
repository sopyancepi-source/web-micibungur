/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Award, 
  TrendingUp, 
  Users, 
  Trophy, 
  School, 
  BookOpen, 
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { SCHOOL_STATS } from '../data';
import { SchoolProfile } from '../types';

interface StatsSectionProps {
  schoolProfile?: SchoolProfile;
}

export default function StatsSection({ schoolProfile }: StatsSectionProps) {
  return (
    <section className="bg-slate-900 text-white rounded-3xl py-12 px-6 md:p-12 relative overflow-hidden my-12 shadow-xl">
      <div className="absolute top-0 right-0 h-64 w-64 bg-emerald-500 rounded-full blur-3xl opacity-15 transform translate-x-20 -translate-y-20" />
      <div className="absolute bottom-0 left-0 h-64 w-64 bg-blue-500 rounded-full blur-3xl opacity-10 transform -translate-x-20 translate-y-20" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Pitch text */}
        <div className="lg:col-span-5 space-y-4 text-left">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-emerald-500/20 inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Rekam Jejak Prestasi & Mutu
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Mengapa Memilih {schoolProfile?.schoolName || 'MI Cibungur I'}?
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Sebagai madrasah pilihan utama di wilayah Bandung Barat, kami memadukan pendidikan kurikulum nasional dasar dengan penanaman nilai-nilai spiritual keagamaan demi membimbing anak menjadi pribadi yang sholeh, cerdas, dan sholehah.
          </p>

          <div className="pt-4 space-y-3.5 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
              <span>Kurikulum Terpadu Kementerian Agama & Kemendikbudristek</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
              <span>Pembiasaan Shalat Dhuha, Dzuhur Berjamaah, & Doa Harian</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
              <span>Fokus Pembinaan Adab, Kesopanan, & Bakti Kepada Orang Tua</span>
            </div>
          </div>
        </div>

        {/* Right Side: Bento Grid of Stats */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Stat 1: Acreditation */}
          <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-2xl p-6 flex items-start gap-4 hover:border-emerald-500/40 transition-colors text-left">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight text-white">{SCHOOL_STATS.acreditation}</p>
              <h4 className="text-xs font-bold text-slate-400 uppercase mt-0.5 tracking-wider">Akreditasi Madrasah</h4>
              <p className="text-[11px] text-slate-500 mt-1">{schoolProfile?.statAcreditation || 'Terakreditasi A (Sangat Baik), menjamin mutu pengajaran anak Anda.'}</p>
            </div>
          </div>

          {/* Stat 2: PTN Passing Rate */}
          <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-2xl p-6 flex items-start gap-4 hover:border-emerald-500/40 transition-colors text-left">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight text-white">{SCHOOL_STATS.passingRateToPTN}</p>
              <h4 className="text-xs font-bold text-slate-400 uppercase mt-0.5 tracking-wider">Pendidikan Akhlak</h4>
              <p className="text-[11px] text-slate-500 mt-1">{schoolProfile?.statAdab || 'Siswa dibimbing membiasakan adab kesopanan dan doa sehari-hari.'}</p>
            </div>
          </div>

          {/* Stat 3: Teachers */}
          <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-2xl p-6 flex items-start gap-4 hover:border-emerald-500/40 transition-colors text-left">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight text-white">{SCHOOL_STATS.teacherS2S3}</p>
              <h4 className="text-xs font-bold text-slate-400 uppercase mt-0.5 tracking-wider">Guru Ramah Anak</h4>
              <p className="text-[11px] text-slate-500 mt-1">{schoolProfile?.statTeachers || 'Dididik langsung oleh ustadz & ustadzah sabar, telaten, dan berdedikasi.'}</p>
            </div>
          </div>

          {/* Stat 4: Ratio & Trophies */}
          <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-2xl p-6 flex items-start gap-4 hover:border-emerald-500/40 transition-colors text-left">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight text-white">{SCHOOL_STATS.nationalTrophies}</p>
              <h4 className="text-xs font-bold text-slate-400 uppercase mt-0.5 tracking-wider">Hafalan Juz 30</h4>
              <p className="text-[11px] text-slate-500 mt-1">{schoolProfile?.statTahfidz || 'Setiap lulusan ditargetkan hafal Juz Amma (Juz 30) dengan bacaan tartil.'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
