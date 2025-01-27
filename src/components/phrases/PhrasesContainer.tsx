import { useState, useEffect } from 'react';
import { usePhrases } from '@/lib/hooks/usePhrases';
import { FreeLimitAlert } from './FreeLimitAlert';
import { PhraseProgress } from './PhraseProgress';
import { UserCircle2, LogIn } from 'lucide-react';
import { SignInForm } from '../auth/SignInForm';
import { SignUpForm } from '../auth/SignUpForm';

interface PhrasesContainerProps {
  language: string;
  category?: string;
  children: (phrases: any[], incrementCount: () => void) => React.ReactNode;
}

export function PhrasesContainer({ language, category, children }: PhrasesContainerProps) {
  const [showAuthModal, setShowAuthModal] = useState<'signin' | 'signup' | null>(null);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  
  const { 
    phrases, 
    isLoading, 
    dailyCount,
    incrementDailyCount,
    error,
    isAuthenticated,
    userRole 
  } = usePhrases(language, category);

  const DAILY_LIMIT = 20;
  const ITEMS_PER_PAGE = 10; // Reducido a 10 para mejor navegación
  const isPremium = userRole === 'premium' || userRole === 'admin';
  const totalPages = Math.ceil(phrases.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(0);
  }, [category, language]);

  const handlePhraseInteraction = async () => {
    if (!isAuthenticated) {
      setShowAuthModal('signin');
      return;
    }

    if (!isPremium && dailyCount >= DAILY_LIMIT) {
      setShowLimitAlert(true);
      return;
    }

    await incrementDailyCount();
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
          <PhraseProgress current={dailyCount} total={DAILY_LIMIT} />
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
          {category && phrases.length > 0 && (
            <div className="mb-6 px-4">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
                  <span>Progreso de la categoría</span>
                  <span>{phrases.length} frases en total</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(currentPage * ITEMS_PER_PAGE + Math.min(ITEMS_PER_PAGE, phrases.length - currentPage * ITEMS_PER_PAGE)) / phrases.length * 100}%` 
                    }}
                  />
                </div>
                <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                  Mostrando {currentPage * ITEMS_PER_PAGE + 1} - {Math.min((currentPage + 1) * ITEMS_PER_PAGE, phrases.length)} de {phrases.length} frases
                </div>
              </div>
            </div>
          )}

          {children(
            phrases.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE),
            handlePhraseInteraction
          )}

          {phrases.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 hover:bg-green-700 transition-colors"
              >
                Anterior
              </button>
              <span className="text-sm font-medium">
                Página {currentPage + 1} de {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 hover:bg-green-700 transition-colors"
              >
                Siguiente
              </button>
            </div>
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