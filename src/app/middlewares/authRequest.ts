import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { UserModel } from '../modules/user/user.model';
import throwAppError from '../utils/throwAppError';
import { StatusCodes } from 'http-status-codes';

export const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throwAppError(
        'authorizationToken',
        'Authorization token missing! Please Login.',
        StatusCodes.UNAUTHORIZED,
      );
    }

    // check if the token is valid
    // invalid token
    //--i can avoid using try-catch block here as my instructor did it, but i did it to define the error msg
    //structure , otherwise it would only show "signature invalid" message and no path
    try {
      const decoded = jwt.verify(
        token as string,
        config.jwt_access_secret as string,
      );

      // decoded undefined
      const userDecoded = decoded as JwtPayload;
      console.log('userDecoded from authRequest: ', userDecoded);

      const {
        userId,
        role,
        // iat
      } = decoded as JwtPayload;

      if (requiredRoles && !requiredRoles.includes(role)) {
        throwAppError(
          'authorization',
          'You are not authorized to perform this action. This resource is restricted to users with specific roles. If you believe this is an error, please contact the administrator',
          StatusCodes.UNAUTHORIZED,
        );
      }

      const user = await UserModel.isUserExists(userId);

      if (!user) {
        throwAppError(
          'id',
          `The ${role} with the provided ID: ${userId} not found in the system. Please recheck the ID and try again`,
          StatusCodes.UNAUTHORIZED,
        );
      }

      req.user = decoded as JwtPayload;

      next();
    } catch (err) {
      //--i can avoid using try-catch block here as my instructor did it, but i did it to define the error msg
      //structure , otherwise it would only show "signature invalid" message and no path
      if (
        err instanceof jwt.JsonWebTokenError ||
        err instanceof jwt.TokenExpiredError
      ) {
        throwAppError(
          'TokenExpiredError',
          'Your session has expired or the token is invalid. Please login again to continue.',
          StatusCodes.UNAUTHORIZED,
        );
      }
      // If another error occurs, pass it to the next middleware
      next(err);
    }
  });
};
