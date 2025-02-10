
import axios from 'axios';

interface CreatePreferenceResponse {
  id: string;
  init_point: string;
}

// Definimos las monedas soportadas por país
const COUNTRY_CURRENCIES = {
  AR: { currency: 'ARS', country: 'Argentina' },
  CL: { currency: 'CLP', country: 'Chile' },
  MX: { currency: 'MXN', country: 'México' },
  PE: { currency: 'PEN', country: 'Perú' },
  CO: { currency: 'COP', country: 'Colombia' },
  UY: { currency: 'UYU', country: 'Uruguay' },
  BR: { currency: 'BRL', country: 'Brasil' },
  // Podemos agregar más países según sea necesario
  DEFAULT: { currency: 'USD', country: 'Internacional' }
};

// Función para obtener el país del usuario
const getUserCountry = async (): Promise<string> => {
  try {
    const response = await axios.get('https://ipapi.co/json/');
    return response.data.country_code;
  } catch (error) {
    console.error('Error getting user country:', error);
    return 'DEFAULT';
  }
};

// Función para convertir precio de USD a moneda local
const convertToLocalCurrency = async (usdPrice: number, targetCurrency: string): Promise<number> => {
  if (targetCurrency === 'USD') return usdPrice;
  
  try {
    // Usar API de conversión (ejemplo con exchangerate-api.com)
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/USD/${targetCurrency}/${usdPrice}`
    );
    return response.data.conversion_result;
  } catch (error) {
    console.error('Error converting currency:', error);
    // En caso de error, retornamos una conversión aproximada para ARS
    if (targetCurrency === 'ARS') return usdPrice * 850;
    return usdPrice;
  }
};

export const createPreference = async (title: string, priceUSD: number): Promise<string> => {
  try {
    // Obtener el país del usuario
    const countryCode = await getUserCountry();
    const { currency } = COUNTRY_CURRENCIES[countryCode as keyof typeof COUNTRY_CURRENCIES] || COUNTRY_CURRENCIES.DEFAULT;
    
    // Convertir el precio a la moneda local
    const localPrice = await convertToLocalCurrency(priceUSD, currency);

    console.log(`Converting ${priceUSD} USD to ${currency}:`, localPrice);

    const response = await axios.post('/api/create-preference', {
      title,
      price: localPrice,
      currency
    });
    
    const data = response.data as CreatePreferenceResponse;
    return data.init_point;
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    throw error;
  }
};
