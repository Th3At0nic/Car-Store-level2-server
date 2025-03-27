import express from 'express';
import { CarControllers } from './car.controller';

const router = express.Router();

router.get('/', CarControllers.getAllCars);

router.get('/:carId', CarControllers.getACarById);

export const CarRoutes = router;
