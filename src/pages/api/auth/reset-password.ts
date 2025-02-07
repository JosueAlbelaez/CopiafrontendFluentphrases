import { connectDB } from '@/lib/config/db';
import { User } from '@/lib/models/User';
import express from 'express';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email y nueva contraseña son requeridos' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.log(`[Reset Password] Usuario encontrado: ${user.email}`);
    console.log(`[Reset Password] Hash actual en BD: ${user.password}`);

    // Asegurar que la nueva contraseña no tenga espacios en blanco
    const cleanPassword = newPassword.trim();
    console.log(`[Reset Password] Contraseña limpia: "${cleanPassword}"`);

    // Generar un nuevo hash para la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(cleanPassword, salt);
    console.log(`[Reset Password] Nuevo hash generado: ${hashedPassword}`);

    // Actualizar la contraseña en la base de datos
    user.password = hashedPassword;
    await user.save();

    console.log(`[Reset Password] Hash almacenado en BD después de actualización: ${user.password}`);

    res.status(200).json({ message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    console.error('Error en reset-password:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

