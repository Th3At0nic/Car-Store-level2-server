import { Request, Response } from 'express';
import { CarService } from './car.service';

const createACar = async (req: Request, res: Response) => {
  try {
    const { car } = req.body;
    const result = await CarService.createACarIntoDB(car);

    res.status(201).json({
      success: true,
      message: 'A car is created successfully!',
      data: result,
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json({
      success: false,
      message: 'An error occur creating a car!',
      error: err,
    });
  }
};
const getAllCars = async (req: Request, res: Response) => {
  try {
    const { car } = req.body;
    const result = await CarService.getAllCarsFromDB(car);

    res.status(201).json({
      success: true,
      message: 'All cars are retrieved successfully!',
      data: result,
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json({
      success: false,
      message: 'An error occur retrieving a car!',
      error: err,
    });
  }
};

export const CarController = {
  createACar,
  getAllCars,
};
