
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hasScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                FluentPhrases
              </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600">Inicio</Link>
              <a href="#about" className="text-gray-700 hover:text-blue-600">Sobre Nosotros</a>
              <a href="#plans" className="text-gray-700 hover:text-blue-600">Planes</a>
              <a href="#blog" className="text-gray-700 hover:text-blue-600">Blog</a>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">Iniciar Sesión</Link>
              <Link 
                to="/register" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Registrarse
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <a 
                href="#about" 
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre Nosotros
              </a>
              <a 
                href="#plans" 
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Planes
              </a>
              <a 
                href="#blog" 
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </a>
              <Link 
                to="/login" 
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className="block px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Registrarse
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          src="https://videos.pexels.com/video-files/3679714/3679714-hd_1920_1080_30fps.mp4"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Aprende inglés de forma natural y efectiva
          </h1>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <div className="flex flex-col items-center">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium">
                Frases Útiles
              </button>
              <p className="text-white mt-2 text-sm">
                Frases en inglés útiles para tu día a día
              </p>
            </div>
            <div className="flex flex-col items-center">
              <button className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium">
                Lecturas Interlineadas
              </button>
              <p className="text-white mt-2 text-sm">
                Lee y escucha artículos variados para mejorar tu escucha y comprensión lectora
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Sobre Nosotros
              </h2>
              <p className="text-gray-600 mb-6">
                En FluentPhrases, creemos en el poder del aprendizaje natural del idioma. 
                Nuestra metodología se basa en la teoría del input comprensible de Krashen, 
                que sostiene que la mejor manera de aprender un idioma es mediante la 
                exposición constante a contenido significativo y comprensible.
              </p>
              <p className="text-gray-600">
                A través de nuestra plataforma, proporcionamos un ambiente inmersivo donde 
                podrás escuchar, repetir y practicar el inglés en contextos cotidianos, 
                permitiéndote desarrollar una comprensión natural del idioma.
              </p>
            </div>
            <div className="relative h-96">
              <img
                src="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg"
                alt="Estudiantes aprendiendo"
                className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Por qué elegir FluentPhrases?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <img
                src="https://images.pexels.com/photos/6929167/pexels-photo-6929167.jpeg"
                alt="Método natural"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Método Natural</h3>
              <p className="text-gray-600">
                Aprende inglés de la misma forma en que aprendiste tu idioma nativo
              </p>
            </div>
            <div className="text-center p-6">
              <img
                src="https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg"
                alt="Práctica constante"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Práctica Constante</h3>
              <p className="text-gray-600">
                Ejercicios diarios diseñados para mejorar tu fluidez
              </p>
            </div>
            <div className="text-center p-6">
              <img
                src="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg"
                alt="Contenido contextual"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Contenido Contextual</h3>
              <p className="text-gray-600">
                Aprende frases útiles en situaciones reales
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nuestros Planes
          </h2>
          {/* Aquí se integrará el modal de precios existente */}
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Blog
          </h2>
          <p className="text-gray-600 mb-8">
            Próximamente encontrarás aquí artículos interesantes sobre el aprendizaje de idiomas
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Explorar Blog
          </button>
        </div>
      </section>

      {/* El footer existente se mantendrá aquí */}
    </div>
  );
};
