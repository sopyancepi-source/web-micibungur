/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { School, GraduationCap, Menu, X, Bell, LayoutDashboard, UserCheck } from 'lucide-react';
import { SchoolProfile } from '../types';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  isAdminLoggedIn: boolean;
  onToggleAdmin: () => void;
  latestImportantAnnouncement?: string;
  schoolProfile?: SchoolProfile;
  onOpenAnnouncements?: () => void;
}

export default function Navbar({
  currentView,
  setView,
  isAdminLoggedIn,
  onToggleAdmin,
  latestImportantAnnouncement,
  schoolProfile,
  onOpenAnnouncements
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'sekilas', label: 'Sekilas' },
    { id: 'fasilitas', label: 'Fasilitas' },
    { id: 'guru', label: 'Profil Guru' },
    { id: 'kabar-kelas', label: 'Kabar Kelas' },
    { id: 'kegiatan', label: 'Kegiatan Siswa' },
    { id: 'ppdb', label: 'Pendaftaran PPDB' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f1f8f5]/95 backdrop-blur-md border-b border-emerald-100/60 shadow-sm">
      {/* Announcement Bar */}
      {latestImportantAnnouncement && (
        <div 
          onClick={onOpenAnnouncements}
          title="Klik untuk membuka Pusat Pengumuman & Informasi"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2 px-4 overflow-hidden relative cursor-pointer group/marquee transition-colors duration-200"
        >
          <div className="mx-auto max-w-7xl w-full flex items-center relative">
            {/* Solid background and wrapper for PENTING badge to hide text scrolling underneath */}
            <div className="relative z-20 bg-emerald-600 group-hover/marquee:bg-emerald-700 flex items-center gap-2 pr-3.5 shrink-0 select-none transition-colors duration-200">
              <span className="bg-amber-400 text-emerald-950 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest animate-pulse shadow-sm">
                Penting
              </span>
              <span className="text-emerald-400 font-bold">|</span>
            </div>

            {/* Scrolling container with absolute gradient overlays for the "titik hilang" fade effect */}
            <div className="flex-1 overflow-hidden relative h-5">
              {/* Left vanishing gradient */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-emerald-600 group-hover/marquee:from-emerald-700 to-transparent z-10 pointer-events-none transition-colors duration-200" />
              {/* Right vanishing gradient */}
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-emerald-600 group-hover/marquee:from-emerald-700 to-transparent z-10 pointer-events-none transition-colors duration-200" />

              {/* Seamless looping Marquee Track */}
              <div className="absolute inset-0 flex items-center">
                <div className="flex gap-16 whitespace-nowrap animate-marquee shrink-0">
                  <div className="flex gap-16 items-center shrink-0">
                    <span className="font-semibold tracking-wide text-emerald-50 group-hover/marquee:underline decoration-amber-400 decoration-2 underline-offset-2">{latestImportantAnnouncement}</span>
                    <span className="text-amber-400 font-black select-none text-xs">✦</span>
                  </div>
                  <div className="flex gap-16 items-center shrink-0">
                    <span className="font-semibold tracking-wide text-emerald-50 group-hover/marquee:underline decoration-amber-400 decoration-2 underline-offset-2">{latestImportantAnnouncement}</span>
                    <span className="text-amber-400 font-black select-none text-xs">✦</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Click prompt indicator */}
            <div className="relative z-20 bg-emerald-600 group-hover/marquee:bg-emerald-700 pl-3 flex items-center text-[10px] text-amber-300 font-extrabold uppercase tracking-wider select-none shrink-0 transition-colors duration-200">
              <span className="hidden sm:inline">Lihat Detail</span>
              <span className="ml-1">&rarr;</span>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Brand */}
          <div 
            onClick={() => { setView('beranda'); setIsMobileMenuOpen(false); }} 
            className="flex items-center gap-3 cursor-pointer group"
            id="nav-logo"
          >
            {schoolProfile?.logo ? (
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-md shadow-emerald-900/10 border border-emerald-500/20 group-hover:scale-105 transition-all duration-300 overflow-hidden shrink-0">
                <img 
                  src={schoolProfile.logo} 
                  alt="Logo Madrasah" 
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-amber-100 shadow-md shadow-emerald-900/10 group-hover:from-emerald-600 group-hover:to-emerald-800 transition-all duration-300 transform group-hover:scale-105 border border-emerald-500/20">
                <GraduationCap className="h-6 w-6 text-amber-400" />
              </div>
            )}
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors leading-none font-sans">
                {schoolProfile?.schoolName || 'MI CIBUNGUR I'}
              </h1>
              <p className="text-[9px] font-bold tracking-[0.2em] text-amber-700 mt-1 uppercase">
                {schoolProfile?.schoolSlogan || 'BANDUNG BARAT'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  id={`nav-link-${item.id}`}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-emerald-800 bg-white font-bold border-b-2 border-emerald-600 rounded-b-none shadow-sm'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-white/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3.5">
            {/* PPDB Button */}
            <button
              onClick={() => setView('ppdb')}
              id="nav-btn-ppdb"
              className="relative overflow-hidden px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 rounded-xl shadow-md hover:shadow-lg shadow-emerald-900/10 hover:shadow-emerald-700/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer border border-emerald-600/20"
            >
              <span className="relative z-10 flex items-center gap-1">
                {schoolProfile?.ppdbButtonText ? (
                  schoolProfile.ppdbButtonText.includes(schoolProfile.ppdbYear || '2026') ? (
                    <>
                      {schoolProfile.ppdbButtonText.split(schoolProfile.ppdbYear || '2026')[0]}
                      <span className="text-amber-400">{schoolProfile.ppdbYear || '2026'}</span>
                      {schoolProfile.ppdbButtonText.split(schoolProfile.ppdbYear || '2026')[1]}
                    </>
                  ) : (
                    schoolProfile.ppdbButtonText
                  )
                ) : (
                  <>Daftar PPDB <span className="text-amber-400">2026</span></>
                )}
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              id="btn-mobile-menu"
              className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-100/40 bg-[#f1f8f5]/98 backdrop-blur-md px-4 py-4 space-y-3 shadow-lg">
          <div className="grid grid-cols-1 gap-2">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  id={`nav-mob-link-${item.id}`}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'text-emerald-800 bg-white border border-emerald-100/50 shadow-sm'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-white/40'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setView('ppdb');
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-3 text-center text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md transition-all"
            >
              {schoolProfile?.ppdbButtonText || 'Daftar PPDB 2026/2027'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
