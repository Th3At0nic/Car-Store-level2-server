import { UserModel } from './user.model';
import { TUser } from './user.interface';
import throwAppError from '../../utils/throwAppError';
import { StatusCodes } from 'http-status-codes';
import { USER_ROLE } from './user.constant';

const registerUserIntoDB = async (payload: TUser) => {
  const user: TUser = {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: USER_ROLE.user,
    deactivated: false,
  };

  //preventing duplicate creation of student
  const userExisted = await UserModel.isUserExists(user.email as string);

  if (userExisted) {
    throwAppError(
      'email',
      `The user id: ${user.email} is already registered.`,
      StatusCodes.CONFLICT,
    );
  }

  //creating a new user
  const newUser = await UserModel.create(user);

  if (!newUser) {
    throwAppError(
      'user',
      'Failed to create user. Please try again later.',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return newUser;
};

export const userServices = { registerUserIntoDB };
