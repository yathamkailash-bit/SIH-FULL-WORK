import React, { useEffect } from 'react';
import { Volume2, Users, Package, Calendar, Check, X } from 'lucide-react';
import { useVoice } from '../../context/VoiceContext';
import { useLanguage } from '../../context/LanguageContext';

export const BigOrderAlertModal = ({ isOpen, onClose, onAccept }) => {
  const { speakPrompt } = useVoice();
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      speakPrompt("You have a new big order. 500 wooden toys required.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-300 border-2 border-emerald-600/30">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-stone-900">
              {t('new_big_order')}
            </h3>
            <span className="px-2.5 py-0.5 bg-orange-600 text-white text-[10px] font-extrabold rounded-full animate-pulse uppercase tracking-wider">
              NEW
            </span>
          </div>

          <button
            onClick={() => speakPrompt("Order: 500 wooden toys required, your share 100 pieces at 300 rupees per piece.")}
            className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center hover:bg-emerald-200"
          >
            <Volume2 size={16} />
          </button>
        </div>

        {/* Description */}
        <div className="flex items-start gap-3.5 my-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 shadow-sm">
            <Users size={24} />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-stone-900">
              500 Wooden Toys Required
            </h4>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              A customer wants 500 wooden toys for an upcoming cultural exhibition.
            </p>
          </div>
        </div>

        {/* Possible share highlight */}
        <div className="my-4 bg-emerald-700 text-white rounded-2xl p-4 text-center shadow-lg">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 block">
            {t('possible_share')}
          </span>
          <div className="text-2xl font-extrabold mt-0.5">
            100 pieces
          </div>
        </div>

        {/* Info Rows */}
        <div className="space-y-2 text-xs font-semibold text-stone-700 bg-stone-50 p-3.5 rounded-2xl border border-stone-200 mb-5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-stone-500"><Package size={16} /> Rate per piece:</span>
            <span className="font-extrabold text-emerald-800 text-sm">₹300 / piece</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-stone-200">
            <span className="flex items-center gap-1.5 text-stone-500"><Calendar size={16} /> Delivery timeline:</span>
            <span className="font-bold text-stone-900">20 days</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={onAccept}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition"
          >
            <Check size={18} />
            <span>{t('accept')} Share (100 pieces)</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-white border border-stone-300 text-stone-600 hover:bg-stone-50 rounded-2xl font-bold text-xs flex items-center justify-center gap-1 transition"
          >
            <X size={16} />
            <span>{t('not_now')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
