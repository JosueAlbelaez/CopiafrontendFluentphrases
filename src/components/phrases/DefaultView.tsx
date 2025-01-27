import { useState } from 'react';
import { Clock, PlayCircle } from 'lucide-react';
import VoiceRecorder from '../VoiceRecorder';

interface Phrase {
  _id: string;
  targetText: string;
  translatedText: string;
  category: string;
  language: string;
}

interface DefaultViewProps {
  phrases: Phrase[];
  incrementCount: () => void;
  isDarkMode: boolean;
}

export const DefaultView = ({ phrases, incrementCount, isDarkMode }: DefaultViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resetRecorder, setResetRecorder] = useState(false);

  if (!phrases || phrases.length === 0) {
    return (
      <div className="text-center p-8">
        <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          No hay frases disponibles en esta categoría.
        </p>
      </div>
    );
  }

  const currentPhrase = phrases[currentIndex];

  const handleNext = () => {
    incrementCount();
    setCurrentIndex((prev) => (prev + 1) % phrases.length);
    setResetRecorder(!resetRecorder);
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => prev === 0 ? phrases.length - 1 : prev - 1);
    setResetRecorder(!resetRecorder);
  };

  const speakPhrase = (text: string, rate: number = 1) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!currentPhrase) {
    return (
      <div className="text-center p-8">
        <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Error al cargar la frase actual.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mb-4">
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : ''}`}>
          {currentPhrase.targetText}
        </h2>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {currentPhrase.translatedText}
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex justify-center space-x-1">
          <button
            onClick={() => speakPhrase(currentPhrase.targetText, 1)}
            className={`flex items-center justify-center px-2 py-1 text-sm min-w-[50px] md:px-4 md:py-2 md:text-base md:min-w-[70px] ${
              isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
            } text-white rounded`}
          >
            <PlayCircle className="mr-1 w-4 h-4 md:mr-2 md:w-5 md:h-5" />
            Speak
          </button>
          <button
            onClick={() => speakPhrase(currentPhrase.targetText, 0.4)}
            className={`flex items-center justify-center px-2 py-1 text-sm min-w-[50px] md:px-4 md:py-2 md:text-base md:min-w-[70px] ${
              isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
            } text-white rounded`}
          >
            <Clock className="mr-1 w-4 h-4 md:mr-2 md:w-5 md:h-5" />
            Slow
          </button>
          <VoiceRecorder 
            targetPhrase={currentPhrase.targetText} 
            isDarkMode={isDarkMode} 
            resetKey={resetRecorder}
            inline={true}
          />
        </div>

        <div id="similarity-result" className="h-8">
          {/* El resultado de la comparación aparecerá aquí */}
        </div>
      </div>
    </div>
  );
};