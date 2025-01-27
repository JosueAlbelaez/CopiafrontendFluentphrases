import { useState, useEffect } from 'react';
import { usePhrases } from '@/lib/hooks/usePhrases';
import { FreeLimitAlert } from './FreeLimitAlert';
import { PhraseProgress } from './PhraseProgress';
import { UserCircle2, LogIn } from 'lucide-react';
import { SignInForm } from '../auth/SignInForm';
import { SignUpForm } from '../auth/SignUpForm';
import { TableView } from './TableView';
import { DefaultView } from './DefaultView';

const TABLE_VIEW_CATEGORIES = [
  '1000 Nouns',
  'Adjectives and Adverbs',
  'Prepositions and Conjunctions',
  'Articles, Determiners and Interjections'
];

interface PhrasesContainerProps {
  language: string;
  category?: string;
}

export function PhrasesContainer({ language, category }: PhrasesContainerProps) {
  const [showAuthModal, setShowAuthModal] = useState<'signin' | 'signup' | null>(null);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { 
    phrases: allPhrases, 
    isLoading, 
    dailyCount,
    incrementDailyCount,
    error,
    isAuthenticated,
    userRole,
    refresh 
  } = usePhrases(language, category);

  const DAILY_LIMIT = 20;
  const ITEMS_PER_PAGE = 50;
  const isPremium = userRole === 'premium' || userRole === 'admin';

  // Ordenar frases alfabéticamente si es una categoría de tabla
  const sortedPhrases = TABLE_VIEW_CATEGORIES.includes(category || '')
    ? [...allPhrases].sort((a, b) => a.targetText.localeCompare(b.targetText))
    : allPhrases;

  const totalPages = Math.ceil(sortedPhrases.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(0);
  }, [category, language]);

  const handlePhraseInteraction = async () => {
    console.log('Iniciando interacción...');
    if (isProcessing) {
      console.log('Interacción bloqueada: isProcessing=true');
      return;
    }
    
    try {
      setIsProcessing(true);
      console.log('isProcessing establecido en true');

      if (!isAuthenticated) {
        console.log('Usuario no autenticado. Mostrando modal de autenticación...');
        setShowAuthModal('signin');
        return;
      }

      if (!isPremium && dailyCount >= DAILY_LIMIT) {
        console.log('Límite diario alcanzado. Mostrando alerta...');
        setShowLimitAlert(true);
        return;
      }

      console.log('Incrementando contador diario...');
      await incrementDailyCount(); // Incrementa el contador
      console.log('Contador diario incrementado. Refrescando frases...');
      await refresh(); // Refresca las frases
      console.log('Frases refrescadas.');
    } catch (error) {
      console.error('Error en la interacción:', error);
    } finally {
      setIsProcessing(false);
      console.log('isProcessing establecido en false');
    }
  };

  const handleCloseModal = () => {
    setShowAuthModal(null);
  };

  const handleAuthSuccess = () => {
    handleCloseModal();
    window.location.reload();
  };

  const handleSwitchAuth = () => {
    setShowAuthModal(showAuthModal === 'signin' ? 'signup' : 'signin');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="flex flex-col items-center justify-center p-8 space-y-6">
          <div className="text-center space-y-4">
            <UserCircle2 className="w-16 h-16 mx-auto text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Inicia sesión o regístrate gratis
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Para acceder a todas las frases y comenzar a practicar, necesitas iniciar sesión o crear una cuenta gratuita.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowAuthModal('signin')}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Iniciar sesión
            </button>
            <button
              onClick={() => setShowAuthModal('signup')}
              className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            >
              Registrarse gratis
            </button>
          </div>
        </div>

        {showAuthModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              {showAuthModal === 'signin' ? (
                <>
                  <SignInForm onAuthSuccess={handleAuthSuccess} />
                  <div className="mt-4 text-center">
                    <button
                      onClick={handleSwitchAuth}
                      className="text-green-600 hover:text-green-700 text-sm"
                    >
                      ¿No tienes cuenta? Regístrate aquí
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <SignUpForm onAuthSuccess={handleAuthSuccess} />
                  <div className="mt-4 text-center">
                    <button
                      onClick={handleSwitchAuth}
                      className="text-green-600 hover:text-green-700 text-sm"
                    >
                      ¿Ya tienes cuenta? Inicia sesión aquí
                    </button>
                  </div>
                </>
              )}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      {!isPremium && (
        <div className="mb-6">
          <PhraseProgress current={dailyCount} total={DAILY_LIMIT} showTotal={true} />
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
            <div className="w-12 h-12 border-4 border-green-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
        </div>
      ) : error ? (
        <div className="text-center p-8">
          <p className="text-red-600 dark:text-red-400">
            {typeof error === 'string' ? error : 'Error al cargar las frases'}
          </p>
        </div>
      ) : (
        <>
          {TABLE_VIEW_CATEGORIES.includes(category || '') ? (
            <TableView
              phrases={sortedPhrases.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)}
              incrementCount={handlePhraseInteraction}
              isDarkMode={document.documentElement.classList.contains('dark')}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isProcessing={isProcessing}
            />
          ) : (
            <DefaultView
              phrases={sortedPhrases}
              incrementCount={handlePhraseInteraction}
              isDarkMode={document.documentElement.classList.contains('dark')}
              isProcessing={isProcessing}
              language={language}
              category={category}
            />
          )}
        </>
      )}

      {!isPremium && (
        <FreeLimitAlert 
          isOpen={showLimitAlert} 
          onClose={() => setShowLimitAlert(false)} 
        />
      )}
    </div>
  );
}