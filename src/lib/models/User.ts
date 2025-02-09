
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
  isEmailVerified: { 
    type: Boolean, 
    default: false,
    required: true
  },
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
    console.log('Password not modified, skipping hash');
    return next();
  }

  try {
    console.log('Hashing password for user:', this.email);
    // Trim and normalize the password before hashing
    this.password = this.password.trim();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    console.log('Generated hash:', hashedPassword);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    console.log('Comparing passwords for user:', this.email);
    console.log('Stored hash:', this.password);
    
    // Normalize the candidate password
    const normalizedPassword = candidatePassword.trim();
    console.log('Normalized candidate password:', normalizedPassword);
    
    // Direct comparison using bcrypt
    const isMatch = await bcrypt.compare(normalizedPassword, this.password);
    console.log('Passwords match?:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
};

export const User = mongoose.models.User || mongoose.model<IUser, UserModel>('User', userSchema);
