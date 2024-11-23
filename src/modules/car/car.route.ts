import express from 'express';
import { CarController } from './car.controller';

const router = express.Router();

// Create a car
router.post('/', CarController.createACar);
router.get('/', CarController.getAllCars);
router.get('/:carId', CarController.getACarById);

export const CarRoutes = router;
