import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Eye, PlusCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';

export const ProductListedSuccess = ({ product, onViewProduct, onAddAnother }) => {
  const { t } = useLanguage();
  const { speakPrompt } = useVoice();

  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (_e) {
      // ignore confetti failures
    }

    speakPrompt("Congratulations! Your product is now live on the marketplace.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-[#FAF7F2] select-none text-center">
      <div className="my-auto py-4 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 shadow-md">
          <CheckCircle2 size={40} />
        </div>

        <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight mt-2">
          {t('your_product_ready')}
        </h2>
        <p className="text-xs text-stone-500 font-medium mt-1.5 max-w-xs leading-relaxed">
          {t('now_live')}
        </p>

        {product?.image && (
          <div className="mt-5 w-44 h-44 rounded-3xl overflow-hidden border-4 border-emerald-500/30 shadow-xl bg-white">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
        )}

        {product?.name && (
          <div className="mt-3 space-y-0.5">
            <h3 className="text-base font-extrabold text-stone-900">{product.name}</h3>
            <p className="text-xs font-bold text-emerald-700">₹{product.price}</p>
          </div>
        )}
      </div>

      <div className="pt-4 pb-2 space-y-2">
        <button
          onClick={onViewProduct}
          className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-base shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition"
        >
          <Eye size={20} />
          <span>{t('view_product')}</span>
        </button>

        <button
          onClick={onAddAnother}
          className="w-full py-3 text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center justify-center gap-1.5 transition"
        >
          <PlusCircle size={16} />
          <span>{t('add_another')}</span>
        </button>
      </div>
    </div>
  );
};
