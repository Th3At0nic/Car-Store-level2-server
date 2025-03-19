import { Express } from 'express';
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import { CarServices } from './car.service';
import { TCar } from './car.interface';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createACar = catchAsync(async (req, res, next) => {
  const files = req.files as Express.Multer.File[];

  const result = await CarServices.createACarIntoDB(files, req.body);
  const message = 'Added the Car Successfully!';

  sendResponse(res, StatusCodes.OK, true, message, result);
});

// sending req to the service/DB to retrieving all the cars from the DB
const getAllCars = catchAsync(async (req: Request, res: Response) => {
  const result = await CarServices.getAllCarsFromDB(req.query);

  const message = 'Retrieved the Car Successfully';
  sendResponse(res, StatusCodes.OK, true, message, result.result, result.meta);
});

// sending req to the service/DB to retrieving a specific car from the DB by ID
const getACarById = catchAsync(async (req: Request, res: Response) => {
  const carId: string = req.params.carId;

  const result = await CarServices.getACarByIdFromDB(carId);

  const message = 'The Car is Retrieved Successfully';
  sendResponse(res, StatusCodes.OK, true, message, result);
});

//request to the service/DB to find and update a car
const updateACar = catchAsync(async (req: Request, res: Response) => {
  const carId: string = req.params.carId;
  const updateData: Partial<TCar> = req.body;

  const result = await CarServices.updateACarIntoDB(carId, updateData);
  const message = 'Updated the Car Successfully';
  sendResponse(res, StatusCodes.OK, true, message, result);
});

//deleting a car from the db processing and send response to client
const deleteACar = async (req: Request, res: Response) => {
  const carId: string = req.params.carId;

  const result = await CarServices.deleteACarFromDB(carId);

  const message = 'Deleted the Car Successfully';

  sendResponse(res, StatusCodes.OK, true, message, result ? null : result);
};

export const CarControllers = {
  createACar,
  getAllCars,
  getACarById,
  updateACar,
  deleteACar,
};
