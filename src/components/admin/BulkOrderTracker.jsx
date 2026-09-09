import React from 'react';
import { ArrowLeft, Package, CheckCircle2, Clock } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

export const BulkOrderTracker = ({ onBack }) => {
  const { bulkOrder } = useAppData();

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#FAF7F2] p-4 select-none">
      <div>
        <div className="flex items-center gap-3 mb-4">
          {onBack && (
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-2xs hover:bg-stone-50"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div>
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
              {bulkOrder.title}
            </h2>
            <span className="inline-block text-[10px] font-extrabold px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full mt-0.5">
              {bulkOrder.status}
            </span>
          </div>
        </div>

        {/* Contributing Artisans Progress List */}
        <div className="space-y-3 mt-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
            Contributing Artisans Breakdown
          </h3>

          {bulkOrder.artisans.map((artisan) => (
            <div
              key={artisan.id}
              className="bg-white rounded-3xl p-3.5 border border-stone-200 shadow-md flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={artisan.avatar}
                  alt={artisan.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600 shrink-0"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-stone-900">
                    {artisan.name}
                  </h4>
                  <span className="text-xs font-semibold text-stone-500">
                    {artisan.completed} / {artisan.assigned} pieces
                  </span>
                </div>
              </div>

              <span
                className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                  artisan.completed === artisan.assigned
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {artisan.completed === artisan.assigned ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                {artisan.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Footer Card */}
      <div className="pt-4 pb-2 space-y-3">
        <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-md space-y-2">
          <div className="flex justify-between text-xs font-extrabold text-stone-800">
            <span>Overall Order Completion</span>
            <span className="text-emerald-800 font-extrabold">
              Total: {bulkOrder.completedQuantity}/{bulkOrder.totalQuantity} — {bulkOrder.progressPercent}%
            </span>
          </div>

          {/* Production Progress Bar */}
          <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-700"
              style={{ width: `${bulkOrder.progressPercent}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={() => alert(`Bulk order #${bulkOrder.id} active production tracker.`)}
          className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-base shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition"
        >
          <Package size={20} />
          <span>Track Order Logistics</span>
        </button>
      </div>
    </div>
  );
};
