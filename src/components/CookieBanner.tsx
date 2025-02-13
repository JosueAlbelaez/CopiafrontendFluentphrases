
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleConsent = (accepted: boolean) => {
    localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'rejected');
    setShowBanner(false);
    
    toast({
      title: accepted ? "Cookies aceptadas" : "Cookies rechazadas",
      description: accepted 
        ? "Gracias por aceptar nuestras cookies" 
        : "Has rechazado las cookies. Algunas funciones pueden estar limitadas",
    });
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 text-white p-4 md:p-6 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm md:text-base">
            Utilizamos cookies para mejorar tu experiencia. Al continuar navegando, aceptas nuestra{' '}
            <a 
              href="/cookies" 
              className="text-blue-400 hover:text-blue-300 underline"
            >
              política de cookies
            </a>.
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => handleConsent(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
          >
            Aceptar
          </button>
          <button
            onClick={() => handleConsent(false)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Rechazar
          </button>
          <button
            onClick={() => setShowBanner(false)}
            className="p-1 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
