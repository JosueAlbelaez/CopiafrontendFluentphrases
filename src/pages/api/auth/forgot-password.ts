
import { connectDB } from '@/lib/config/db';
import { User } from '@/lib/models/User';
import { generateToken } from '@/lib/utils/jwt';
import nodemailer from 'nodemailer';

const FRONTEND_URL = 'http://localhost:8080';
const EMAIL_USER = 'info.fluentphrases@gmail.com';
const EMAIL_PASSWORD = 'ptqbzewejjrclzhp';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const resetToken = generateToken({ userId: user._id }, '1h');
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
      }
    });

    const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'Restablecer contraseña',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2b6cb0;">Restablecer contraseña</h1>
          <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #48bb78; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Restablecer contraseña
            </a>
          </div>
          <p style="color: #718096; font-size: 14px;">Este enlace expirará en 1 hora.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="color: #718096; font-size: 12px;">Si no solicitaste restablecer tu contraseña, puedes ignorar este correo.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña' });
  } catch (error) {
    console.error('Error en recuperación de contraseña:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}
