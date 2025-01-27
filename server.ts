import express from 'express';
import cors from 'cors';
import { connectDB } from './src/lib/config/db';
import { User } from './src/lib/models/User';
import { Phrase } from './src/lib/models/Phrase';
import { generateToken, verifyToken } from './src/lib/utils/jwt';
import { startOfDay } from 'date-fns';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

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

// Rutas de autenticación
app.post('/api/auth/signup', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role: 'free',
      isEmailVerified: true,
      dailyPhrasesCount: 0,
      lastPhrasesReset: new Date()
    });

    await user.save();

    const token = generateToken({ userId: user._id });

    res.status(201).json({
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
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.post('/api/auth/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});