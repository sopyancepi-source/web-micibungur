/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Calendar, User, Clock, BookOpen, X, Filter, ChevronRight } from 'lucide-react';
import { KabarKelas } from '../types';

interface KabarKelasViewProps {
  kabarKelas: KabarKelas[];
}

export default function KabarKelasView({ kabarKelas }: KabarKelasViewProps) {
  const [selectedClass, setSelectedClass] = useState<string>('Semua Kelas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStory, setSelectedStory] = useState<KabarKelas | null>(null);

  const classes = ['Semua Kelas', 'Kelas I', 'Kelas II', 'Kelas III', 'Kelas IV', 'Kelas V', 'Kelas VI'];

  // Filter and search logic
  const filteredStories = kabarKelas.filter((story) => {
    const matchesClass = selectedClass === 'Semua Kelas' || story.className === selectedClass;
    const matchesSearch = 
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-left">
      {/* Title Header Section */}
      <div className="mb-12 border-b border-emerald-100 pb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
          <BookOpen className="h-3.5 w-3.5 text-amber-500" />
          <span>Kabar Aktivitas Harian</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mt-3 font-sans">
          Kabar Kelas MI Cibungur I
        </h2>
        <p className="text-slate-500 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
          Ikuti perkembangan belajar, kreasi, dan pembiasaan adab sholeh putra-putri kita langsung dari laporan harian ustadz/ustadzah wali kelas masing-masing.
        </p>
      </div>

      {/* Control Area: Filters and Search */}
      <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Class Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Filter Kelas:
          </span>
          {classes.map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedClass === cls
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/50'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kabar kelas..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Kabar Kelas Grid */}
      {filteredStories.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100/80 shadow-inner">
          <div className="mx-auto h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
            <Search className="h-5 w-5" />
          </div>
          <p className="text-sm font-bold text-slate-500">Tidak ada kabar kelas yang cocok</p>
          <p className="text-xs text-slate-400 mt-1">Silakan coba ganti filter kelas atau kata kunci pencarian Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-3xl border border-slate-200/50 shadow-xs hover:shadow-lg hover:border-emerald-200/80 transition-all duration-300 flex flex-col h-full overflow-hidden text-left group"
            >
              {/* Optional Image */}
              {story.image ? (
                <div className="relative h-48 overflow-hidden bg-slate-50 border-b border-slate-100">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-950/90 backdrop-blur text-white text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-md border border-emerald-800/30">
                    {story.className}
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 h-48 flex flex-col justify-between border-b border-slate-100">
                  <span className="bg-emerald-950/90 text-white text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-md border border-emerald-800/30 self-start">
                    {story.className}
                  </span>
                  <BookOpen className="h-10 w-10 text-emerald-600/30" />
                </div>
              )}

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Meta info */}
                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    <span>{story.date}</span>
                  </div>
                </div>

                <h4 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug line-clamp-2">
                  {story.title}
                </h4>

                <p className="text-slate-500 text-xs mt-3 leading-relaxed line-clamp-3 flex-grow">
                  {story.content}
                </p>

                {/* Footer and Read More Button */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-emerald-800 font-black text-xs shrink-0 border border-slate-200">
                      {story.authorName.charAt(0)}
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-700 truncate">
                      {story.authorName.split(',')[0]}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedStory(story)}
                    className="text-[11px] font-black text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Baca</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Story Detail Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setSelectedStory(null)}
          />
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 text-left flex flex-col">
            {/* Header image in modal */}
            {selectedStory.image && (
              <div className="h-64 sm:h-80 w-full relative shrink-0">
                <img
                  src={selectedStory.image}
                  alt={selectedStory.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-6 left-6 bg-emerald-600 text-white text-[10px] font-black tracking-widest uppercase px-3.5 py-1.5 rounded-lg border border-emerald-500/20 shadow-lg">
                  {selectedStory.className}
                </span>
                
                <button
                  onClick={() => setSelectedStory(null)}
                  className="absolute top-4 right-4 h-10 w-10 bg-slate-950/50 hover:bg-slate-950/80 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer border border-white/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 sm:p-8 flex-grow space-y-6">
              {/* Close button if no header image */}
              {!selectedStory.image && (
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-md">
                    {selectedStory.className}
                  </span>
                  <button
                    onClick={() => setSelectedStory(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                    <span>Diterbitkan: {selectedStory.date}</span>
                  </div>
                  <span>&bull;</span>
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-emerald-600" />
                    <span>Oleh: {selectedStory.authorName}</span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-950 leading-snug">
                  {selectedStory.title}
                </h3>
              </div>

              {/* Text content */}
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line border-t border-slate-100 pt-6">
                {selectedStory.content}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0 rounded-b-3xl">
              <button
                onClick={() => setSelectedStory(null)}
                className="px-5 py-2.5 bg-slate-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Tutup Kabar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
