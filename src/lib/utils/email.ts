
import nodemailer from 'nodemailer';

const EMAIL_USER = 'info.fluentphrases@gmail.com';
const EMAIL_PASSWORD = 'ptqbzewejjrclzhp';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// Crear el transporter con logs detallados
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  },
  debug: true, // Habilitar logs detallados
  logger: true // Habilitar logger
});

// Verificar la conexión al iniciar
transporter.verify(function(error, success) {
  if (error) {
    console.error('Error al verificar el transporter:', error);
  } else {
    console.log('Servidor listo para enviar correos');
  }
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Verifica tu correo electrónico',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2b6cb0;">¡Bienvenido a nuestra aplicación!</h1>
        <p>Gracias por registrarte. Para completar tu registro y comenzar a usar la aplicación, por favor verifica tu correo electrónico:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #48bb78; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verificar correo electrónico
          </a>
        </div>
        <p style="color: #718096; font-size: 14px;">Este enlace expirará en 24 horas.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #718096; font-size: 12px;">Si no creaste esta cuenta, puedes ignorar este correo.</p>
      </div>
    `
  };

  try {
    console.log('Intentando enviar correo de verificación a:', email);
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de verificación enviado:', info.response);
    console.log('ID del mensaje:', info.messageId);
    console.log('URL de vista previa:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error detallado al enviar correo de verificación:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;
  console.log('Reset URL:', resetUrl);

  const mailOptions = {
    from: `Fluent Phrases <${EMAIL_USER}>`,
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

  try {
    console.log('Intentando enviar correo de recuperación a:', email);
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de recuperación enviado:', info.response);
    console.log('ID del mensaje:', info.messageId);
    console.log('URL de vista previa:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error detallado al enviar correo de recuperación:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
};
