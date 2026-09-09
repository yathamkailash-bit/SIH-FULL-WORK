// Voice Service handling Speech Synthesis (TTS) & MediaRecorder Audio + Speech Recognition (STT)

const getApiKey = () => {
  return (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    (typeof window !== 'undefined' && window.GEMINI_API_KEY) ||
    ''
  );
};

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
    this.mediaRecorder = null;
    this.audioChunks = [];
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
    utterance.rate = 0.9; // clear pace for low literacy

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
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  isSupported() {
    return typeof window !== 'undefined' && (
      !!(window.SpeechRecognition || window.webkitSpeechRecognition) ||
      !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    );
  }

  /**
   * Fast, accurate audio recording via MediaRecorder with Gemini transcription fallback
   */
  async startAudioRecording(onResult, onError, onEnd) {
    if (!navigator.mediaDevices?.getUserMedia) {
      if (onError) onError('MediaRecorder not supported in this browser.');
      if (onEnd) onEnd();
      return { stop: () => {} };
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        
        try {
          // Convert audio blob to base64 and send to Gemini for multi-lingual transcription
          const apiKey = getApiKey();
          if (apiKey) {
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
              const base64Data = reader.result.split(',')[1];
              const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
              const body = {
                contents: [{
                  parts: [
                    { text: "Listen to this audio recording in an Indian language (Hindi/Telugu/Tamil/Kannada/Bengali/English) and transcribe the spoken words accurately. Return ONLY the transcribed text string." },
                    { inlineData: { mimeType: 'audio/webm', data: base64Data } }
                  ]
                }]
              };
              const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
              if (res.ok) {
                const json = await res.json();
                const transcript = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
                if (transcript && onResult) {
                  onResult(transcript, true);
                  if (onEnd) onEnd();
                  return;
                }
              }
            };
          }
        } catch (e) {
          console.warn('[KalaKriti] Audio transcription fallback to STT:', e.message);
        }
        if (onEnd) onEnd();
      };

      this.mediaRecorder.start();

      return {
        stop: () => {
          if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
          }
        }
      };
    } catch (err) {
      if (onError) onError(err.message || 'Microphone access denied');
      if (onEnd) onEnd();
      return { stop: () => {} };
    }
  }

  listen(langCode = 'en', onResult, onError, onEnd) {
    const SpeechRecognition = typeof window !== 'undefined' 
      ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
      : null;

    if (!SpeechRecognition) {
      return this.startAudioRecording(onResult, onError, onEnd);
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
        if (onError) onError(errorType);
      };

      recognition.onend = () => {
        if (onEnd) onEnd();
      };

      recognition.start();
      return recognition;
    } catch (err) {
      if (onError) onError(err);
      if (onEnd) onEnd();
      return { stop: () => {} };
    }
  }
}

export const voiceService = new VoiceService();
