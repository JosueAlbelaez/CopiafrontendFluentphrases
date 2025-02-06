
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface EmailConfig {
  email: string;
  password: string;
}

export const EmailConfigForm = ({ onConfigured }: { onConfigured: () => void }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<EmailConfig>({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.email || !config.password) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }
    
    // Almacenar en memoria (no en localStorage por seguridad)
    window.emailConfig = config;
    onConfigured();
    
    toast({
      title: "Configuración guardada",
      description: "Las credenciales de correo se han configurado correctamente",
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Configurar correo electrónico</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Gmail
            </label>
            <input
              id="email"
              type="email"
              value={config.email}
              onChange={(e) => setConfig(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña de aplicación
            </label>
            <input
              id="password"
              type="password"
              value={config.password}
              onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? "Guardando..." : "Guardar configuración"}
          </button>
        </form>
      </div>
    </div>
  );
};
