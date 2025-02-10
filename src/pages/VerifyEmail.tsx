import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

export default function VerifyEmail() {
  const [verifying, setVerifying] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = new URLSearchParams(location.search).get('token');
        
        if (!token) {
          toast({
            title: "Error",
            description: "Token de verificación no encontrado",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        const response = await axios.post('/api/auth/verify-email', { token });
        
        // Guardar el token y la información del usuario
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        toast({
          title: "¡Éxito!",
          description: "Tu correo ha sido verificado exitosamente",
        });

        // Redireccionar a la página de inicio
        navigate('/');
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.error || "Error al verificar el correo",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [navigate, location.search, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {verifying ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Verificando tu correo electrónico...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : null}
    </div>
  );
}