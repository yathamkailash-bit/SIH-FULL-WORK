import React from 'react';
import { Volume2, ChevronLeft, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';

export const LanguageSelection = () => {
  const { setCurrentStep } = useAuth();
  const { language, setLanguage, LANGUAGES, t } = useLanguage();
  const { speakPrompt } = useVoice();

  const handleSelectLanguage = (langCode) => {
    setLanguage(langCode);
    const selectedObj = LANGUAGES.find(l => l.code === langCode);
    speakPrompt(`You selected ${selectedObj?.english || langCode}`);
    setTimeout(() => {
      setCurrentStep('role');
    }, 400);
  };

  const handleListenAll = () => {
    const allNames = LANGUAGES.map(l => l.english).join(', ');
    speakPrompt(`Available languages: ${allNames}`);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-[#FAF7F2] select-none">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentStep('splash')}
            className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-2xs hover:bg-stone-50"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          {t('choose_language')}
        </h2>
        <p className="text-xs text-stone-500 font-medium mt-1">
          {t('choose_language_sub')}
        </p>

        {/* 2-Column Grid of Language Cards */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between h-24 relative shadow-2xs ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/40'
                }`}
              >
                <div>
                  <span className="text-xl font-bold text-stone-900 block">
                    {lang.script}
                  </span>
                  <span className="text-xs text-stone-500 font-medium block mt-0.5">
                    {lang.english}
                  </span>
                </div>

                {isSelected && (
                  <span className="absolute top-3 right-3 w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Pinned Audio Button */}
      <div className="pt-4 pb-2">
        <button
          onClick={handleListenAll}
          className="w-full py-3.5 px-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-2xl font-bold text-sm border border-emerald-300 flex items-center justify-center gap-2 shadow-2xs active:scale-[0.99] transition"
        >
          <Volume2 size={18} />
          <span>{t('listen_all')}</span>
        </button>
      </div>
    </div>
  );
};
