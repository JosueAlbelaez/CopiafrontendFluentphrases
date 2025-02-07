
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
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['free', 'premium', 'admin'],
    default: 'free'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  dailyPhrasesCount: {
    type: Number,
    default: 0
  },
  lastPhrasesReset: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving (solo si la contraseña fue modificada y no es una operación updateOne)
userSchema.pre('save', async function(next) {
  // No hashear si es una operación updateOne o si la contraseña no fue modificada
  if (this.isNew || this.isModified('password')) {
    try {
      console.log('Hasheando contraseña en middleware pre-save');
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error as Error);
    }
  } else {
    next();
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    console.log('Comparando contraseñas');
    console.log('Password almacenado:', this.password);
    console.log('Password candidato:', candidatePassword);
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('¿Contraseñas coinciden?:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Error al comparar contraseñas:', error);
    throw error;
  }
};

export const User = mongoose.models.User || mongoose.model<IUser, UserModel>('User', userSchema);
