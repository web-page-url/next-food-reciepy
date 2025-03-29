declare module 'react-speech-recognition' {
  interface SpeechRecognitionOptions {
    commands?: Array<{
      command: string | RegExp;
      callback: (command: string) => void;
    }>;
    continuous?: boolean;
    language?: string;
    interimResults?: boolean;
  }

  interface SpeechRecognitionState {
    transcript: string;
    listening: boolean;
    browserSupportsSpeechRecognition: boolean;
    isMicrophoneAvailable: boolean;
    resetTranscript: () => void;
    browserSupportsContinuousListening: boolean;
  }

  export function useSpeechRecognition(options?: SpeechRecognitionOptions): SpeechRecognitionState;
} 