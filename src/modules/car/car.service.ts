import { CarModel } from './car.model';
import { TCar } from './car.interface';

//creating a car into the DB
const createACarIntoDB = async (car: TCar) => {
  try {
    const result = await CarModel.create(car);
    return result;
  } catch (err) {
    // console.log(err);
    throw new Error('An error occur creating a car' + err);
  }
};

//retrieving all the car's collection from the DB
const getAllCarsFromDB = async (car: TCar) => {
  try {
    const result = await CarModel.find(car);
    return result;
  } catch (err) {
    // console.log(err);
    throw new Error('An error occur creating a car' + err);
  }
};

const getACarByIdFromDB = async (carId: string) => {
  try {
    const result = await CarModel.findById(carId);
    return result;
  } catch (err) {
    console.log(err);
    throw new Error('An error occur retrieving the car!' + err);
  }
};

//exporting these functions wrapping as an object
export const CarService = {
  createACarIntoDB,
  getAllCarsFromDB,
  getACarByIdFromDB,
};
