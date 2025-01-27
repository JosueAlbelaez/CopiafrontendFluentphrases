import { PlayCircle, Clock } from 'lucide-react';
import VoiceRecorder from '../VoiceRecorder';

interface TableViewProps {
  phrases: any[];
  incrementCount: () => void;
  isDarkMode: boolean;
}

export function TableView({ phrases, incrementCount, isDarkMode }: TableViewProps) {
  const speakPhrase = (text: string, rate: number = 1) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full">
      <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
        <table className="min-w-full">
          <tbody>
            {phrases.map((phrase, index) => (
              <tr key={index} className={`border-b-2 ${isDarkMode ? 'border-gray-600' : ''}`}>
                <td className="p-2 sm:p-4">
                  <div className="flex-col justify-center items-center">
                    <div className="flex-1">
                      <p className={`text-base sm:text-lg font-bold ${
                        isDarkMode ? 'text-green-400' : 'text-green-800'
                      } mb-1`}>
                        {phrase.targetText}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {phrase.translatedText}
                      </p>
                    </div>
                    <div className="flex justify-center py-2 space-x-1">
                      <button
                        onClick={() => {
                          speakPhrase(phrase.targetText, 1);
                          incrementCount();
                        }}
                        className={`flex items-center justify-center px-2 py-1 text-xs min-w-[50px] md:px-4 md:py-2 md:text-base md:min-w-[60px] rounded transition-colors ${
                          isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
                        } text-white`}
                      >
                        <PlayCircle className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <button
                        onClick={() => {
                          speakPhrase(phrase.targetText, 0.4);
                          incrementCount();
                        }}
                        className={`flex items-center justify-center px-2 py-1 text-xs min-w-[50px] md:px-4 md:py-2 md:text-base md:min-w-[60px] rounded transition-colors ${
                          isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
                        } text-white`}
                      >
                        <Clock className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <VoiceRecorder 
                        targetPhrase={phrase.targetText} 
                        isDarkMode={isDarkMode} 
                        resetKey={false}
                        inline={true}
                        resultId={`similarity-result-${index}`}
                      />
                    </div>
                    <div id={`similarity-result-${index}`} className="h-9 pb-2">
                      {/* El resultado de la comparación aparecerá aquí */}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}