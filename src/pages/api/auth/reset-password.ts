import { connectDB } from '@/lib/config/db';
import { User } from '@/lib/models/User';
import { verifyToken } from '@/lib/utils/jwt';
import bcrypt from 'bcryptjs';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    const { token, password } = req.body;
    
    console.log('Iniciando restablecimiento de contraseña');
    
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      console.log('Token inválido o expirado');
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      console.log('Usuario no encontrado o token expirado');
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    // Generar el hash de la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Nuevo hash generado:', hashedPassword);

    // Actualizar la contraseña y limpiar los tokens
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    console.log('Contraseña actualizada exitosamente para:', user.email);

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error en restablecimiento de contraseña:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}