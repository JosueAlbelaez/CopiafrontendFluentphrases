
import { connectDB } from '@/lib/config/db';
import { User } from '@/lib/models/User';
import { generateToken } from '@/lib/utils/jwt';
import { sendPasswordResetEmail } from '@/lib/utils/email';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { email } = req.body;
    console.log('Attempting password reset for email:', email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const resetToken = generateToken({ userId: user._id }, '1h');
    console.log('Generated reset token');
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora
    await user.save();
    console.log('Updated user with reset token');

    try {
      await sendPasswordResetEmail(email, resetToken);
      console.log('Password reset email sent successfully');
      res.json({ message: 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña' });
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      // Revertir los cambios en el usuario si el correo falla
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      throw new Error('Error al enviar el correo de recuperación');
    }
  } catch (error: any) {
    console.error('Error en recuperación de contraseña:', error);
    res.status(500).json({ error: error.message || 'Error en el servidor' });
  }
}
