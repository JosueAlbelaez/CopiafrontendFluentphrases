
import { Link } from 'react-router-dom';

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Privacidad</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Información que Recopilamos</h2>
              <p>En FluentPhrases, recopilamos la siguiente información:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Información de registro (nombre, correo electrónico)</li>
                <li>Datos de uso de la aplicación</li>
                <li>Progreso en el aprendizaje</li>
                <li>Información de pago (procesada de forma segura por terceros)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Uso de la Información</h2>
              <p>Utilizamos tu información para:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Personalizar tu experiencia de aprendizaje</li>
                <li>Mejorar nuestros servicios</li>
                <li>Comunicarnos contigo sobre actualizaciones</li>
                <li>Procesar tus pagos y suscripciones</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Protección de Datos</h2>
              <p>Implementamos medidas de seguridad para proteger tu información:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Encriptación de datos sensibles</li>
                <li>Acceso restringido a la información personal</li>
                <li>Monitoreo regular de seguridad</li>
                <li>Copias de seguridad periódicas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Tus Derechos</h2>
              <p>Tienes derecho a:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Acceder a tu información personal</li>
                <li>Corregir datos inexactos</li>
                <li>Solicitar la eliminación de tus datos</li>
                <li>Exportar tus datos</li>
              </ul>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
