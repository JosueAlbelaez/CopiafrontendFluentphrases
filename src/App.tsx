import { useState, useEffect } from 'react';
import { useTheme } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { PhrasesContainer } from './components/phrases/PhrasesContainer';
import { ToastContainer } from '@/hooks/use-toast';
import { ResetPasswordForm } from './components/auth/ResetPasswordForm';
import { Route, Routes } from 'react-router-dom';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { PricingModal } from './components/subscription/PricingModal';
import { PremiumBanner } from './components/subscription/PremiumBanner';
import VerifyEmail from './pages/VerifyEmail';
import { CookieBanner } from './components/CookieBanner';
import { LandingPage } from './pages/LandingPage';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { CookiesPolicy } from './pages/CookiesPolicy';

const languages = ['English'];
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
  ]
};

function App() {
  const { isDarkMode } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(languages[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [typedText, setTypedText] = useState('');
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setSelectedCategory('');
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
    if (!FREE_CATEGORIES.includes(category) && (!user || (user?.role !== 'premium' && user?.role !== 'admin'))) {
      setShowPricingModal(true);
      return;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      }
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

  const isPremiumUser = user?.role === 'premium' || user?.role === 'admin';

  return (
    <div className={`min-h-screen flex flex-col ${
      isDarkMode
        ? 'bg-gray-900'
        : selectedLanguage === 'Portuguese'
        ? 'bg-gradient-to-b from-green-400 to-green-800'
        : 'bg-gradient-to-b from-blue-400 to-blue-800'
    }`}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={
          <>
            <Header user={user} onLogout={handleLogout} />
            <main className="flex-grow">
              {!isPremiumUser && (
                <PremiumBanner onUpgrade={() => setShowPricingModal(true)} userRole={user?.role} />
              )}

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
                            return (
                              <option 
                                key={category} 
                                value={category}
                              >
                                {category} {!isFreeCategory && !isPremiumUser ? '🔒' : ''}
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
            </main>
          </>
        } />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/cookies" element={<CookiesPolicy />} />
      </Routes>

      <CookieBanner />
      <ToastContainer />
      
      <PricingModal 
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />
    </div>
  );
}

export default App;
