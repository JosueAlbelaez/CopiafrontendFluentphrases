
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Función para agregar el artículo de prueba
export const addTestBlogPost = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([
      {
        title: "5 Técnicas Efectivas para Aprender Inglés Naturalmente",
        content: `
          <h2>1. Inmersión en Contenido Auténtico</h2>
          <p>Una de las formas más efectivas de aprender inglés es rodearte de contenido auténtico. Esto significa consumir medios en inglés que fueron creados para hablantes nativos, no para estudiantes del idioma.</p>
          
          <h2>2. Práctica Diaria con Frases Contextualizadas</h2>
          <p>En lugar de memorizar palabras aisladas, es más efectivo aprender frases completas en contexto. Esto te ayuda a entender cómo se usa naturalmente el lenguaje.</p>
          
          <h2>3. Escucha Activa</h2>
          <p>Dedicar tiempo a escuchar el idioma es crucial. Podcasts, películas y series en inglés son excelentes recursos para mejorar tu comprensión auditiva.</p>
          
          <h2>4. Habla desde el Primer Día</h2>
          <p>No esperes a tener un nivel "perfecto" para comenzar a hablar. Practica desde el primer día, incluso si cometes errores.</p>
          
          <h2>5. Uso de Tecnología y Apps</h2>
          <p>Aprovecha las herramientas tecnológicas disponibles. Apps como FluentPhrases te permiten practicar con frases útiles y recibir retroalimentación inmediata.</p>
        `,
        image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
        summary: "Descubre las técnicas más efectivas para aprender inglés de manera natural y mantener una práctica consistente.",
        reading_time: 5,
        category: "Métodos de Aprendizaje",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
    .select();

  if (error) {
    console.error('Error adding test blog post:', error);
    return null;
  }

  return data;
};
