import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { emailValidator } from '@/lib/validators';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface SignInFormProps {
  onAuthSuccess: () => void;
}

export function SignInForm({ onAuthSuccess }: SignInFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResetPassword = () => {
    navigate('/forgot-password');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!emailValidator(formData.email)) {
        toast({
          title: "Error de validación",
          description: "Por favor ingresa un correo electrónico válido.",
          variant: "destructive",
        });
        return;
      }

      console.log('Intentando iniciar sesión con:', {
        email: formData.email,
        passwordLength: formData.password.length
      });
      
      const response = await axios.post('http://localhost:5000/api/auth/signin', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido, ${response.data.user.firstName}`,
        });

        onAuthSuccess();
      }
    } catch (error: any) {
      console.log('Error completo:', error);
      console.log('Response data:', error.response?.data);

      if (error.response?.data?.error === 'Contraseña incorrecta') {
        toast({
          title: "Contraseña incorrecta",
          description: "Por favor verifica tu contraseña e intenta nuevamente.",
          variant: "destructive",
        });
      } else if (error.response?.data?.error === 'Usuario no encontrado') {
        toast({
          title: "Usuario no encontrado",
          description: "El correo electrónico no está registrado.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error de conexión",
          description: "No se pudo conectar con el servidor. Por favor, intenta de nuevo más tarde.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-green-600 hover:text-green-700 text-sm"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
