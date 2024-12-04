import { Request, Response } from 'express';
import { CarService } from './car.service';
import { carValidationSchema } from './car.validation';
import { TCar } from './car.interface';

// sending req to the service/DB to create a the cars into the DB
const createACar = async (req: Request, res: Response) => {
  try {
    const car = req.body;

    // Validate car data using Zod
    const parseResult = carValidationSchema.safeParse(car);

    if (!parseResult.success) {
      // If validation fails, return a 400 status with error details
      res.status(400).json({
        success: false,
        message: 'Car data validation failed!',
        errors: parseResult.error.errors,
      });
      return;
    }

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
    // const { car } = req.body;
    // console.log(car);
    const searchTerm = req.query.searchTerm as string | undefined;

    //querying on db
    const result = await CarService.getAllCarsFromDB(searchTerm);

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
    const carId: string = req.params.carId;
    // console.log("ekhane car id:",carId);

    // const result = null;
    const result = await CarService.getACarByIdFromDB(carId);

    //returning 404 not found if there is no car with the id
    if (!result) {
      res.status(404).json({
        success: false,
        message: `404 Car with the id: ${carId} not found!`,
      });
      return;
    }

    //returning success message when the car is found
    res.status(200).json({
      success: true,
      message: `The car with an id: ${carId} is retrieved successfully!`,
      data: result,
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json({
      success: false,
      message: 'An occur retrieving the car!',
      error: err,
    });
  }
};

//request to the service/DB to find and update a car
const updateACar = async (req: Request, res: Response) => {
  try {
    const carId: string = req.params.carId;
    const updateData: Partial<TCar> = req.body;

    const result = await CarService.updateACarIntoDB(carId, updateData);

    //throwing error if the id is not found
    if (!result) {
      res.status(404).json({
        success: false,
        message: `404 car not found with the id: ${carId}`,
      });
    }

    //sending to client the result of find and update process
    res.status(200).json({
      success: true,
      message: `Successfully updated the car with the id: ${carId}`,
      data: result,
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json({
      success: false,
      message: 'An error occur updating the car!',
      error: err,
    });
  }
};

//deleting a car from the db processing and send response to client
const deleteACar = async (req: Request, res: Response) => {
  try {
    const carId: string = req.params.carId;

    const result = await CarService.deleteACarFromDB(carId);

    if (!result) {
      res.status(404).json({
        success: false,
        message: `404 car not found with the id ${carId}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Successfully deleted the car with id: ${carId}`,
      data: {},
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json({
      success: false,
      message: 'An error occur deleting the car!',
      error: err,
    });
  }
};

export const CarController = {
  createACar,
  getAllCars,
  getACarById,
  updateACar,
  deleteACar,
};
