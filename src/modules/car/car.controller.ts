import { Request, Response } from 'express';
import { CarService } from './car.service';

// sending req to the service/DB to create a the cars into the DB
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

// seding req to the service/DB to retrieving all the cars from the DB
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

// sending req to the service/DB to retrieving a specific car from the DB by ID
const getACarById = async (req: Request, res: Response) => {
  try {
    const carId = req.params.carId;
    // console.log("ekhane car id:",carId);
    // const result = null;
    const result = await CarService.getACarByIdFromDB(carId);

    //returning 404 not found if there is no car with the id
    if (!result) {
      res.status(404).json({
        success: false,
        message: `Car with the id: ${carId} not found!`,
      });
    }

    //returning success message when the car is found
    res.status(200).json({
      success: true,
      message: `The car with an id: ${carId} is retrieved successfully!`,
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'An occur retrieving the car!',
      error: err,
    });
  }
};

export const CarController = {
  createACar,
  getAllCars,
  getACarById,
};
