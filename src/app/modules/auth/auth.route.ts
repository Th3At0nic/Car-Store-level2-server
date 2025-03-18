import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { loginUserValidationSchema } from './auth.validation';
import { LoginUserControllers } from './auth.controller';
import { UserValidationSchema } from '../user/user.validation';
import { userControllers } from '../user/user.controller';

const router = Router();

router.post(
  '/login',
  validateRequest(loginUserValidationSchema),
  LoginUserControllers.loginUser,
);

router.post(
  '/register',
  validateRequest(UserValidationSchema),
  userControllers.registerUser,
);

export const AuthRoutes = router;
