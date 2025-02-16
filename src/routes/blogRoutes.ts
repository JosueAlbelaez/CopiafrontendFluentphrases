
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Definimos el esquema para los posts del blog
const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  image_url: String,
  summary: String,
  reading_time: Number,
  category: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Creamos el modelo
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// Ruta para obtener todos los posts
router.get('/', async (_req, res) => {
  try {
    const posts = await BlogPost.find().sort({ created_at: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los posts' });
  }
});

// Ruta para crear un post de prueba
router.post('/test', async (_req, res) => {
  try {
    const testPost = new BlogPost({
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
      category: "Métodos de Aprendizaje"
    });

    const savedPost = await testPost.save();
    res.json(savedPost);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el post de prueba' });
  }
});

export default router;
