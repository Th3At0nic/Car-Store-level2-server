import { UserModel } from '../user/user.model';
import { TChangePassData, TLoginUser } from './auth.interface';
import throwAppError from '../../utils/throwAppError';
import { StatusCodes } from 'http-status-codes';
import { generateToken } from './auth.utils';
import config from '../../config';
import bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';

const loginUserAuth = async (payload: TLoginUser) => {
  const { email, password: userGivenPassword } = payload;

  const user = await UserModel.isUserExists(email);

  if (!user) {
    throwAppError(
      'email',
      `The User with the provided email: ${email} not found in the system. Please recheck the email and try again`,
      StatusCodes.UNAUTHORIZED,
    );
  }

  const isPasswordValid = await UserModel.isPasswordCorrect(
    userGivenPassword,
    user?.password as string,
  );

  if (!isPasswordValid) {
    throwAppError(
      'password',
      'The provided password is incorrect. Please try again.',
      StatusCodes.UNAUTHORIZED,
    );
  }

  const jwtPayload = {
    userEmail: user?.email as string,
    role: user?.role as string,
  };

  // create access token and send it to the client
  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = generateToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const changePasswordIntoDB = async (
  userData: JwtPayload,
  payload: TChangePassData,
) => {
  const user = await UserModel.isUserExists(userData.userEmail);

  if (!user) {
    throwAppError(
      'email',
      `The User with the email: ${userData.userEmail} not found in the system.`,
      StatusCodes.NOT_FOUND,
    );
  }

  if (user?.deactivated) {
    throwAppError(
      'deactivated',
      `User Account with the email: ${userData.userEmail} is Deactivated.`,
      StatusCodes.BAD_REQUEST,
    );
  }

  const isOldPasswordValid = await UserModel.isPasswordCorrect(
    payload.oldPassword,
    user?.password as string,
  );

  if (!isOldPasswordValid) {
    throwAppError(
      'password',
      'Invalid Credentials. Old password is incorrect. Please try again.',
      StatusCodes.BAD_REQUEST,
    );
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_round_salt),
  );

  const result = await UserModel.findOneAndUpdate(
    {
      email: userData.userEmail,
      role: userData.role,
    },
    {
      password: newHashedPassword,
    },
    { new: true },
  );

  return result ? {} : undefined;
};

export const LoginUserServices = {
  loginUserAuth,
  changePasswordIntoDB,
};
