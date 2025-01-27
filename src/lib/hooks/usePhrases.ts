import { useEffect, useState } from 'react';
import { useToast } from '../../hooks/use-toast';
import axios from 'axios';

interface Phrase {
  _id: string;
  targetText: string;
  translatedText: string;
  category: string;
  language: string;
}

export function usePhrases(language: string, category?: string) {
  const { toast } = useToast();
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyCount, setDailyCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>('free');

  useEffect(() => {
    const loadPhrases = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);

        const response = await axios.get('/api/phrases', {
          params: { language, category },
          headers: { Authorization: `Bearer ${token}` }
        });

        const { phrases: phrasesData, userInfo } = response.data;

        // Asegurarse de que las frases tengan el formato correcto
        const formattedPhrases = phrasesData.map((phrase: any) => ({
          _id: phrase._id,
          targetText: phrase.target_text || phrase.targetText,
          translatedText: phrase.translated_text || phrase.translatedText,
          category: phrase.category,
          language: phrase.language
        }));

        setPhrases(formattedPhrases);
        setDailyCount(userInfo.dailyPhrasesCount || 0);
        setUserRole(userInfo.role);

      } catch (error) {
        console.error('Error loading phrases:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar las frases');
        setPhrases([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPhrases();
  }, [language, category]);

  const incrementDailyCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      if (userRole === 'free') {
        const response = await axios.post('/api/phrases/increment', null, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setDailyCount(response.data.dailyPhrasesCount);
      }
    } catch (error) {
      console.error('Error al incrementar el contador diario:', error);
    }
  };

  return {
    phrases,
    isLoading,
    dailyCount,
    incrementDailyCount,
    error,
    isAuthenticated,
    userRole
  };
}