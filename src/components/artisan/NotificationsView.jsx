import React from 'react';
import { ArrowLeft, ChevronRight, Package, Sparkles } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useLanguage } from '../../context/LanguageContext';

export const NotificationsView = ({ onBack, onNavigateBulkTracker }) => {
  const { notifications } = useAppData();
  const { t } = useLanguage();

  return (
    <div className="flex-1 flex flex-col bg-[#FAF7F2] p-4 select-none min-h-full">
      <div className="flex items-center gap-3 mb-4">
        {onBack && (
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-2xs hover:bg-stone-50"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
          {t('notifications') || 'Notifications'}
        </h2>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => {
          const isBulk = notif.type === 'bulk_order';

          return (
            <div
              key={notif.id}
              onClick={() => {
                if (isBulk && onNavigateBulkTracker) {
                  onNavigateBulkTracker();
                }
              }}
              className={`p-4 rounded-3xl bg-white border transition-all shadow-md flex items-start gap-3.5 cursor-pointer ${
                notif.unread ? 'border-emerald-600/40 ring-2 ring-emerald-500/10' : 'border-stone-200'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  isBulk ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {isBulk ? <Package size={20} /> : <Sparkles size={20} />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-stone-900 truncate">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-stone-400 font-medium">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="text-xs font-semibold text-stone-600 mt-1 leading-relaxed">
                  {notif.message}
                </p>

                {isBulk && (
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl">
                    <span>{t('track_order')}</span>
                    <ChevronRight size={14} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
