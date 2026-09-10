import React, { createContext, useContext, useState, useEffect } from 'react';
import { voiceService } from '../services/voiceService';
import { useLanguage } from './LanguageContext';

const VoiceContext = createContext();

export const VoiceProvider = ({ children }) => {
  const { language } = useLanguage();
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('kalakriti_muted') === 'true';
  });
  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [voiceError, setVoiceError] = useState(null);
  const [isVoiceSupported] = useState(() => voiceService.isSupported());

  useEffect(() => {
    localStorage.setItem('kalakriti_muted', isMuted);
    voiceService.setMute(isMuted);
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const speakPrompt = (text, onEnd) => {
    if (!isMuted && text) {
      let called = false;
      const safeOnEnd = () => {
        if (!called) {
          called = true;
          if (onEnd) onEnd();
        }
      };

      // 4.5s safety timeout: Chrome's speechSynthesis.onend often fails to fire.
      const timer = setTimeout(safeOnEnd, 4500);

      voiceService.speak(text, language, () => {
        clearTimeout(timer);
        safeOnEnd();
      });
    } else if (onEnd) {
      // still advance the flow even when muted
      onEnd();
    }
  };

  const stopVoice = () => {
    voiceService.stop();
  };

  const startListening = (onFinalResult, onErrorCallback) => {
    setVoiceError(null);

    if (!isVoiceSupported) {
      const unsupportedMsg = "Voice commands aren't supported in this browser — try Chrome or Edge.";
      setVoiceError(unsupportedMsg);
      if (onErrorCallback) onErrorCallback(unsupportedMsg);
      return { stop: () => {} };
    }

    console.log('[KalaKriti] 🎙️ Starting voice recognition listening...');

    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          console.log('[KalaKriti] ✅ Microphone access granted');
          stream.getTracks().forEach(t => t.stop());
        })
        .catch((err) => {
          console.warn('[KalaKriti] ❌ Microphone permission denied/failed:', err);
          const permError = "Microphone permission denied. Please allow microphone access in browser settings.";
          setVoiceError(permError);
          if (onErrorCallback) onErrorCallback(permError);
        });
    }

    setIsListening(true);
    setSpeechText('');

    return voiceService.listen(
      language,
      (text, isFinal) => {
        setSpeechText(text);
        if (isFinal && onFinalResult) {
          onFinalResult(text);
        }
      },
      (err) => {
        console.error("Speech recognition error:", err);
        setIsListening(false);
        let readableError = "Couldn't hear you — check microphone permissions and try again.";
        if (err === 'not-allowed' || err === 'permission-denied') {
          readableError = "Microphone permission denied. Please allow microphone access in browser settings.";
        } else if (err === 'no-speech') {
          readableError = "No speech detected. Please tap mic and try again.";
        } else if (err === 'not_supported') {
          readableError = "Voice commands aren't supported in this browser — try Chrome or Edge.";
        } else if (typeof err === 'string') {
          readableError = `Speech error: ${err}`;
        }
        setVoiceError(readableError);
        if (onErrorCallback) onErrorCallback(readableError);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  return (
    <VoiceContext.Provider
      value={{
        isMuted,
        toggleMute,
        speakPrompt,
        stopVoice,
        isListening,
        setIsListening,
        speechText,
        startListening,
        isVoiceSupported,
        voiceError,
        setVoiceError
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useVoice = () => useContext(VoiceContext);
