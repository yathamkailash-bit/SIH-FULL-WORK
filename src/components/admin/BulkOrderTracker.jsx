import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, Truck, MapPin, X } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

export const BulkOrderTracker = ({ onBack }) => {
  const { bulkOrder } = useAppData();
  const [showLogisticsModal, setShowLogisticsModal] = useState(false);

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#FAF7F2] p-4 select-none min-h-full relative">
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
          onClick={() => setShowLogisticsModal(true)}
          className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-base shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition"
        >
          <Truck size={20} />
          <span>Track Order Logistics</span>
        </button>
      </div>

      {/* LOGISTICS TRACKING MODAL */}
      {showLogisticsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom duration-300">
            <button
              onClick={() => setShowLogisticsModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Truck size={24} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-stone-900">
                  Bulk Order Logistics
                </h3>
                <span className="text-xs font-bold text-emerald-700 block">
                  Tracking ID: KK-BULK-2026-9842
                </span>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 mb-4 space-y-1.5 text-xs font-medium text-stone-700">
              <div className="flex items-center justify-between">
                <span className="text-stone-400 font-bold">Carrier:</span>
                <span className="font-extrabold text-stone-900">Delhivery Express (Artisan Route)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400 font-bold">Origin:</span>
                <span className="font-bold text-stone-800 flex items-center gap-1"><MapPin size={12} className="text-emerald-600" /> Vijayawada Craft Hub</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400 font-bold">Est. Dispatch:</span>
                <span className="font-bold text-amber-800">Sept 14, 2026</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3 pl-2 border-l-2 border-emerald-600/30 text-xs font-bold">
              <div className="relative pl-4">
                <div className="absolute -left-[17px] top-0.5 w-3 h-3 rounded-full bg-emerald-600"></div>
                <div className="text-stone-900 font-extrabold">Order Confirmed & Allocated</div>
                <div className="text-[10px] text-stone-400 font-medium">Sept 6, 2026 • 10:30 AM</div>
              </div>
              <div className="relative pl-4">
                <div className="absolute -left-[17px] top-0.5 w-3 h-3 rounded-full bg-emerald-600 animate-ping"></div>
                <div className="text-emerald-800 font-extrabold">Artisan Production (380/500 pcs)</div>
                <div className="text-[10px] text-stone-500 font-medium">In progress across 3 artisan hubs</div>
              </div>
              <div className="relative pl-4">
                <div className="absolute -left-[17px] top-0.5 w-3 h-3 rounded-full bg-stone-300"></div>
                <div className="text-stone-400 font-semibold">Quality Inspection & Packaging</div>
                <div className="text-[10px] text-stone-400 font-medium">Scheduled upon completion</div>
              </div>
              <div className="relative pl-4">
                <div className="absolute -left-[17px] top-0.5 w-3 h-3 rounded-full bg-stone-300"></div>
                <div className="text-stone-400 font-semibold">Hub Dispatch & Final Delivery</div>
                <div className="text-[10px] text-stone-400 font-medium">Scheduled</div>
              </div>
            </div>

            <button
              onClick={() => setShowLogisticsModal(false)}
              className="w-full mt-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs shadow-md transition"
            >
              Close Tracker
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

