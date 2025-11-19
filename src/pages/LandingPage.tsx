
import { useState, useEffect, useRef } from 'react';
import { Menu, MapPin, Phone, Mail,  X } from 'lucide-react';
import { FaLinkedin, FaInstagram, FaTiktok } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { PricingPlans } from '@/components/subscription/PricingPlans';
import logo from '@/assets/logo.png';
import 'animate.css';

const currentYear = new Date().getFullYear();

export const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const navigate = useNavigate();

  // Referencias para las imágenes
  const aboutImageRef = useRef<HTMLImageElement>(null);
  const featureImage1Ref = useRef<HTMLImageElement>(null);
  const featureImage2Ref = useRef<HTMLImageElement>(null);
  const featureImage3Ref = useRef<HTMLImageElement>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2
    };

    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate__animated', 'animate__fadeInUp');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    // Observar todas las imágenes
    if (aboutImageRef.current) observer.observe(aboutImageRef.current);
    if (featureImage1Ref.current) observer.observe(featureImage1Ref.current);
    if (featureImage2Ref.current) observer.observe(featureImage2Ref.current);
    if (featureImage3Ref.current) observer.observe(featureImage3Ref.current);

    return () => observer.disconnect();
  }, []);

  const handleAuthSuccess = () => {
    setShowSignInModal(false);
    setShowSignUpModal(false);
    navigate('/app');
  };

  return (
    <div className="min-h-screen">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hasScrolled ? 'bg-white shadow-md' : 'bg-white/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="w-12 h-12 md:w-16 md:h-16" />
              <Link to="/" className="text-2xl font-bold text-red-600">
                Fluent
              </Link>
              <Link to="/" className="text-2xl font-bold text-blue-600">
                Phrases
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button onClick={() => scrollToSection('home')} className="text-gray-800 hover:text-blue-600">Inicio</button>
              <button onClick={() => scrollToSection('about')} className="text-gray-800 hover:text-blue-600">Sobre Nosotros</button>
              <button onClick={() => scrollToSection('plans')} className="text-gray-800 hover:text-blue-600">Planes</button>
              <button onClick={() => scrollToSection('blog')} className="text-gray-800 hover:text-blue-600">Blog</button>
              <button 
                onClick={() => setShowSignInModal(true)} 
                className="text-gray-700 hover:text-blue-600"
              >
                Iniciar Sesión
              </button>
              <button 
                onClick={() => setShowSignUpModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Registrarse
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => {
                  scrollToSection('home');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
              >
                Inicio
              </button>
              <button 
                onClick={() => {
                  scrollToSection('about');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
              >
                Sobre Nosotros
              </button>
              <button 
                onClick={() => {
                  scrollToSection('plans');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
              >
                Planes
              </button>
              <button 
                onClick={() => {
                  scrollToSection('blog');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
              >
                Blog
              </button>
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowSignInModal(true);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
              >
                Iniciar Sesión
              </button>
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowSignUpModal(true);
                }}
                className="block w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Registrarse
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Rest of the component remains exactly the same */}
      {/* The following sections remain unchanged: home, about, features, plans, blog, modals, and footer */}
      {/* Keeping all the existing content and functionality intact */}
      
      {/* Previous sections content... */}
      <section id="home" className="relative h-screen flex items-center">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-95"
          src="https://videos.pexels.com/video-files/3679714/3679714-hd_1920_1080_30fps.mp4"
        />
        <div className="absolute inset-0 bg-green-900 bg-opacity-50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Aprende inglés de forma natural y efectiva
          </h1>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <div className="flex flex-col items-center">
              <button 
                onClick={() => navigate('/app')}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Frases Útiles
              </button>
              <p className="text-white mt-2 text-sm">
                Frases en inglés útiles para tu día a día
              </p>
            </div>
            <div className="flex flex-col items-center ">
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

      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-green-800 mb-6">
                Sobre Nosotros
              </h2>
              <p className="text-green-600 font-bold mb-6">
                En FluentPhrases, creemos en el poder del aprendizaje natural del idioma. 
                Nuestra metodología se basa en la teoría del input comprensible de Krashen, 
                que sostiene que la mejor manera de aprender un idioma es mediante la 
                exposición constante a contenido significativo y comprensible.
              </p>
              <p className="text-green-600 font-bold">
                A través de nuestra plataforma, proporcionamos un ambiente inmersivo donde 
                podrás escuchar, repetir y practicar el inglés en contextos cotidianos, 
                permitiéndote desarrollar una comprensión natural del idioma.
              </p>
            </div>
            <div className="relative h-96">
              <img
                ref={aboutImageRef}
                src="https://images.pexels.com/photos/5676744/pexels-photo-5676744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Estudiantes aprendiendo"
                className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl opacity-0"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-green-300 mb-12">
            ¿Por qué elegir FluentPhrases?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <img
                ref={featureImage1Ref}
                src="https://images.pexels.com/photos/6929167/pexels-photo-6929167.jpeg"
                alt="Método natural"
                className="w-full h-48 object-cover rounded-lg mb-4 opacity-0"
              />
              <h3 className="text-xl font-bold mb-2 text-green-300">Método Natural</h3>
<p className="text-green-200 text-justify">
  Aprende inglés de manera intuitiva, tal como aprendiste tu idioma nativo: escuchando, absorbiendo y practicando en contextos reales.  
  Olvídate de memorizar listas interminables de palabras y reglas gramaticales sin sentido.  
  Con nuestro enfoque, mejorarás tu comprensión y fluidez de forma natural, sin esfuerzo y con resultados duraderos.  
  <span className="font-bold text-green-200"> Empieza hoy mismo y transforma tu manera de aprender inglés.</span>
</p>
            </div>
            <div className="text-center p-6">
              <img
                ref={featureImage2Ref}
                src="https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg"
                alt="Práctica constante"
                className="w-full h-48 object-cover rounded-lg mb-4 opacity-0"
              />
             <h3 className="text-xl font-bold mb-2 text-green-300">Práctica Constante</h3>
<p className="text-green-200 text-justify">
  La clave para dominar el inglés es la práctica diaria.  
  Nuestros ejercicios están diseñados para fortalecer tu fluidez, mejorar tu pronunciación y ayudarte a pensar en inglés sin esfuerzo.  
  Dedica unos minutos al día y verás cómo tu confianza y habilidades lingüísticas crecen de forma natural.  
  <span className="font-bold text-green-200"> Empieza hoy y conviértete en un hablante más seguro y fluido.</span>
</p>
            </div>
            <div className="text-center p-6">
              <img
                ref={featureImage3Ref}
                src="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg"
                alt="Contenido contextual"
                className="w-full h-48 object-cover rounded-lg mb-4 opacity-0"
              />
            <h3 className="text-xl font-bold mb-2 text-green-300">Contenido Contextual</h3>
<p className="text-green-200 text-justify">
  La mejor forma de aprender inglés es usando frases que realmente necesitas en tu día a día.  
  Con nuestro enfoque basado en el contexto, practicarás expresiones útiles en situaciones reales,  
  como viajar, hacer compras o tener conversaciones laborales.  
  Esto te permitirá comunicarte con confianza y naturalidad desde el primer día.  
  <span className="font-bold text-green-200"> Empieza ahora y lleva tu inglés a un nivel práctico y efectivo.</span>
</p>
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-8">
            Nuestros Planes
          </h2>
          <PricingPlans />
        </div>
      </section>

      <section id="blog" className="relative py-20">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
      ></div>
      
      {/* Capa de color con opacidad */}
      <div className="absolute inset-0 bg-green-600 opacity-70"></div>
      
      {/* Contenido */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-blue-100 mb-6">Blog Fluent Phrases</h2>
        <p className="text-blue-100 mb-8 text-2xl">
        🌍 Aprender inglés nunca ha sido tan fácil 🚀. Descubre consejos prácticos, estrategias efectivas y recursos útiles para mejorar tu aprendizaje. ¡Visita nuestro blog y empieza a explorar hoy mismo! 📚✨
        </p>
        <a 
  href="/blog" 
  target="_blank" 
  rel="noopener noreferrer"
  className="inline-block font-black bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
>
  Explorar Blog
</a>
      </div>
    </section>

      {showSignInModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full my-8">
            <button
              onClick={() => setShowSignInModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="p-6 max-h-[90vh] overflow-y-auto">
              <SignInForm onAuthSuccess={handleAuthSuccess} />
            </div>
          </div>
        </div>
      )}

      {showSignUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full my-8">
            <button
              onClick={() => setShowSignUpModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="p-6 max-h-[90vh] overflow-y-auto">
              <SignUpForm />
            </div>
          </div>
        </div>
      )}

      <footer className="w-full text-gray-300 mt-8 bg-blue-700">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <img src={logo} alt="Logo" className="w-24 h-24"/>
              <p className="text-sm">
                Transformando el aprendizaje de idiomas a través de la tecnología y la innovación.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('home')} className="hover:text-white transition-colors">Inicio</button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">Sobre Nosotros</button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('plans')} className="hover:text-white transition-colors">Planes</button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('blog')} className="hover:text-white transition-colors">Blog</button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Contacto</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:contact@example.com" className="hover:text-white transition-colors">
                    Info@fluentphrases.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+1234567890" className="hover:text-white transition-colors">
                    +54-1162908729
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>CIUDAD DE BUENOS AIRES, ARGENTINA</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Síguenos</h3>
              <div className="flex space-x-4 mb-6">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-pink-500 transition-colors"
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-500 transition-colors"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href="https://vm.tiktok.com/ZMknnp6g5/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <FaTiktok size={24} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm">
                © {currentYear} Fluent Phrases. Todos los derechos reservados.
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="/privacy" className="hover:text-white transition-colors">
                  Política de Privacidad
                </a>
                <a href="/terms" className="hover:text-white transition-colors">
                  Términos de Uso
                </a>
                <a href="/cookies" className="hover:text-white transition-colors">
                  Política de Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};