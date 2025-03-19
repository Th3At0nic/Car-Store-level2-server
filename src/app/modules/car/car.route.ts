import express, { NextFunction, Request, Response } from 'express';
import { CarControllers } from './car.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  carValidationSchema,
  updateCarValidationSchema,
} from './car.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/add-car',
  upload.array('files', 5),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(carValidationSchema),
  CarControllers.createACar,
);

router.get('/', CarControllers.getAllCars);

router.get('/:carId', CarControllers.getACarById);

router.put(
  '/:carId',
  validateRequest(updateCarValidationSchema),
  CarControllers.updateACar,
);

router.delete('/:carId', CarControllers.deleteACar);

export const CarRoutes = router;
