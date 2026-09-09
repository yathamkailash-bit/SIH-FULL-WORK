import React, { useState } from 'react';
import { Volume2, Lightbulb, Check, Edit2, ArrowRight } from 'lucide-react';
import { calculateSuggestedPrice } from '../../services/priceEstimatorService';
import { STATE_LABOUR_RATES } from '../../data/stateLabourRates';
import { useVoice } from '../../context/VoiceContext';
import { useLanguage } from '../../context/LanguageContext';

export const PriceEstimatorView = ({ formData, onConfirmPrice, onBack }) => {
  const { speakPrompt } = useVoice();
  const { t } = useLanguage();

  const [selectedState, setSelectedState] = useState(formData.state || 'Andhra Pradesh');
  const [customPrice, setCustomPrice] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const estimate = calculateSuggestedPrice({
    materialCost: formData.materialCost || 250,
    workersCount: formData.workersCount || 1,
    workingDays: formData.workingDays || 1,
    state: selectedState,
    craftCategory: formData.craft || 'Wooden Toys / Kondapalli',
    customLabourRate: formData.labourCost || null
  });

  const finalPrice = isEditing && customPrice ? Number(customPrice) : estimate.recommendedPrice;

  const handleReadAloud = () => {
    speakPrompt(`Recommended price is ${finalPrice} Rupees. Cost breakdown: Material ${estimate.materialCost}, Labour ${estimate.labourCost}, logistics ${estimate.logisticsAndPlatformFee}.`);
  };

  const handleConfirm = () => {
    onConfirmPrice(finalPrice, estimate);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-[#FAF7F2] select-none">
      <div>
        <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          {t('suggested_price')}
        </h2>
        <p className="text-xs text-stone-500 font-medium mt-1">
          Based on your craft materials, working days, and {selectedState} labour rates.
        </p>

        {/* State Selector */}
        <div className="mt-4 flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs">
          <span className="font-bold text-amber-900">Artisan State:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-white border border-amber-300 font-bold text-amber-950 px-2 py-1 rounded-lg focus:outline-none"
          >
            {Object.keys(STATE_LABOUR_RATES).map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Recommended Price Highlight Box */}
        <div className="mt-5 bg-emerald-700 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden text-center">
          <div className="absolute top-3 right-3">
            <button
              onClick={handleReadAloud}
              className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-100 hover:bg-emerald-600 transition"
              title="Read price aloud"
            >
              <Volume2 size={18} className="animate-pulse" />
            </button>
          </div>

          <span className="inline-block px-3 py-1 bg-emerald-800 text-emerald-200 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
            {t('recommended')}
          </span>

          <div className="text-4xl font-extrabold tracking-tight">
            ₹{finalPrice}
          </div>

          <p className="text-xs text-emerald-200 font-medium mt-1">
            Suggested range: ₹{estimate.minPrice} – ₹{estimate.maxPrice}
          </p>
        </div>

        {/* Cost Breakdown Card */}
        <div className="mt-5 bg-white rounded-3xl p-5 border border-stone-200 shadow-md space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-2">
            {t('cost_breakdown')}
          </h3>

          <div className="flex justify-between text-xs font-semibold text-stone-700">
            <span>{t('material_cost')}</span>
            <span>₹{estimate.materialCost}</span>
          </div>

          <div className="flex justify-between text-xs font-semibold text-stone-700">
            <span>{t('labour_cost')} ({formData.workingDays || 1} days @ ₹{estimate.dailyLabourRate}/day)</span>
            <span>₹{estimate.labourCost}</span>
          </div>

          <div className="flex justify-between text-xs font-semibold text-stone-700">
            <span>{t('other_cost')}</span>
            <span>₹{estimate.logisticsAndPlatformFee}</span>
          </div>

          <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-extrabold text-stone-900">
            <span>{t('estimated_cost')}</span>
            <span>₹{estimate.estimatedCost}</span>
          </div>
        </div>

        {/* Lightbulb Tip Callout */}
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3 shadow-2xs">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
            <Lightbulb size={18} />
          </div>
          <p className="text-xs font-medium text-amber-900 leading-relaxed">
            "{estimate.tipText}"
          </p>
        </div>

        {/* Manual Price Edit Toggle */}
        {isEditing ? (
          <div className="mt-4 p-3 bg-white rounded-2xl border border-emerald-300">
            <label className="block text-xs font-bold text-stone-700 mb-1">Set Your Custom Price (₹)</label>
            <input
              type="number"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              placeholder={`Default ₹${estimate.recommendedPrice}`}
              className="w-full p-2 border border-stone-300 rounded-xl text-base font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
            />
          </div>
        ) : null}
      </div>

      {/* Actions */}
      <div className="pt-4 pb-2 space-y-2">
        <button
          onClick={handleConfirm}
          className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white rounded-2xl font-bold text-base shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition"
        >
          <Check size={20} />
          <span>{t('use_price')} ₹{finalPrice}</span>
        </button>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="w-full py-2.5 text-xs font-bold text-stone-600 hover:text-emerald-800 flex items-center justify-center gap-1 transition"
        >
          <Edit2 size={14} />
          <span>{isEditing ? "Use Suggested Price" : t('edit_price')}</span>
        </button>
      </div>
    </div>
  );
};
