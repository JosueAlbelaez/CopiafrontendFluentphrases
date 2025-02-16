import express from 'express';
import cors from 'cors';
import { connectDB } from './src/lib/config/db';
import { User } from './src/lib/models/User';
import { Phrase } from './src/lib/models/Phrase';
import { generateToken, verifyToken } from './src/lib/utils/jwt';
import { startOfDay } from 'date-fns';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { sendPasswordResetEmail, sendVerificationEmail } from './src/lib/utils/email';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

// Definición del modelo BlogPost
const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  image_url: String,
  summary: String,
  reading_time: Number,
  category: String,
  created_at: { 
    type: Date, 
    default: Date.now,
    required: true 
  },
  updated_at: { 
    type: Date, 
    default: Date.now,
    required: true 
  }
}, {
  timestamps: { 
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// Categorías gratuitas
const FREE_CATEGORIES = ['Greeting and Introducing', 'Health and Wellness'];

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(403).json({ error: 'Token inválido' });
  }
};

// Configurar MercadoPago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || '' 
});

// Rutas de autenticación
app.post('/api/auth/signup', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Generar token de verificación
    const verificationToken = generateToken({ email }, '24h');

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role: 'free',
      isEmailVerified: false,
      verificationToken,
      dailyPhrasesCount: 0,
      lastPhrasesReset: new Date()
    });

    await user.save();

    // Enviar correo de verificación
    try {
      await sendVerificationEmail(email, verificationToken);
      console.log('Correo de verificación enviado exitosamente');
    } catch (emailError) {
      console.error('Error al enviar correo de verificación:', emailError);
      // No retornamos error al cliente, pero logueamos el problema
    }

    res.status(201).json({
      message: 'Usuario registrado exitosamente. Por favor verifica tu correo electrónico.'
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Ruta para verificar email
app.post('/api/auth/verify-email', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token no proporcionado' });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.email) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    const user = await User.findOne({ 
      email: decoded.email,
      verificationToken: token
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado o token inválido' });
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verificado exitosamente' });
  } catch (error) {
    console.error('Error en verificación de email:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.post('/api/auth/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('Intento de inicio de sesión para:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('Usuario no encontrado:', email);
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el correo está verificado
    if (!user.isEmailVerified) {
      return res.status(403).json({ 
        error: 'Por favor verifica tu correo electrónico antes de iniciar sesión'
      });
    }

    console.log('Usuario encontrado, verificando contraseña');
    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      console.log('Contraseña incorrecta para usuario:', email);
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    console.log('Inicio de sesión exitoso para:', email);
    const token = generateToken({ userId: user._id });

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en inicio de sesión:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.post('/api/auth/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    console.log('Recibida solicitud de recuperación para:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('Usuario no encontrado:', email);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.log('Usuario encontrado:', user._id);
    const resetToken = generateToken({ userId: user._id }, '30m');

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 1800000); // 30 minutos
    await user.save();
    console.log('Token guardado en la base de datos');

    try {
      const emailInfo = await sendPasswordResetEmail(email, resetToken);
      console.log('Correo enviado exitosamente:', emailInfo);
      res.json({
        message: 'Se ha enviado un correo con las instrucciones',
        debug: emailInfo
      });
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      // Revertir los cambios en el usuario si el correo falla
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      throw new Error('Error al enviar el correo de recuperación');
    }
  } catch (error: any) {
    console.error('Error en recuperación:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.post('/api/auth/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ error: 'Token y contraseña son requeridos' });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    // Modificamos esta parte para usar el método setPassword del modelo
    user.password = password; // El hasheo se hará automáticamente por el middleware pre('save')
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error en restablecimiento de contraseña:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Rutas de frases
app.get('/api/phrases', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { language, category } = req.query;
    const user = req.user!;

    // Solo resetear el contador para usuarios gratuitos
    if (user.role === 'free') {
      const today = startOfDay(new Date());
      const lastReset = startOfDay(user.lastPhrasesReset);

      if (today > lastReset) {
        user.dailyPhrasesCount = 0;
        user.lastPhrasesReset = new Date();
        await user.save();
      }
    }

    // Construir la consulta de frases
    const query: any = {};
    
    if (language) {
      query.language = language;
    }
    
    if (category) {
      query.category = category;
    }

    // Para usuarios gratuitos, solo mostrar frases de categorías gratuitas
    if (user.role === 'free') {
      query.category = { $in: FREE_CATEGORIES };
    }

    // Obtener todas las frases que cumplan con los criterios
    const phrases = await Phrase.find(query);

    res.json({
      phrases,
      userInfo: {
        role: user.role,
        dailyPhrasesCount: user.dailyPhrasesCount
      }
    });
  } catch (error) {
    console.error('Error al obtener frases:', error);
    res.status(500).json({ error: 'Error al obtener frases' });
  }
});

// Ruta para incrementar el contador de frases
app.post('/api/phrases/increment', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    
    // Solo incrementar para usuarios gratuitos
    if (user.role === 'free') {
      if (user.dailyPhrasesCount >= 20) {
        return res.status(403).json({ error: 'Has alcanzado el límite diario de frases' });
      }

      user.dailyPhrasesCount += 1;
      await user.save();
    }

    res.json({
      dailyPhrasesCount: user.dailyPhrasesCount
    });
  } catch (error) {
    console.error('Error al incrementar contador:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Ruta para crear preferencia de MercadoPago
app.post('/api/create-preference', async (req: Request, res: Response) => {
  try {
    const { title, price, currency } = req.body;

    const preference = new Preference(client);
    const preferenceData = {
      body: {
        items: [
          {
            id: `ITEM-${Date.now()}`,
            title,
            unit_price: Number(price),
            currency_id: currency,
            quantity: 1,
            description: `Suscripción a ${title}`,
            category_id: 'subscriptions'
          }
        ],
        back_urls: {
          success: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/success`,
          failure: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/failure`,
          pending: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pending`
        },
        auto_return: 'approved',
        statement_descriptor: 'Fluent Phrases'
      }
    };

    const response = await preference.create(preferenceData);
    res.json({
      id: response.id,
      init_point: response.init_point
    });
  } catch (error) {
    console.error('Error creating preference:', error);
    res.status(500).json({ error: 'Error al crear la preferencia de pago' });
  }
});

// Rutas del Blog
app.get('/api/blog', async (_req: Request, res: Response) => {
  try {
    const posts = await BlogPost.find().sort({ created_at: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los posts' });
  }
});

app.get('/api/blog/:id', async (req: Request, res: Response) => {
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

app.post('/api/blog/test', async (_req: Request, res: Response) => {
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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

export default app;
