import axios from 'axios';

interface CreatePreferenceResponse {
  id: string;
  init_point: string;
}

export const createPreference = async (title: string, priceUSD: number): Promise<string> => {
  try {
    const response = await axios.post('/api/create-preference', {
      title,
      price: priceUSD,
      currency: 'USD'  // Siempre enviamos en USD
    });
    
    const data = response.data as CreatePreferenceResponse;
    return data.init_point;
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    throw error;
  }
};