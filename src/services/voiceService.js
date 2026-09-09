// Voice Service handling Speech Synthesis (TTS) & Speech Recognition (STT)

const LANG_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  mr: 'mr-IN',
  or: 'or-IN'
};

class VoiceService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.isMuted = false;
    this.currentUtterance = null;
  }

  setMute(muted) {
    this.isMuted = muted;
    if (muted && this.synth) {
      this.synth.cancel();
    }
  }

  speak(text, langCode = 'en', onEndCallback = null) {
    if (this.isMuted || !this.synth || !text) return;

    this.synth.cancel(); // stop previous speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_MAP[langCode] || 'en-IN';
    utterance.rate = 0.9; // clear, comfortable pace for low literacy

    if (onEndCallback) {
      utterance.onend = onEndCallback;
    }

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  isSupported() {
    return typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  listen(langCode = 'en', onResult, onError, onEnd) {
    const SpeechRecognition = typeof window !== 'undefined' 
      ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
      : null;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition API not supported in this browser.");
      if (onError) onError('not_supported');
      if (onEnd) onEnd();
      return { stop: () => {} };
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = LANG_MAP[langCode] || 'en-IN';

      recognition.onresult = (event) => {
        let transcript = '';
        let isFinal = false;
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }
        if (onResult) onResult(transcript, isFinal);
      };

      recognition.onerror = (event) => {
        const errorType = event.error || event;
        console.warn("Speech recognition error:", errorType);
        if (onError) onError(errorType);
      };

      recognition.onend = () => {
        if (onEnd) onEnd();
      };

      recognition.start();
      return recognition;
    } catch (err) {
      console.warn("Speech recognition exception:", err);
      if (onError) onError(err);
      if (onEnd) onEnd();
      return { stop: () => {} };
    }
  }
}

export const voiceService = new VoiceService();
