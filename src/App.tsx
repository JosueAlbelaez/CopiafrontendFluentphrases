import { useState, useEffect } from 'react';
import { Home, Sun, Moon, Mail, Phone, MapPin, Lock, LogOut } from 'lucide-react';
import { FaLinkedin, FaInstagram, FaTiktok } from 'react-icons/fa';
import { useTheme } from './contexts/ThemeContext';
import VoiceRecorder from './components/VoiceRecorder';
import { PhrasesContainer } from './components/phrases/PhrasesContainer';
import { DefaultView } from './components/phrases/DefaultView';
import { TableView } from './components/phrases/TableView';
import { SignInForm } from './components/auth/SignInForm';
import { SignUpForm } from './components/auth/SignUpForm';
import { FreeLimitAlert } from './components/phrases/FreeLimitAlert';
import { PhraseProgress } from './components/phrases/PhraseProgress';
import logo from './assets/logo.png';

const languages = ['English']; //, 'Portuguese'
const DEFAULT_LANGUAGE = 'English';
const FREE_CATEGORIES = ['Greeting and Introducing', 'Health and Wellness'];

const TABLE_VIEW_CATEGORIES = [
  '1000 Nouns',
  'Adjectives and Adverbs',
  'Prepositions and Conjunctions',
  'Articles, Determiners and Interjections'
];

const categories = {
  English: [
    'Greeting and Introducing', '1000 Nouns', 'Adjectives and Adverbs', 'Prepositions and Conjunctions', 'Articles, Determiners and Interjections', 
    'Health and Wellness', 'Shopping and Business', 'Travel and Tourism', 'Family and Personal Relationships', 'Work and Professions',
    'Education and Learning', 'Food and Restaurants', 'Emergencies and Safety',
    'Entertainment and Leisure', 'Technology and Communication', 'Culture and Society',
    'Sports and Outdoor Activities', 'Advanced Idioms and Expressions', 'Opinions and Debates',
    'Environment and Sustainability', 'Professional Networking and Business Jargon',
    'Psychology and Emotions', 'Literature and Arts', 'Cultural Traditions and Festivals',
    'Science and Innovation', 'Politics and Current Events', 'History and Historical Events',
    'Law and Legal Terminology', 'Advanced Debate and Rhetoric', 'Travel for Study or Work Abroad',
    'Financial and Investment Terminology', 'Philosophy and Ethics', 'Development and Software Engineering'
  ],
  Portuguese: [
    'Cumprimentos e Apresentações', 'Diretrizes Básicas', 'Procedimentos em Escritórios',
    'Família e Casa', 'Saúde e Bem-Estar', 'Compras e Negócios',
    'Viagem e Turismo', 'Família e Relacionamentos Pessoais', 'Trabalho e Profissões',
    'Educação e Aprendizagem', 'Comida e Restaurantes', 'Emergências e Segurança',
    'Entretenimento e Lazer', 'Tecnologia e Comunicação', 'Cultura e Sociedade',
    'Opiniões e Debates'
  ]
};

