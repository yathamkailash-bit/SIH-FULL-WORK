import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ArtisanPotteryIllustration } from './ArtisanPotteryIllustration';

export const Splash = () => {
  const { setCurrentStep } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-6 bg-[#FAF7F2] relative overflow-hidden select-none">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-200/40 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-200/40 rounded-full blur-3xl"></div>

      {/* Top Branding Section: Stylized flower/leaf logo mark */}
      <div className="pt-6 text-center flex flex-col items-center z-10">
        <div className="w-20 h-20 rounded-3xl bg-amber-50 text-white flex items-center justify-center shadow-xl mb-3 border-4 border-amber-200/60 p-2">
          {/* Orange flower bloom above a green 4-leaf cluster */}
          <svg width="54" height="54" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Orange Flower Bloom */}
            <circle cx="50" cy="32" r="14" fill="#F97316" />
            <circle cx="36" cy="38" r="11" fill="#FB923C" />
            <circle cx="64" cy="38" r="11" fill="#FB923C" />
            <circle cx="50" cy="22" r="10" fill="#EA580C" />
            <circle cx="50" cy="34" r="6" fill="#FEF08A" />

            {/* Green 4-leaf cluster */}
            <path d="M50 50 Q30 55 35 75 Q50 65 50 50 Z" fill="#15803D" />
            <path d="M50 50 Q70 55 65 75 Q50 65 50 50 Z" fill="#166534" />
            <path d="M50 50 Q35 70 50 90 Q55 70 50 50 Z" fill="#22C55E" />
            <path d="M50 50 Q65 70 50 90 Q45 70 50 50 Z" fill="#15803D" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight">
          KalaKriti
        </h1>
        <p className="text-[11px] font-extrabold tracking-widest text-emerald-700 uppercase mt-0.5">
          ARTISAN HERITAGE
        </p>
      </div>

      {/* Center Illustration — Warm Flat Vector Pottery Scene */}
      <div className="my-auto py-4 flex flex-col items-center text-center z-10 w-full">
        <div className="w-56 h-56 rounded-full bg-amber-100/80 border-4 border-white shadow-xl flex items-center justify-center p-2 relative">
          <ArtisanPotteryIllustration className="w-full h-full" />
          <div className="absolute -bottom-2 bg-emerald-800 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-emerald-600">
            <Sparkles size={12} className="text-amber-300" /> Preserving Indian Heritage
          </div>
        </div>

        {/* 3 Centered Tagline Lines */}
        <div className="mt-6 space-y-1 text-center font-extrabold text-stone-800 text-sm tracking-wide">
          <p className="text-emerald-900">Our Heritage</p>
          <p className="text-amber-700">Your Hands</p>
          <p className="text-emerald-800">A Brighter Tomorrow</p>
        </div>
      </div>

      {/* Bottom Pinned Button */}
      <div className="w-full pb-6 z-10">
        <button
          onClick={() => setCurrentStep('language')}
          className="w-full py-4 px-6 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white rounded-2xl font-bold text-base shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all"
        >
          <span>{t('get_started')}</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
