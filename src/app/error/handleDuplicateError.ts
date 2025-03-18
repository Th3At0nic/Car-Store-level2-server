/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSource, TGenericErrorResponse } from '../interface/error';

export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const statusCode = 409;
  const pathRegex = err.message.match(/{ email: "(.*?)" }/);
  const errorSource: TErrorSource = [
    {
      // path: `${err.message.match(pathRegex[1])}`,
      path: `email`,
      message: `${err.message.match(pathRegex[1])} is already registered!`,
    },
  ];
  return {
    statusCode,
    message: 'Duplicate Error!',
    errorSource,
  };
};
