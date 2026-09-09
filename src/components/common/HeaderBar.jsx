import React from 'react';
import { Volume2, VolumeX, Bell, ChevronLeft } from 'lucide-react';
import { useVoice } from '../../context/VoiceContext';
import { useAppData } from '../../context/AppDataContext';

export const HeaderBar = ({ title, showBack, onBack, onOpenNotifications }) => {
  const { isMuted, toggleMute } = useVoice();
  const { notifications } = useAppData();

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md px-4 py-3 border-b border-amber-900/5 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-2.5">
        {showBack ? (
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-2xs hover:bg-stone-50 active:scale-95 transition"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" fill="#15803D" stroke="#166534" />
                <path d="M12 6v12M6 12h12M8 8l8 8M8 16l8-8" stroke="#FAF7F2" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight tracking-tight text-emerald-950 flex items-center gap-1">
                KalaKriti
              </h1>
              <p className="text-[9px] font-semibold tracking-widest text-emerald-700 uppercase -mt-0.5">
                ARTISAN HERITAGE
              </p>
            </div>
          </div>
        )}

        {title && showBack && (
          <h2 className="text-base font-bold text-stone-800 truncate max-w-[190px]">
            {title}
          </h2>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleMute}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition shadow-2xs ${
            isMuted
              ? 'bg-stone-200 text-stone-500'
              : 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold'
          }`}
          title={isMuted ? 'Voice Muted (Tap to Unmute)' : 'Voice Enabled (Tap to Mute)'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="animate-pulse" />}
        </button>

        {onOpenNotifications && (
          <button
            onClick={onOpenNotifications}
            className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 relative shadow-2xs hover:bg-stone-50 transition"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-[#FAF7F2]">
                {unreadCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
