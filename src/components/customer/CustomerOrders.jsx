import React from 'react';
import { Package } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

export const CustomerOrders = () => {
  const { customerOrders } = useAppData();

  return (
    <div className="flex-1 flex flex-col bg-[#FAF7F2] p-4 select-none">
      <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight mb-4 flex items-center gap-2">
        <Package size={24} className="text-emerald-700" />
        <span>My Orders</span>
      </h2>

      <div className="space-y-4">
        {customerOrders.map((ord) => (
          <div
            key={ord.id}
            className="bg-white rounded-3xl p-5 border border-stone-200 shadow-md space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-xs font-extrabold text-stone-900">{ord.orderNumber}</span>
                <span className="text-[10px] text-stone-400 font-medium block">Placed on {ord.date}</span>
              </div>
              <span className="text-sm font-extrabold text-emerald-800">
                ₹{ord.totalAmount.toLocaleString()}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-2">
              {ord.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-stone-100" />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{item.name}</h4>
                    <span className="text-[10px] font-semibold text-stone-500">By {item.artisanName}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Delivery Tracker */}
            <div className="pt-3 border-t border-stone-100">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block mb-3">
                Live Delivery Tracker
              </span>

              {(() => {
                const steps = ord.trackingSteps || [];
                const doneCount = steps.filter(s => s.done || s.active).length;
                const totalSteps = steps.length;
                const progressPct = totalSteps > 1 ? Math.max(0, Math.min(100, ((doneCount - 1) / (totalSteps - 1)) * 100)) : 0;

                return (
                  <div className="flex items-center justify-between relative px-2">
                    <div className="absolute top-3 left-4 right-4 h-1 bg-stone-200 -z-0"></div>
                    <div
                      className="absolute top-3 left-4 h-1 bg-emerald-600 -z-0 transition-all duration-500"
                      style={{ width: `calc((100% - 32px) * ${progressPct / 100})` }}
                    ></div>

                    {steps.map((step, sIdx) => {
                      const isDone = step.done || step.active;
                      const isActive = step.active;

                      return (
                        <div key={sIdx} className="flex flex-col items-center z-10">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                              isActive
                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 scale-110'
                                : isDone
                                ? 'bg-emerald-700 text-white'
                                : 'bg-stone-200 text-stone-500'
                            }`}
                          >
                            {isDone ? '✓' : sIdx + 1}
                          </div>
                          <span className={`text-[9px] font-bold mt-1 max-w-[50px] text-center ${
                            isActive ? 'text-emerald-800' : 'text-stone-500'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
