
import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import { connectDB } from './src/lib/config/db';
import userRoutes from './src/routes/userRoutes';
import blogRoutes from './src/routes/blogRoutes';

config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/blog', blogRoutes);

// Error handling middleware
app.use((_err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(_err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
