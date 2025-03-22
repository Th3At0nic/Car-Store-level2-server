/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CarServices } from './car.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const getAllCars = catchAsync(async (req, res, next) => {
  const result = await CarServices.getAllCarsFromDB(req.query);

  const message = 'Retrieved the Car Successfully';
  sendResponse(res, StatusCodes.OK, true, message, result.result, result.meta);
});

const getACarById = catchAsync(async (req, res, next) => {
  const carId: string = req.params.carId;

  const result = await CarServices.getACarByIdFromDB(carId);

  const message = 'The Car is Retrieved Successfully';
  sendResponse(res, StatusCodes.OK, true, message, result);
});

export const CarControllers = {
  getAllCars,
  getACarById,
};
