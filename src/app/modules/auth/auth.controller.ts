/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LoginUserServices } from './auth.service';
import { StatusCodes } from 'http-status-codes';

const loginUser = catchAsync(async (req, res, next) => {
  const result = await LoginUserServices.loginUserAuth(req.body);
  const { accessToken, refreshToken } = result;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent only over HTTPS in production
    sameSite: 'lax', // Prevents CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  });

  const message = 'Login Successful';
  sendResponse(res, StatusCodes.OK, true, message, { accessToken });
});

const changePassword = catchAsync(async (req, res, next) => {
  const user = req.user as JwtPayload;

  const result = await LoginUserServices.changePasswordIntoDB(user, req.body);
  const message = 'Updated the Password Successfully';

  sendResponse(res, StatusCodes.OK, true, message, result);
});

export const LoginUserControllers = {
  loginUser,
  changePassword,
};
