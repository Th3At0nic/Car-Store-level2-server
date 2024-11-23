import express from 'express';
import { CarController } from './car.controller';

const router = express.Router();

// Create a car
router.post('/', CarController.createACar);
router.get('/', CarController.getAllCars);
router.get('/:carId', CarController.getACarById);
router.put('/:carId', CarController.updateACar);

export const CarRoutes = router;
