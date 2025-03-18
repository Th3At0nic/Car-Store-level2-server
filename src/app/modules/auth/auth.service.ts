import { UserModel } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import throwAppError from '../../utils/throwAppError';
import { StatusCodes } from 'http-status-codes';
import { generateToken } from './auth.utils';
import config from '../../config';

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

export const LoginUserServices = {
  loginUserAuth,
};
