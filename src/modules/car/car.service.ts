import { Request, Response } from 'express';
import { CarModel } from './car.model';
import { TCar } from './car.interface';

const createACarIntoDB = async (car: TCar) => {
  try {
    const result = await CarModel.create(car);
    return result;
  } catch (err) {
    console.log(err);
    throw new Error('An error occur creating a car' + err);
  }
};
const getAllCarsFromDB = async (car: TCar) => {
  try {
    const result = await CarModel.find(car);
    return result;
  } catch (err) {
    console.log(err);
    throw new Error('An error occur creating a car' + err);
  }
};

export const CarService = {
  createACarIntoDB,
  getAllCarsFromDB,
};
