import nodemailer from 'nodemailer';

const EMAIL_USER = 'info.fluentphrases@gmail.com';
const EMAIL_PASSWORD = 'ptqbzewejjrclzhp';
const FRONTEND_URL = 'http://localhost:8080';

console.log('Configurando transporter con:', {
  user: EMAIL_USER,
  frontendUrl: FRONTEND_URL
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true,
  logger: true
});

// Verificar la conexión al iniciar
transporter.verify(function(error) {
  if (error) {
    console.error('Error al verificar el transporter:', error);
  } else {
    console.log('Servidor listo para enviar correos');
  }
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${token}`;
  console.log('URL de verificación generada:', verificationUrl);
  
  const mailOptions = {
    from: {
      name: 'Fluent Phrases',
      address: EMAIL_USER
    },
    to: email,
    subject: 'Verifica tu correo electrónico - Fluent Phrases',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2b6cb0;">¡Bienvenido a Fluent Phrases!</h1>
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
    return info;
  } catch (err) {
    const error = err as Error;
    console.error('Error detallado al enviar correo de verificación:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;
  console.log('Generando URL de recuperación:', resetUrl);

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Restablecer contraseña - Fluent Phrases',
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
        <p style="color: #718096; font-size: 14px;">Este enlace expirará en 30 minutos.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #718096; font-size: 12px;">Si no solicitaste restablecer tu contraseña, puedes ignorar este correo.</p>
      </div>
    `
  };

  try {
    console.log('Intentando enviar correo a:', email);
    console.log('Opciones de correo:', JSON.stringify(mailOptions, null, 2));
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Respuesta del servidor:', info.response);
    console.log('ID del mensaje:', info.messageId);
    return info;
  } catch (error: any) {
    console.error('Error al enviar correo:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
}
