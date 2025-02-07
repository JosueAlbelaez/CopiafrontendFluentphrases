
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaLinkedin, FaInstagram, FaTiktok } from 'react-icons/fa';
import { useTheme } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { PhrasesContainer } from './components/phrases/PhrasesContainer';
import { ToastContainer } from './hooks/use-toast';
import { ResetPasswordForm } from './components/auth/ResetPasswordForm';
import { Route, Routes } from 'react-router-dom';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { PricingModal } from './components/subscription/PricingModal';
import logo from './assets/logo.png';

const languages = ['English']; //, 'Portuguese'
const DEFAULT_LANGUAGE = 'English';
const FREE_CATEGORIES = ['Greeting and Introducing', 'Health and Wellness'];

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
  const { isDarkMode } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(DEFAULT_LANGUAGE);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [typedText, setTypedText] = useState('');
  const currentYear = new Date().getFullYear();
  const [user, setUser] = useState<any>(null);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setSelectedCategory('');
  };

  const handleCategoryChange = (category: string) => {
    const isFreeCategory = FREE_CATEGORIES.includes(category);
    const isPremiumUser = user?.role?.includes('premium');
    
    if (!isFreeCategory && !isPremiumUser) {
      setShowPricingModal(true);
      return;
    }
    
    setSelectedCategory(category);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
    localStorage.clear();
  };

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

  return (
    <div className={`min-h-screen flex flex-col ${
      isDarkMode
        ? 'bg-gray-900'
        : selectedLanguage === 'Portuguese'
        ? 'bg-gradient-to-b from-green-400 to-green-800'
        : 'bg-gradient-to-b from-blue-400 to-blue-800'
    }`}>
      <Header 
        user={user} 
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        <Routes>
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/" element={
            <div className="max-w-4xl mx-auto px-4 py-8">
              <div className={`text-center mb-8 ${isDarkMode ? 'text-yellow-400 drop-shadow-md' : 'text-green-200 drop-shadow-md' }`}>
                <p className="text-lg font-bold min-h-[28px]">{typedText}</p>
              </div>

              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white/70'} rounded-xl shadow-md overflow-hidden`}>
                <div className="p-6">
                  <div className="space-y-4">
                    <select
                      className={`w-full p-2 border rounded ${
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
                          const isDisabled = !user?.role?.includes('premium') && !isFreeCategory;
                          
                          return (
                            <option 
                              key={category} 
                              value={category}
                              disabled={isDisabled}
                            >
                              {category} {isDisabled ? '🔒' : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <PhrasesContainer
                      language={selectedLanguage}
                      category={selectedCategory}
                    />
                  </div>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </main>

      <PricingModal 
        isOpen={showPricingModal} 
        onClose={() => setShowPricingModal(false)} 
      />

      <ToastContainer />

      <footer className={`w-full text-gray-300 mt-8 ${isDarkMode ? 'bg-gray-900' : 'bg-blue-700'}`}>
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
