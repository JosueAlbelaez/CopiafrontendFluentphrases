import { useState } from 'react';
import { Clock, PlayCircle } from 'lucide-react';
import VoiceRecorder from '../VoiceRecorder';
import { PhraseProgress } from './PhraseProgress';
import { usePhrases } from '@/lib/hooks/usePhrases';

interface Phrase {
  _id: string;
  targetText: string;
  translatedText: string;
  category: string;
  language: string;
}

interface DefaultViewProps {
  phrases: Phrase[];
  incrementCount: () => Promise<void>;
  isDarkMode: boolean;
  isProcessing: boolean;
  language: string;
  category?: string;
}

export const DefaultView = ({ phrases, incrementCount, isDarkMode, isProcessing, language, category }: DefaultViewProps) => {
  const [resetRecorder, setResetRecorder] = useState<boolean>(false);
  const { currentPhraseIndex, goToNextPhrase, goToPreviousPhrase, currentPhrase } = usePhrases(language, category);

  if (!phrases || phrases.length === 0) {
    return (
      <div className="text-center p-8">
        <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          No hay frases disponibles en esta categoría.
        </p>
      </div>
    );
  }

  const handleNext = async () => {
    console.log('Intentando avanzar a la siguiente frase...');
    if (currentPhraseIndex < phrases.length - 1 && !isProcessing) {
      try {
        console.log('Llamando a incrementCount...');
        await incrementCount(); // Espera a que se complete la función
        console.log('incrementCount completado. Actualizando índice...');
        goToNextPhrase(); // Usa la función del hook
        setResetRecorder(prev => !prev); // Reinicia el grabador de voz
      } catch (error) {
        console.error('Error en handleNext:', error);
      }
    } else {
      console.log('No se puede avanzar: fin de la lista o isProcessing=true');
    }
  };

  const handlePrevious = () => {
    console.log('Retrocediendo a la frase anterior...');
    if (currentPhraseIndex > 0) {
      goToPreviousPhrase(); // Usa la función del hook
      setResetRecorder(prev => !prev); // Reinicia el grabador de voz
    }
  };

  const handleSpeak = async (rate: number = 1) => {
    console.log('Reproduciendo frase...');
    if ('speechSynthesis' in window && !isProcessing && currentPhrase) {
      try {
        const utterance = new SpeechSynthesisUtterance(currentPhrase.targetText);
        utterance.lang = 'en-US';
        utterance.rate = rate;
        window.speechSynthesis.speak(utterance);
        console.log('Llamando a incrementCount...');
        await incrementCount(); // Incrementa el contador después de reproducir
      } catch (error) {
        console.error('Error en handleSpeak:', error);
      }
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
    <div className="text-center space-y-6">
      {/* Botones de navegación */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={handlePrevious}
          disabled={currentPhraseIndex === 0 || isProcessing}
          className={`px-4 py-2 ${
            isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
          } text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentPhraseIndex === phrases.length - 1 || isProcessing}
          className={`px-4 py-2 ${
            isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
          } text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Next
        </button>
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <PhraseProgress 
          current={currentPhraseIndex + 1} 
          total={phrases.length} 
          showTotal={true}
        />
      </div>

      {/* Frase actual */}
      <div className="mb-4">
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : ''}`}>
          {currentPhrase.targetText}
        </h2>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {currentPhrase.translatedText}
        </p>
      </div>

      {/* Botones de interacción */}
      <div className="flex justify-center space-x-1">
        <button
          onClick={() => handleSpeak(1)}
          disabled={isProcessing}
          className={`flex items-center justify-center px-2 py-1 text-sm min-w-[50px] md:px-4 md:py-2 md:text-base md:min-w-[70px] ${
            isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
          } text-white rounded disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <PlayCircle className="mr-1 w-4 h-4 md:mr-2 md:w-5 md:h-5" />
          Speak
        </button>
        <button
          onClick={() => handleSpeak(0.4)}
          disabled={isProcessing}
          className={`flex items-center justify-center px-2 py-1 text-sm min-w-[50px] md:px-4 md:py-2 md:text-base md:min-w-[70px] ${
            isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
          } text-white rounded disabled:opacity-50 disabled:cursor-not-allowed`}
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

      {/* Resultado de la comparación */}
      <div id="similarity-result" className="h-8">
        {/* El resultado de la comparación aparecerá aquí */}
      </div>
    </div>
  );
};