
import axios from 'axios';

interface CreatePreferenceResponse {
  id: string;
  init_point: string;
}

export const createPreference = async (title: string, price: number, currency: string = 'ARS'): Promise<string> => {
  try {
    const response = await axios.post('/api/create-preference', {
      title,
      price,
      currency
    });
    
    const data = response.data as CreatePreferenceResponse;
    return data.init_point;
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    throw error;
  }
};
