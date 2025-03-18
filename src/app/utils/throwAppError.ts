import { AppError } from '../error/AppError';

const throwAppError = (path: string, message: string, statusCode: number) => {
  throw new AppError(message, statusCode, [
    {
      path: path,
      message: message,
    },
  ]);
};

export default throwAppError;
