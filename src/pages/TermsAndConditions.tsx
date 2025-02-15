
import { Link } from 'react-router-dom';

export const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Términos y Condiciones</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Aceptación de los Términos</h2>
              <p>Al usar FluentPhrases, aceptas estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguna parte, por favor no uses nuestros servicios.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Uso del Servicio</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Debes tener al menos 13 años para usar el servicio</li>
                <li>Eres responsable de mantener la seguridad de tu cuenta</li>
                <li>No puedes compartir tu cuenta con otros</li>
                <li>El contenido del curso es para uso personal</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Suscripciones y Pagos</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Los precios están sujetos a cambios con previo aviso</li>
                <li>Las suscripciones se renuevan automáticamente</li>
                <li>Puedes cancelar tu suscripción en cualquier momento</li>
                <li>Los reembolsos se manejan caso por caso</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Propiedad Intelectual</h2>
              <p>Todo el contenido de FluentPhrases está protegido por derechos de autor. No puedes:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Copiar o distribuir el contenido</li>
                <li>Modificar o crear trabajos derivados</li>
                <li>Usar el contenido con fines comerciales</li>
                <li>Compartir recursos premium con no suscriptores</li>
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
