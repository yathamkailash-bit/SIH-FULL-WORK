import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import splashIllustration from '../../assets/splash-illustration.png';

export const Splash = () => {
  const { setCurrentStep } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-5 bg-[#FAF7F2] relative overflow-hidden select-none min-h-full">
      {/* Top Branding Section */}
      <div className="pt-4 text-center flex flex-col items-center z-10">
        {/* Flower + Leaf Logo Icon */}
        <div className="mb-2">
          <svg width="72" height="72" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Top Orange Flower Petals */}
            <path d="M50 12 C55 2 68 8 64 22 C78 20 80 34 68 40 C76 52 64 60 52 50 C40 60 28 52 36 40 C24 34 26 20 40 22 C36 8 49 2 50 12 Z" fill="#F97316" />
            <circle cx="50" cy="30" r="7" fill="#FACC15" />
            {/* Bottom 4 Green Leaves Cluster */}
            <path d="M50 48 Q32 40 22 55 Q35 68 50 48 Z" fill="#15803D" />
            <path d="M50 48 Q68 40 78 55 Q65 68 50 48 Z" fill="#166534" />
            <path d="M50 48 Q38 65 42 85 Q56 75 50 48 Z" fill="#22C55E" />
            <path d="M50 48 Q62 65 58 85 Q44 75 50 48 Z" fill="#15803D" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-[#0D472B] tracking-tight font-serif">
          KalaKriti
        </h1>
        <p className="text-[11px] font-bold tracking-[0.25em] text-stone-800 uppercase mt-0.5">
          ARTISAN HERITAGE
        </p>

        {/* 3 Tagline Lines */}
        <div className="mt-4 space-y-0.5 text-center font-bold text-[#3B4E68] text-sm tracking-wide">
          <p>Our Heritage</p>
          <p>Your Hands</p>
          <p>A Brighter Tomorrow</p>
        </div>
      </div>

      {/* Center Static Image Illustration */}
      <div className="my-auto py-2 flex items-center justify-center z-10 w-full">
        <img
          src={splashIllustration}
          alt="Artisan Heritage Illustration"
          className="w-full max-w-[340px] h-auto object-contain rounded-2xl shadow-xs"
        />
      </div>

      {/* Bottom Pinned Green Pill Button */}
      <div className="w-full pb-4 z-10">
        <button
          onClick={() => setCurrentStep('language')}
          className="w-full py-4 px-6 bg-[#047857] hover:bg-[#065F46] active:scale-[0.99] text-white rounded-full font-bold text-base shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all"
        >
          <span>{t('get_started') || 'Get Started'}</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

