
import { Lock } from 'lucide-react';
import { PricingModal } from '../subscription/PricingModal';
import { useState } from 'react';

interface FreeLimitAlertProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FreeLimitAlert({ isOpen, onClose }: FreeLimitAlertProps) {
  const [showPricingModal, setShowPricingModal] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-8 h-8 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Límite diario alcanzado
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Has alcanzado el límite diario de 20 frases gratuitas. 
                Actualiza a premium para:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Acceder a todas las categorías</li>
                <li>Practicar sin límites diarios</li>
                <li>Desbloquear contenido exclusivo</li>
                <li>Obtener funciones premium</li>
              </ul>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 font-medium transition-colors"
                >
                  Continuar con plan gratuito
                </button>
                <button
                  onClick={() => {
                    onClose();
                    setShowPricingModal(true);
                  }}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  Ver planes premium
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PricingModal 
        isOpen={showPricingModal} 
        onClose={() => setShowPricingModal(false)} 
      />
    </>
  );
}
