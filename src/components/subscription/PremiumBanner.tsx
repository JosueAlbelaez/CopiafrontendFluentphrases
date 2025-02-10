import { Sparkles } from 'lucide-react';

interface PremiumBannerProps {
  onUpgrade: () => void;
}

export function PremiumBanner({ onUpgrade }: PremiumBannerProps) {
  return (
    <div className="bg-gradient-to-r from-yellow-500 to-yellow-800 p-4 rounded-lg shadow-md mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-white" />
          <p className="text-white font-medium">
            ¡DESBLOQUEA todas las categorías y funciones premium!
          </p>
        </div>
        <button
          onClick={onUpgrade}
          className="px-4 py-2 bg-white text-yellow-600 rounded-md font-medium hover:bg-yellow-50 transition-colors"
        >
          Hazte Premium
        </button>
      </div>
    </div>
  );
}