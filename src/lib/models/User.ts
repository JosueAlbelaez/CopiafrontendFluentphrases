import mongoose, { Model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser {
  _id?: Types.ObjectId | string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'free' | 'premium' | 'admin';
  isEmailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  dailyPhrasesCount: number;
  lastPhrasesReset: Date;
}

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['free', 'premium', 'admin'],
    default: 'free'
  },
  isEmailVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  dailyPhrasesCount: { type: Number, default: 0 },
  lastPhrasesReset: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    console.log('Contraseña no modificada, saltando hash');
    return next();
  }

  try {
    console.log('Hasheando contraseña para:', this.email);
    const salt = await bcrypt.genSalt(10);
    this.password = this.password.trim(); // Eliminar espacios
    const hashedPassword = await bcrypt.hash(this.password, salt);
    console.log('Hash generado:', hashedPassword);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.error('Error hasheando contraseña:', error);
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    console.log('Comparando contraseñas para usuario:', this.email);
    console.log('Hash almacenado:', this.password);
    console.log('Contraseña candidata (sin trim):', candidatePassword);
    
    // Eliminar espacios de la contraseña candidata
    const trimmedPassword = candidatePassword.trim();
    console.log('Contraseña candidata (con trim):', trimmedPassword);
    
    const isMatch = await bcrypt.compare(trimmedPassword, this.password);
    console.log('¿Contraseñas coinciden?:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Error al comparar contraseñas:', error);
    throw error;
  }
};

export const User = mongoose.models.User || mongoose.model<IUser, UserModel>('User', userSchema);