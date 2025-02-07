import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { emailValidator } from '@/lib/validators';

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!emailValidator(email)) {
        throw new Error('Por favor ingresa un correo electrónico válido');
      }

      console.log('Enviando solicitud de recuperación para:', email);
      
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { 
        email 
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Respuesta del servidor:', response.data);

      toast({
        title: "Correo enviado",
        description: response.data.message,
      });

      setEmail('');
    } catch (error: any) {
      console.error('Error detallado:', error);
      console.error('Response data:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || error.message;
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Recuperar contraseña</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? "Enviando..." : "Enviar correo de recuperación"}
          </button>
        </form>
      </div>
    </div>
  );
}