import axios from 'axios';

const API_URL = '/api'; // Cambiamos esto para usar el proxy configurado

// Configurar interceptor para agregar el token a todas las peticiones
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export interface Phrase {
  _id: string;
  language: string;
  category: string;
  targetText: string;
  translatedText: string;
}

export const getRandomPhrase = async (language: string, category?: string, count: number = 10): Promise<Phrase[]> => {
  try {
    const response = await axios.get(`${API_URL}/phrases`, {
      params: { language, category, count }
    });
    return response.data.phrases;
  } catch (error) {
    console.error('Error fetching random phrases:', error);
    throw error;
  }
};

export const getPhrasesByCategory = async (language: string, category: string): Promise<Phrase[]> => {
  try {
    const response = await axios.get(`${API_URL}/phrases`, {
      params: { language, category }
    });
    return response.data.phrases;
  } catch (error) {
    console.error('Error fetching phrases by category:', error);
    throw error;
  }
};

export const incrementPhraseCount = async (): Promise<void> => {
  try {
    await axios.post(`${API_URL}/phrases/increment`);
  } catch (error) {
    console.error('Error incrementing phrase count:', error);
    throw error;
  }
};
