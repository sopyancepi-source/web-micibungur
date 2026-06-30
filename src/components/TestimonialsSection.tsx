/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Testimonial } from '../types';
import { Quote, MessageSquare } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="py-12" id="testimoni-container">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
          Apa Kata Mereka?
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 mt-3">
          Testimoni Orang Tua & Kisah Sukses Alumni
        </h2>
        <p className="text-slate-500 mt-3 text-xs md:text-sm">
          Dengarkan langsung pengalaman berharga dan kisah inspiratif dari keluarga besar wali murid, alumni, serta siswa aktif kami.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((test) => (
          <div 
            key={test.id} 
            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
          >
            <Quote className="absolute top-6 right-6 h-10 w-10 text-slate-100 shrink-0 pointer-events-none" />
            
            <div className="relative z-10">
              <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-4 uppercase ${
                test.role === 'Orang Tua' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : test.role === 'Alumni' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
              }`}>
                {test.role}
              </span>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed italic mb-6">
                "{test.text}"
              </p>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-100 pt-4 mt-auto">
              <img 
                src={test.avatar} 
                alt={test.name} 
                className="w-10 h-10 rounded-full object-cover border border-slate-200" 
              />
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">{test.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{test.year}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
