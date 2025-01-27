import { Moon, Sun, LogOut, Home } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import logo from '@/assets/logo.png';

interface HeaderProps {
  user?: {
    firstName: string;
  } | null;
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className="bg-blue-500 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="w-16 h-16" />
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-400 hover:bg-blue-300 text-white transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Inicio</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <span className="text-white font-medium">
                Hola, {user.firstName}
              </span>
            )}
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-blue-400 text-white transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
            </button>

            {user && onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-white hover:text-red-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar sesión</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}