function App() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(DEFAULT_LANGUAGE);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [typedText, setTypedText] = useState('');
  const [showAuthModal, setShowAuthModal] = useState<'signin' | 'signup' | null>(null);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [user, setUser] = useState<any>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setSelectedCategory('');
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  // Efecto de máquina de escribir
  useEffect(() => {
    const text = 'Elige la categoría, practica, pronuncia, DIVIÉRTETE';
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;
    
    const typeNextCharacter = () => {
      if (currentIndex <= text.length) {
        setTypedText(text.slice(0, currentIndex));
        currentIndex++;
        timeoutId = setTimeout(typeNextCharacter, 50);
      }
    };

    typeNextCharacter();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setTypedText('');
    };
  }, []);

  const isPremiumUser = user?.role === 'premium' || user?.role === 'admin';

  return (
    <div className={`min-h-screen flex flex-col ${
      isDarkMode
        ? 'bg-gray-900'
        : selectedLanguage === 'Portuguese'
        ? 'bg-gradient-to-b from-green-400 to-green-800'
        : 'bg-gradient-to-b from-blue-400 to-blue-800'
    }`}>
      <header className="flex flex-col py-4 mb-6 max-w-4xl mx-auto w-full px-4">
        <div className="flex justify-between items-center w-full mb-2">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="w-20 h-20" />
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Inicio</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <span className="text-gray-700 dark:text-gray-200">
                Hola, {user.firstName}
              </span>
            )}
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-6 h-6 text-yellow-400" />
              ) : (
                <Moon className="w-6 h-6 text-gray-800" />
              )}
            </button>

            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar sesión</span>
              </button>
            )}
          </div>
        </div>

        <div className={`text-center ${isDarkMode ? 'text-yellow-400' : 'text-gray-800'}`}>
          <p className="text-lg font-bold min-h-[28px]">{typedText}</p>
        </div>
      </header>

      <div className={`max-w-4xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white/70'} rounded-xl shadow-md overflow-hidden flex-grow`}>
        <div className="p-2 sm:p-8">
          <div className="mb-4">
            <select
              className={`w-full p-2 border rounded mb-4 ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''
              }`}
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>

            <div className="relative">
              <select
                className={`w-full p-2 border rounded ${
                  isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''
                }`}
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categories[selectedLanguage as keyof typeof categories].map((category) => {
                  const isFreeCategory = FREE_CATEGORIES.includes(category);
                  const isDisabled = !isPremiumUser && !isFreeCategory;
                  
                  return (
                    <option 
                      key={category} 
                      value={category}
                      disabled={isDisabled}
                    >
                      {category} {!isPremiumUser && !isFreeCategory ? '🔒' : ''}
                    </option>
                  );
                })}
              </select>
              {!isPremiumUser && selectedCategory && !FREE_CATEGORIES.includes(selectedCategory) && (
                <div className={`absolute top-full left-0 right-0 mt-2 p-3 rounded-lg shadow-lg ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-yellow-500" />
                    <p className="text-sm">
                      Esta categoría está disponible solo para usuarios premium
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <PhrasesContainer
            language={selectedLanguage}
            category={selectedCategory}
          >
            {(phrases, incrementCount) => (
              TABLE_VIEW_CATEGORIES.includes(selectedCategory)
                ? <TableView phrases={phrases} incrementCount={incrementCount} isDarkMode={isDarkMode} />
                : <DefaultView phrases={phrases} incrementCount={incrementCount} isDarkMode={isDarkMode} />
            )}
          </PhrasesContainer>
        </div>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            {showAuthModal === 'signin' ? (
              <SignInForm onAuthSuccess={() => setShowAuthModal(null)} />
            ) : (
              <SignUpForm onAuthSuccess={() => setShowAuthModal(null)} />
            )}
            <button
              onClick={() => setShowAuthModal(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {showLimitAlert && (
        <FreeLimitAlert
          isOpen={showLimitAlert}
          onClose={() => setShowLimitAlert(false)}
        />
      )}

      <footer className="w-full bg-gray-900 text-gray-300 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <img src={logo} alt="Logo" className="w-24 h-24"/>
              <p className="text-sm">
                Transformando el aprendizaje de idiomas a través de la tecnología y la innovación.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="hover:text-white transition-colors">Inicio</a>
                </li>
                <li>
                  <a href="/about" className="hover:text-white transition-colors">Sobre Nosotros</a>
                </li>
                <li>
                  <a href="/pricing" className="hover:text-white transition-colors">Planes</a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-white transition-colors">Blog</a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
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

            {/* Social Media & Newsletter */}
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
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <FaTiktok size={24} />
                </a>
              </div>
              <a
                href="/contact"
                className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Contactar
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
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
}

export default App;