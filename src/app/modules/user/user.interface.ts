/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  deactivated: boolean;
};

export interface IUser extends Model<TUser> {
  isUserExists(email: string): Promise<TUser | null>;
  isPasswordCorrect(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
