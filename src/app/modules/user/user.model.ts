import { model, Schema } from 'mongoose';
import { IUser, TUser } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

export const userSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    role: { type: String, enum: ['admin', 'user'], required: true },
  },
  { timestamps: true },
);

//creating or using mongoose middleware like pre and post
userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_round_salt),
  );
});

// hiding the password from the response document to keep the privacy.
userSchema.post('save', function (doc) {
  doc.password = '';
});

//finding for existing user in the db so prevent duplicate creation
userSchema.statics.isUserExists = async function (email: string) {
  const existingUser = await UserModel.findOne({ email }).select('+password');
  return existingUser;
};

userSchema.statics.isPasswordCorrect = async function (
  plainTextPassword: string,
  hashPassword: string,
) {
  const authPassword = await bcrypt.compare(plainTextPassword, hashPassword);
  return authPassword;
};

export const UserModel = model<TUser, IUser>('User', userSchema);
