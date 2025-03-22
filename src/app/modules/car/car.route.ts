import express, { NextFunction, Request, Response } from 'express';
import { CarControllers } from './car.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  carValidationSchema,
  updateCarValidationSchema,
} from './car.validation';
import { upload } from '../../utils/sendImageToCloudinary';
import { auth } from '../../middlewares/authRequest';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/add-car',
  auth(USER_ROLE.admin),
  upload.array('files', 5),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(carValidationSchema),
  CarControllers.createACar,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.user),
  CarControllers.getAllCars,
);

router.get(
  '/:carId',
  auth(USER_ROLE.admin, USER_ROLE.user),
  CarControllers.getACarById,
);

router.put(
  '/:carId',
  auth(USER_ROLE.admin),
  validateRequest(updateCarValidationSchema),
  CarControllers.updateACar,
);

router.delete('/:carId', auth(USER_ROLE.admin), CarControllers.deleteACar);

export const CarRoutes = router;
