import express from 'express';
import { CarController } from './car.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  carValidationSchema,
  updateCarValidationSchema,
} from './car.validation';

const router = express.Router();

// Create a car
router.post(
  '/',
  validateRequest(carValidationSchema),
  CarController.createACar,
);

router.get('/', CarController.getAllCars);

router.get('/:carId', CarController.getACarById);

router.put(
  '/:carId',
  validateRequest(updateCarValidationSchema),
  CarController.updateACar,
);

router.delete('/:carId', CarController.deleteACar);

export const CarRoutes = router;
