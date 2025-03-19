import { Express } from 'express';
import { CarModel } from './car.model';
import { TCar } from './car.interface';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import throwAppError from '../../utils/throwAppError';
import { StatusCodes } from 'http-status-codes';
import { QueryBuilder } from '../../builder/QueryBuilder';

//creating a car into the DB
const createACarIntoDB = async (files: Express.Multer.File[], car: TCar) => {
  if (files && files.length > 0) {
    const uploadedImages: string[] = [];

    // Upload each file to Cloudinary
    for (const file of files) {
      const imgName = `${car.brand}${car.model}${car.year}-${Date.now()}`;
      const imgPath = file.path;

      const uploadImgResult = await sendImageToCloudinary(imgPath, imgName);
      if (uploadImgResult?.secure_url) {
        uploadedImages.push(uploadImgResult.secure_url);
      }
    }

    // Store all uploaded image URLs
    car.images = uploadedImages;
  }

  const result = await CarModel.create(car);
  if (!result) {
    throwAppError(
      'add-car',
      "Couldn't add the car. Something went wrong.",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return result;
};

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

// updating  a specific car from the DB by an ID
const updateACarIntoDB = async (carId: string, updateData: Partial<TCar>) => {
  const isCarExists = await CarModel.findById(carId);

  if (!isCarExists) {
    throwAppError(
      `carID: ${carId}`,
      'Car not found with the provided id',
      StatusCodes.NOT_FOUND,
    );
  }

  const result = await CarModel.findByIdAndUpdate(carId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throwAppError(
      '',
      "Couldn't update the car. Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return result;
};

//deleting a specific car from the DB by an ID
const deleteACarFromDB = async (carId: string) => {
  const isCarExists = await CarModel.findById(carId);

  if (!isCarExists) {
    throwAppError(
      `carID: ${carId}`,
      'Car not found with the provided id',
      StatusCodes.NOT_FOUND,
    );
  }

  const result = await CarModel.findByIdAndDelete(carId);

  if (!result) {
    throwAppError(
      '',
      "Couldn't delete the car. Something went wrong. hahaha",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
  return result;
};

//exporting these functions wrapping as an object
export const CarServices = {
  createACarIntoDB,
  getAllCarsFromDB,
  getACarByIdFromDB,
  updateACarIntoDB,
  deleteACarFromDB,
};
