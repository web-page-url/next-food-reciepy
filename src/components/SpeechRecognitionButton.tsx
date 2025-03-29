import { useState, useEffect } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface SpeechRecognitionButtonProps {
  onTranscript: (transcript: string) => void;
}

const SpeechRecognitionButton = ({ onTranscript }: SpeechRecognitionButtonProps) => {
  const [hasRecognition, setHasRecognition] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if the browser supports speech recognition
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setHasRecognition(true);
      } else {
        setError("Your browser doesn't support voice input");
      }
    } catch (err) {
      console.error("Speech recognition initialization error:", err);
      setError("Failed to initialize voice input");
    }
  }, []);

  const toggleListening = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setError("Your browser doesn't support voice input");
        return;
      }

      if (!listening) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          try {
            const transcript = event.results[0][0].transcript;
            onTranscript(transcript);
          } catch (err) {
            console.error("Error processing speech result:", err);
            setError("Couldn't process what you said");
          }
        };
        
        recognition.onend = () => {
          setListening(false);
        };
        
        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setError(`Speech error: ${event.error}`);
          setListening(false);
        };
        
        // Start listening
        recognition.start();
        setListening(true);
        setError(null);
      } else {
        // If already listening, stop it
        const recognition = new SpeechRecognition();
        recognition.stop();
        setListening(false);
      }
    } catch (err) {
      console.error("Error toggling speech recognition:", err);
      setError("Failed to start voice input");
      setListening(false);
    }
  };

  if (!hasRecognition) return null;

  return (
    <div className="relative">
      <motion.button
        onClick={toggleListening}
        className={`p-4 rounded-xl shadow-md transition-colors flex items-center justify-center ${
          listening 
            ? 'bg-red-600 text-white' 
            : 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200'
        }`}
        aria-label={listening ? "Stop listening" : "Start voice input"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={listening ? { boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0.1)', '0 0 0 15px rgba(239, 68, 68, 0)'] } : {}}
        transition={listening ? { repeat: Infinity, duration: 1.5 } : {}}
      >
        <FaMicrophone className={listening ? 'animate-pulse' : ''} />
      </motion.button>
      
      <AnimatePresence>
        {listening && (
          <motion.div 
            className="absolute top-full mt-2 bg-white px-3 py-1 rounded-full shadow-md text-red-600 text-xs font-medium whitespace-nowrap border border-red-100"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            Listening... speak now
          </motion.div>
        )}
        
        {error && !listening && (
          <motion.div 
            className="absolute top-full mt-2 bg-white px-3 py-1 rounded-full shadow-md text-red-600 text-xs font-medium whitespace-nowrap border border-red-100"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpeechRecognitionButton; 