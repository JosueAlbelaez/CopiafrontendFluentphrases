
import { connectDB } from '@/lib/config/db';
import { User } from '@/lib/models/User';
import { generateToken } from '@/lib/utils/jwt';
import { sendPasswordResetEmail } from '@/lib/utils/email';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    console.log('Conexión a la base de datos establecida');

    const { email } = req.body;
    console.log('Intentando recuperación de contraseña para:', email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log('Usuario no encontrado para el email:', email);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.log('Usuario encontrado:', user._id);

    const resetToken = generateToken({ userId: user._id }, '1h');
    console.log('Token de recuperación generado');
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora
    await user.save();
    console.log('Usuario actualizado con token de recuperación');

    try {
      const emailInfo = await sendPasswordResetEmail(email, resetToken);
      console.log('Correo de recuperación enviado exitosamente:', emailInfo);
      res.json({ 
        message: 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña',
        debug: {
          emailSent: true,
          messageId: emailInfo.messageId,
          response: emailInfo.response
        }
      });
    } catch (emailError) {
      console.error('Error detallado al enviar correo de recuperación:', emailError);
      // Revertir los cambios en el usuario si el correo falla
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      throw new Error('Error al enviar el correo de recuperación');
    }
  } catch (error: any) {
    console.error('Error en recuperación de contraseña:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: error.message || 'Error en el servidor',
      debug: {
        errorMessage: error.message,
        stack: error.stack
      }
    });
  }
}
