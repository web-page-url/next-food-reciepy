import { useEffect, useState } from 'react';

// Default empty state that will be returned on the server
const defaultSpeechRecognitionState = {
  transcript: '',
  listening: false,
  browserSupportsSpeechRecognition: false,
  isMicrophoneAvailable: false,
  resetTranscript: () => {},
  browserSupportsContinuousListening: false,
};

// Client-only speech recognition hook
export const useClientSpeechRecognition = () => {
  const [state, setState] = useState(defaultSpeechRecognitionState);
  
  useEffect(() => {
    // Only import the speech recognition library on the client
    const importSpeechRecognition = async () => {
      try {
        const { useSpeechRecognition } = await import('react-speech-recognition');
        const speechRecognitionState = useSpeechRecognition();
        setState(speechRecognitionState);
      } catch (error) {
        console.error('Failed to load speech recognition:', error);
      }
    };
    
    importSpeechRecognition();
  }, []);
  
  return state;
}; 