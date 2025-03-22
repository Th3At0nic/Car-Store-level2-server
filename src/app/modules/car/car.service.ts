import { CarModel } from './car.model';
import throwAppError from '../../utils/throwAppError';
import { StatusCodes } from 'http-status-codes';
import { QueryBuilder } from '../../builder/QueryBuilder';

//retrieving all the car's collection from the DB
const getAllCarsFromDB = async (query: Record<string, unknown>) => {
  const carSearchableFields = ['brand', 'model', 'category'];

  //querying on the db
  const carQuery = new QueryBuilder(query, CarModel.find())
    .search(carSearchableFields)
    .filter()
    .sortBy()
    .paginate()
    .fields();

  const result = await carQuery.modelQuery;

  if (!result.length) {
    throwAppError('cars', 'No Car found in the system', StatusCodes.NOT_FOUND);
  }

  const meta = await carQuery.countTotal();

  return { meta, result };
};

//retrieving a specific car from the DB by an ID
const getACarByIdFromDB = async (carId: string) => {
  const result = await CarModel.findById(carId);

  if (!result) {
    throwAppError(
      `carId: ${carId}`,
      'Car not found with the provided carId.',
      StatusCodes.NOT_FOUND,
    );
  }
  return result;
};

//exporting these functions wrapping as an object
export const CarServices = {
  getAllCarsFromDB,
  getACarByIdFromDB,
};
