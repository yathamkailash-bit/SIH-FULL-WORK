import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';

export const RoleSelection = () => {
  const { setCurrentStep, selectRole } = useAuth();
  const { t } = useLanguage();
  const { speakPrompt } = useVoice();

  useEffect(() => {
    // AI speaks the header question ONCE in the selected language when this screen appears
    speakPrompt(t('who_are_you'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoleClick = (roleType) => {
    selectRole(roleType);
    setCurrentStep('auth');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-[#FAF7F2] select-none">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentStep('language')}
            className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-2xs hover:bg-stone-50"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          {t('who_are_you')}
        </h2>
        <p className="text-xs text-stone-500 font-medium mt-1">
          {t('tap_role')}
        </p>

        {/* Large Stacked Role Cards */}
        <div className="flex flex-col gap-4 mt-6">
          {/* Artisan Role Card */}
          <button
            onClick={() => handleRoleClick('artisan')}
            className="p-5 rounded-3xl bg-white border-2 border-emerald-600/30 hover:border-emerald-600 shadow-md text-left flex items-center justify-between group active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                👩‍🌾🏽
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition">
                  {t('artisan_title')}
                </h3>
                <p className="text-xs font-semibold text-stone-500 mt-0.5">
                  {t('artisan_desc')}
                </p>
              </div>
            </div>
            <ChevronRight size={22} className="text-emerald-700 group-hover:translate-x-1 transition" />
          </button>

          {/* Customer Role Card */}
          <button
            onClick={() => handleRoleClick('customer')}
            className="p-5 rounded-3xl bg-white border-2 border-stone-200 hover:border-emerald-600 shadow-md text-left flex items-center justify-between group active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                👨‍💼
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition">
                  {t('customer_title')}
                </h3>
                <p className="text-xs font-semibold text-stone-500 mt-0.5">
                  {t('customer_desc')}
                </p>
              </div>
            </div>
            <ChevronRight size={22} className="text-stone-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </div>

      {/* Discreet Admin Entry Link */}
      <div className="pt-6 pb-2 text-center">
        <button
          onClick={() => handleRoleClick('admin')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-stone-600 transition"
        >
          <ShieldCheck size={14} />
          <span>{t('admin_title')}</span>
        </button>
      </div>
    </div>
  );
};
