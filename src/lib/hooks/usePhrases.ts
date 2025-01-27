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

interface UsePhraseReturn {
  phrases: Phrase[];
  isLoading: boolean;
  dailyCount: number;
  incrementDailyCount: () => Promise<void>;
  error: string | null;
  isAuthenticated: boolean;
  userRole: string;
  refresh: () => Promise<void>;
  currentPhraseIndex: number;
  goToNextPhrase: () => void;
  goToPreviousPhrase: () => void;
  currentPhrase: Phrase | null;
}

export function usePhrases(language: string, category?: string): UsePhraseReturn {
  const { toast } = useToast();
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyCount, setDailyCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>('free');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

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

      // Formatear las frases
      const formattedPhrases = phrasesData.map((phrase: any) => ({
        _id: phrase._id,
        targetText: phrase.target_text || phrase.targetText,
        translatedText: phrase.translated_text || phrase.translatedText,
        category: phrase.category,
        language: phrase.language
      }));

      // Si no hay categoría seleccionada, mostrar solo 10 frases aleatorias
      if (!category) {
        const shuffled = formattedPhrases.sort(() => 0.5 - Math.random());
        setPhrases(shuffled.slice(0, 10));
      } else {
        setPhrases(formattedPhrases);
      }

      setDailyCount(userInfo.dailyPhrasesCount || 0);
      setUserRole(userInfo.role);
      setCurrentPhraseIndex(0); // Reset index when loading new phrases

    } catch (error) {
      console.error('Error loading phrases:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar las frases');
      setPhrases([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
      toast({
        title: "Error",
        description: "No se pudo actualizar el contador de frases",
        variant: "destructive"
      });
    }
  };

  const goToNextPhrase = () => {
    if (currentPhraseIndex < phrases.length - 1) {
      setCurrentPhraseIndex(prev => prev + 1);
    }
  };

  const goToPreviousPhrase = () => {
    if (currentPhraseIndex > 0) {
      setCurrentPhraseIndex(prev => prev - 1);
    }
  };

  const currentPhrase = phrases[currentPhraseIndex] || null;

  return {
    phrases,
    isLoading,
    dailyCount,
    incrementDailyCount,
    error,
    isAuthenticated,
    userRole,
    refresh: loadPhrases,
    currentPhraseIndex,
    goToNextPhrase,
    goToPreviousPhrase,
    currentPhrase
  };
}