import React, { useEffect, useCallback, useState } from 'react';
import { Mic, X, Volume2, AlertCircle } from 'lucide-react';
import { useVoice } from '../../context/VoiceContext';
import { useLanguage } from '../../context/LanguageContext';

export const VoiceAssistantModal = ({ isOpen, onClose, onActionTrigger }) => {
  const { isListening, speechText, startListening, speakPrompt, stopVoice, voiceError, isVoiceSupported } = useVoice();
  const { t } = useLanguage();
  const [statusMessage, setStatusMessage] = useState("Tap mic to speak");

  const processCommand = useCallback((text) => {
    const lower = text.toLowerCase();
    setStatusMessage(`Recognized: "${text}"`);

    if (lower.includes('add') || lower.includes('product') || lower.includes('photo') || lower.includes('सामान') || lower.includes('చేయి')) {
      speakPrompt("Opening Add Product");
      setTimeout(() => {
        onClose();
        onActionTrigger('add_product');
      }, 1200);
    } else if (lower.includes('order') || lower.includes('ऑर्डर') || lower.includes('ఆర్డర్')) {
      speakPrompt("Showing your orders");
      setTimeout(() => {
        onClose();
        onActionTrigger('view_orders');
      }, 1200);
    } else if (lower.includes('my product') || lower.includes('inventory') || lower.includes('सामग्री')) {
      speakPrompt("Showing your products");
      setTimeout(() => {
        onClose();
        onActionTrigger('view_products');
      }, 1200);
    } else {
      speakPrompt("Command received. Opening Add Product.");
      setTimeout(() => {
        onClose();
        onActionTrigger('add_product');
      }, 1500);
    }
  }, [speakPrompt, onClose, onActionTrigger]);

  const handleStartMic = useCallback(() => {
    if (!isVoiceSupported) return;
    setStatusMessage("Listening...");
    startListening((finalTranscript) => {
      processCommand(finalTranscript);
    });
  }, [isVoiceSupported, startListening, processCommand]);

  useEffect(() => {
    if (isOpen) {
      if (!isVoiceSupported) {
        setStatusMessage("Voice recognition not supported in this browser");
        return;
      }
      speakPrompt("I am listening. Speak your command.", () => {
        handleStartMic();
      });
    } else {
      stopVoice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl relative animate-in fade-in slide-in-from-bottom duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200"
        >
          <X size={18} />
        </button>

        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mb-3">
          <Volume2 size={24} className="animate-bounce" />
        </div>

        <h3 className="text-xl font-extrabold text-stone-900">
          {t('speak_app')}
        </h3>
        
        <p className={`text-xs font-semibold mt-1 ${voiceError || !isVoiceSupported ? 'text-amber-700' : 'text-emerald-700'}`}>
          {voiceError || statusMessage}
        </p>

        {!isVoiceSupported && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-medium flex items-center gap-2 text-left">
            <AlertCircle size={18} className="shrink-0 text-amber-600" />
            <span>Voice commands aren&apos;t supported in this browser — try Chrome or Edge.</span>
          </div>
        )}

        {voiceError && isVoiceSupported && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 font-medium flex items-center gap-2 text-left">
            <AlertCircle size={18} className="shrink-0 text-red-600" />
            <span>{voiceError}</span>
          </div>
        )}

        <div className="my-6 relative flex items-center justify-center">
          <button
            onClick={handleStartMic}
            disabled={!isVoiceSupported}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all ${
              !isVoiceSupported
                ? 'bg-stone-300 cursor-not-allowed'
                : isListening
                ? 'bg-emerald-600 mic-pulse scale-110'
                : 'bg-emerald-700 hover:bg-emerald-800'
            }`}
          >
            <Mic size={42} />
          </button>
        </div>

        {speechText && (
          <div className="p-3 bg-stone-100 rounded-xl text-xs font-medium text-stone-800 w-full mb-4">
            &ldquo;{speechText}&rdquo;
          </div>
        )}

        <p className="text-[11px] text-stone-400 font-medium">
          Say: &quot;Add wooden toy&quot;, &quot;Show my orders&quot;, or &quot;View products&quot;
        </p>
      </div>
    </div>
  );
};
