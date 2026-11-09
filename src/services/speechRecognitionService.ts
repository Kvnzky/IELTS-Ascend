// Speech Recognition and Audio Recording Service for IELTS Speaking Academy

export interface SpeechRecognitionResultState {
  transcript: string;
  isListening: boolean;
  isRecording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
  durationSeconds: number;
  error: string | null;
}

class SpeechRecognitionService {
  private recognition: any = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private timerInterval: any = null;
  private durationSeconds: number = 0;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      } catch (err) {
        console.warn('SpeechRecognition initialization error:', err);
      }
    }
  }

  isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    const hasMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    return hasMedia;
  }

  hasSpeechToText(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  async startRecording(
    onTranscriptUpdate: (transcript: string, isFinal: boolean) => void,
    onTimeUpdate: (seconds: number) => void,
    onError: (errMsg: string) => void
  ): Promise<boolean> {
    this.recordedChunks = [];
    this.durationSeconds = 0;

    try {
      // 1. Get microphone stream
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 2. Setup MediaRecorder for audio capture & playback
      try {
        this.mediaRecorder = new MediaRecorder(this.stream);
        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            this.recordedChunks.push(e.data);
          }
        };
        this.mediaRecorder.start(250);
      } catch (mediaRecErr) {
        console.warn('MediaRecorder not available or failed:', mediaRecErr);
      }

      // 3. Setup Speech-to-Text Recognition if available
      if (this.recognition) {
        let accumulatedFinal = '';
        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              accumulatedFinal += event.results[i][0].transcript + ' ';
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          const fullText = (accumulatedFinal + interimTranscript).trim();
          onTranscriptUpdate(fullText, false);
        };

        this.recognition.onerror = (event: any) => {
          if (event.error !== 'no-speech') {
            console.warn('SpeechRecognition error:', event.error);
          }
        };

        try {
          this.recognition.start();
        } catch (e) {
          // Already running or restart needed
        }
      }

      // 4. Start duration timer
      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        this.durationSeconds += 1;
        onTimeUpdate(this.durationSeconds);
      }, 1000);

      return true;
    } catch (err: any) {
      console.error('Microphone access denied or error:', err);
      onError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Microphone permission was denied. Please allow microphone access or use manual input.'
          : 'Could not access audio device: ' + (err.message || 'Unknown error')
      );
      return false;
    }
  }

  stopRecording(): Promise<{ audioBlob: Blob | null; audioUrl: string | null; duration: number }> {
    clearInterval(this.timerInterval);

    return new Promise((resolve) => {
      // Stop recognition
      if (this.recognition) {
        try {
          this.recognition.stop();
        } catch (e) {}
      }

      const finish = () => {
        let blob: Blob | null = null;
        let url: string | null = null;

        if (this.recordedChunks.length > 0) {
          blob = new Blob(this.recordedChunks, { type: 'audio/webm;codecs=opus' });
          try {
            url = URL.createObjectURL(blob);
          } catch (e) {
            console.warn('Could not create object URL for audio blob', e);
          }
        }

        // Stop all media stream tracks
        if (this.stream) {
          this.stream.getTracks().forEach((track) => track.stop());
          this.stream = null;
        }

        resolve({
          audioBlob: blob,
          audioUrl: url,
          duration: this.durationSeconds,
        });
      };

      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.onstop = () => {
          finish();
        };
        try {
          this.mediaRecorder.stop();
        } catch (e) {
          finish();
        }
      } else {
        finish();
      }
    });
  }

  cleanup() {
    clearInterval(this.timerInterval);
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
