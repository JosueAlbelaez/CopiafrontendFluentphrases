
import { Link } from 'react-router-dom';

export const CookiesPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Cookies</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">1. ¿Qué son las Cookies?</h2>
              <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web. Nos ayudan a mejorar tu experiencia y proporcionar ciertas funcionalidades.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Tipos de Cookies que Usamos</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cookies Esenciales:</strong> Necesarias para el funcionamiento básico del sitio</li>
                <li><strong>Cookies de Preferencias:</strong> Recuerdan tus preferencias y configuraciones</li>
                <li><strong>Cookies Analíticas:</strong> Nos ayudan a entender cómo usas el sitio</li>
                <li><strong>Cookies de Marketing:</strong> Utilizadas para publicidad personalizada</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Control de Cookies</h2>
              <p>Puedes controlar las cookies de varias formas:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Configuración del navegador para rechazar cookies</li>
                <li>Banner de consentimiento de cookies en nuestro sitio</li>
                <li>Herramientas de gestión de cookies de terceros</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Cookies de Terceros</h2>
              <p>Algunos servicios de terceros que utilizamos pueden establecer sus propias cookies:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Google Analytics (análisis)</li>
                <li>Proveedores de pago</li>
                <li>Redes sociales</li>
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
