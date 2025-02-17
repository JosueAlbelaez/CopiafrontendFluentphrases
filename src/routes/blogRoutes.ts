
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

// Ruta para obtener un post específico
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el post' });
  }
});

// Ruta para crear un post de prueba
router.post('/test', async (_req, res) => {
  try {
    const testPost = new BlogPost({
      title: "5 Técnicas Efectivas para Aprender Inglés Naturalmente",
      content: `
        <h2>Introducción al Aprendizaje de Inglés</h2>
        <p>Comenzar a aprender inglés puede parecer desafiante, pero con las técnicas correctas, puede ser un proceso natural y efectivo.</p>
        
        <h3>¿Por qué es importante el inglés?</h3>
        <p>El inglés es fundamental en el mundo globalizado actual, tanto para oportunidades profesionales como personales.</p>
        
        <h4>Beneficios del Aprendizaje Natural</h4>
        <p>El aprendizaje natural permite una mejor retención y una comprensión más profunda del idioma.</p>
        
        <h2>1. Inmersión en Contenido Auténtico</h2>
        <p>Una de las formas más efectivas de aprender inglés es rodearte de contenido auténtico. Esto significa consumir medios en inglés que fueron creados para hablantes nativos.</p>
        
        <h3>Tipos de Contenido Recomendado</h3>
        <p>Explora diferentes tipos de contenido como películas, series, podcasts y libros en inglés.</p>
        
        <h4>Consejos para la Inmersión</h4>
        <p>Comienza con contenido que tenga subtítulos y gradualmente transiciona a audio puro en inglés.</p>
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
