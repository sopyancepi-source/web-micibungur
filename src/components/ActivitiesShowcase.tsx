/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Activity } from '../types';
import { Search, Calendar, User, X, Filter, ArrowUpRight } from 'lucide-react';

interface ActivitiesShowcaseProps {
  activities: Activity[];
  setView: (view: string) => void;
}

export default function ActivitiesShowcase({ activities, setView }: ActivitiesShowcaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const categories = ['Semua', 'Akademik', 'Prestasi', 'Ekskul', 'Sosial', 'Keagamaan'];

  const filteredActivities = activities.filter((act) => {
    const matchesSearch = act.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          act.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || act.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12" id="kegiatan-page">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
          Kabar & Dokumentasi Kegiatan Siswa
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mt-3">
          Mengintip Dinamika Belajar di Sekolah Kami
        </h2>
        <p className="text-slate-600 mt-4 text-sm md:text-base">
          Ikuti berbagai keseruan belajar, perlombaan akademik, pementasan bakat seni, hingga program bakti sosial siswa-siswi unggulan kami setiap pekannya.
        </p>
      </div>

      {/* Guide Banner for Teachers */}
      <div className="bg-emerald-50/70 border border-emerald-100/60 rounded-2xl p-5 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">
            Apakah Anda Staf, Pembina OSIS, atau Guru?
          </h4>
          <p className="text-slate-500 text-xs mt-1">
            Anda dapat mendokumentasikan kegiatan atau prestasi siswa terbaru langsung ke dalam portal publik ini.
          </p>
        </div>
        <button 
          onClick={() => setView('admin')}
          className="flex items-center gap-1 px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow hover:shadow-emerald-600/10 cursor-pointer"
        >
          <span>Masuk Portal Guru</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari dokumentasi kegiatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-slate-200 pl-11 pr-4 py-3 text-sm focus:border-emerald-500 focus:outline-none bg-white shadow-sm"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-1.5 flex-wrap w-full md:w-auto justify-start md:justify-end">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Activities Grid */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="h-12 w-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Filter className="h-6 w-6" />
          </div>
          <h4 className="font-bold text-slate-700 text-sm">Tidak Ada Kegiatan yang Cocok</h4>
          <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian atau kategori filter lainnya.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredActivities.map((act) => (
            <article 
              key={act.id}
              onClick={() => setSelectedActivity(act)}
              className="bg-white rounded-2xl border border-slate-100/80 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              {/* Image Frame */}
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={act.image} 
                  alt={act.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
                    {act.category}
                  </span>
                </div>
              </div>

              {/* Text Area */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {act.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" /> {act.author}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm md:text-base text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                    {act.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {act.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1">
                    Selengkapnya <span>&rarr;</span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* High Fidelity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            {/* Header image & close button */}
            <div className="relative h-60 md:h-80 shrink-0">
              <img src={selectedActivity.image} alt={selectedActivity.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              <button 
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {selectedActivity.category}
                </span>
                <h3 className="text-lg md:text-2xl font-black mt-2 leading-tight">
                  {selectedActivity.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-4">
              <div className="flex items-center gap-4 text-xs text-slate-400 font-mono border-b border-slate-100 pb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-emerald-600" /> Tanggal Rilis: {selectedActivity.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-emerald-600" /> Humas: {selectedActivity.author}
                </span>
              </div>

              <div className="text-slate-600 text-sm leading-relaxed space-y-3.5">
                {selectedActivity.description.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[11px] text-slate-400 mt-6 leading-relaxed">
                Materi di atas diterbitkan resmi oleh Divisi Hubungan Masyarakat SMA Unggulan Nusantara. Seluruh isi tulisan, foto, dan video pendukung dilindungi oleh hak cipta sekolah.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-100 py-4 px-6 md:px-8 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedActivity(null)}
                className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
              >
                Tutup Dokumen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
