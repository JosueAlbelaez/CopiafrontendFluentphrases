
import { connectDB } from '@/lib/config/db';
import { User } from '@/lib/models/User';
import { verifyToken } from '@/lib/utils/jwt';

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

    console.log('Token válido, buscando usuario:', decoded.userId);

    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      console.log('Usuario no encontrado o token expirado');
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    // Actualizamos directamente el password sin hashear, dejando que el middleware del modelo lo haga
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    console.log('Guardando nueva contraseña para usuario:', user.email);
    await user.save();

    console.log('Contraseña actualizada exitosamente para:', user.email);

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error en restablecimiento de contraseña:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}
