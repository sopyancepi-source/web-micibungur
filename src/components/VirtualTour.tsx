/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Facility } from '../types';
import { Eye, Shield, Cpu, BookOpen, Trophy } from 'lucide-react';

interface VirtualTourProps {
  facilities: Facility[];
}

export default function VirtualTour({ facilities }: VirtualTourProps) {
  const [selectedTag, setSelectedTag] = useState<string>('Semua');
  const [activeFacility, setActiveFacility] = useState<Facility | null>(facilities[0]);

  const tags = ['Semua', 'Kelas', 'Ibadah', 'Literasi', 'Fisik'];

  const filteredFacilities = selectedTag === 'Semua' 
    ? facilities 
    : facilities.filter(f => f.tag === selectedTag);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12" id="fasilitas-container">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
          Fasilitas Unggulan & Lingkungan Madrasah
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mt-3">
          Lingkungan Belajar Asri dan Kondusif
        </h2>
        <p className="text-slate-600 mt-4 text-sm md:text-base">
          Kami menyediakan lingkungan belajar yang aman, bersih, dan asri untuk menunjang kenyamanan anak-anak dalam menghafal Qur'an, belajar, dan berinteraksi secara Islami.
        </p>
      </div>

      {/* Main Interactive Showcase */}
      {activeFacility && (
        <div className="mb-12 bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 text-left">
          {/* Large Image Showcase */}
          <div className="lg:col-span-7 relative h-[250px] md:h-[400px] group overflow-hidden">
            <img 
              src={activeFacility.image} 
              alt={activeFacility.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
              <div className="text-white">
                <span className="bg-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {activeFacility.tag}
                </span>
                <h3 className="text-xl md:text-2xl font-black mt-2 leading-tight">
                  {activeFacility.name}
                </h3>
              </div>
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between bg-slate-50/50">
            <div>
              <div className="flex gap-1.5 text-xs text-emerald-700 font-bold items-center mb-3">
                <Shield className="h-4 w-4" />
                <span>Terjaga Bersih & Aman</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-3">
                Keunggulan Lingkungan
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {activeFacility.description}
              </p>
              
              <div className="mt-6 space-y-3.5">
                <div className="flex gap-3 text-xs items-center">
                  <div className="h-6 w-6 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Cpu className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-slate-500">Lingkungan sejuk, jauh dari kebisingan jalan raya utama</span>
                </div>
                <div className="flex gap-3 text-xs items-center">
                  <div className="h-6 w-6 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <BookOpen className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-slate-500">Pembiasaan adab mengaji dan shalat harian didampingi guru</span>
                </div>
                <div className="flex gap-3 text-xs items-center">
                  <div className="h-6 w-6 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Trophy className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-slate-500">Perpustakaan ramah anak dengan buku kisah nabi bergambar</span>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-200/60 pt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Kunjungan langsung / Silaturahmi selalu terbuka</span>
              <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <Eye className="h-3.5 w-3.5" />
                <span>Peta Lokasi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Filter Grid */}
      <div>
        <div className="flex items-center justify-between mb-6 flex-col md:flex-row gap-4 border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900">
            Sudut Madrasah Kami
          </h3>
          <div className="flex gap-1.5 flex-wrap">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Small Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFacilities.map((fac) => {
            const isActive = activeFacility?.id === fac.id;
            return (
              <div 
                key={fac.id}
                onClick={() => setActiveFacility(fac)}
                className={`bg-white rounded-2xl border overflow-hidden cursor-pointer group hover:-translate-y-1 transition-all duration-300 ${
                  isActive 
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
                    : 'border-slate-100 shadow-sm'
                }`}
              >
                <div className="h-40 overflow-hidden relative">
                  <img src={fac.image} alt={fac.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {fac.tag}
                  </span>
                </div>
                <div className="p-4 text-left">
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {fac.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {fac.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
