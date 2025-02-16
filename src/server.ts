
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectDB } from './lib/config/db';
import userRoutes from './routes/userRoutes';
import blogRoutes from './routes/blogRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a la base de datos
connectDB();

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/blog', blogRoutes);

// Ruta base
app.get('/', (_, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
