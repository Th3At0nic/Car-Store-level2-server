import { UserModel } from '../user/user.model';
import { TChangePassData, TLoginUser } from './auth.interface';
import throwAppError from '../../utils/throwAppError';
import { StatusCodes } from 'http-status-codes';
import { generateToken } from './auth.utils';
import config from '../../config';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

const loginUserAuth = async (payload: TLoginUser) => {
  const { email, password: userGivenPassword } = payload;

  const user = await UserModel.isUserExists(email);

  if (!user) {
    throwAppError(
      'email',
      `This Email is not Registered.`,
      StatusCodes.UNAUTHORIZED,
    );
  }

  if (user?.deactivated) {
    throwAppError(
      'deactivated',
      'Your account is deactivated by admin. To login your account, contact admin to activate your account first',
      StatusCodes.FORBIDDEN,
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

const createNewAccessTokenByRefreshToken = async (token: string) => {
  if (!token) {
    throwAppError(
      'authorization',
      'Authorization is required to access this resource.',
      StatusCodes.UNAUTHORIZED,
    );
  }

  // check if the token is valid
  // invalid token
  const decoded = jwt.verify(token, config.jwt_refresh_secret as string);

  // decoded undefined
  const { userEmail, role } = decoded as JwtPayload;

  // req.user = decoded as JwtPayload;

  const user = await UserModel.isUserExists(userEmail);

  if (!user) {
    throwAppError(
      'email',
      `The ${role} with the provided email: ${userEmail} not found in the system. Please recheck the Email and try again`,
      StatusCodes.NOT_FOUND,
    );
  }

  const isUserDeactivated = user?.deactivated;
  if (isUserDeactivated) {
    throwAppError(
      'email',
      `The account of ${role} with the provided email: ${userEmail} id deactivated. Please contact with admin to activate first`,
      StatusCodes.NOT_FOUND,
    );
  }

  if (user) {
    const jwtPayload = {
      userEmail: user.email,
      role: user.role,
    };

    //create access token and send it to the client
    const accessToken = generateToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );
    return { accessToken };
  } else return null;
};

export const LoginUserServices = {
  loginUserAuth,
  changePasswordIntoDB,
  createNewAccessTokenByRefreshToken,
};
