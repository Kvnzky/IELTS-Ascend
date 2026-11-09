// Web Audio API and Speech Synthesis Service for IELTS Master Academy

class AudioService {
  private audioCtx: AudioContext | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private isPaused: boolean = false;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Play pleasant examination chime
  playChime(type: 'correct' | 'wrong' | 'bell' | 'start' | 'tick' = 'correct') {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      if (type === 'correct') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.5, now + 0.3); // C6

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(180, now + 0.15);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'bell') {
        // Exam start/transition bell
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(880, now);
        osc2.frequency.setValueAtTime(1760, now);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.2);
        osc2.stop(now + 1.2);
      } else if (type === 'tick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(900, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (e) {
      console.warn('AudioContext playback error (safe to ignore if user has not interacted yet):', e);
    }
  }

  // Get available speech synthesis voices
  getVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return resolve([]);
      }
      let voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        return resolve(voices);
      }
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        resolve(voices);
      };
      setTimeout(() => {
        resolve(window.speechSynthesis.getVoices());
      }, 500);
    });
  }

  // Select accent-appropriate voice
  async selectVoiceForAccent(accent: 'British' | 'Australian' | 'American' | 'International'): Promise<SpeechSynthesisVoice | null> {
    const voices = await this.getVoices();
    if (!voices || voices.length === 0) return null;

    let targetLocale = 'en-GB';
    if (accent === 'Australian') targetLocale = 'en-AU';
    if (accent === 'American') targetLocale = 'en-US';

    // Try exact match
    let matched = voices.find(v => v.lang.toLowerCase().startsWith(targetLocale.toLowerCase()));
    // Fallback to any English
    if (!matched) {
      matched = voices.find(v => v.lang.toLowerCase().startsWith('en'));
    }
    return matched || voices[0] || null;
  }

  // Speak text with accent, rate, callbacks
  async speak(
    text: string,
    options: {
      accent?: 'British' | 'Australian' | 'American' | 'International';
      rate?: number;
      pitch?: number;
      volume?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onBoundary?: (charIndex: number) => void;
      onError?: (err: any) => void;
    } = {}
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis not supported in this browser.');
      options.onEnd?.();
      return;
    }

    this.stop(); // Stop any active speech

    const voice = await this.selectVoiceForAccent(options.accent || 'British');

    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      options.onStart?.();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        options.onError?.(e);
      }
    };

    utterance.onboundary = (e) => {
      if (options.onBoundary) {
        options.onBoundary(e.charIndex);
      }
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.isSpeaking) {
      window.speechSynthesis.pause();
      this.isPaused = true;
    }
  }

  resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.isPaused) {
      window.speechSynthesis.resume();
      this.isPaused = false;
    }
  }

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
    }
  }

  getSpeakingStatus() {
    return {
      isSpeaking: this.isSpeaking,
      isPaused: this.isPaused,
    };
  }
}

export const audioService = new AudioService();
