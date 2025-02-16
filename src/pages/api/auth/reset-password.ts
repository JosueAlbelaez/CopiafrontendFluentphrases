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
    
    console.log('Starting password reset process');
    
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      console.log('Invalid or expired token');
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      console.log('User not found or token expired');
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    // Let the pre-save middleware handle the password hashing
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    console.log('Saving new password for user:', user.email);
    await user.save();
    
    console.log('Password updated successfully');

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error in password reset:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}