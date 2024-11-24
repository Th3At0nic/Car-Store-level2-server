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
const getAllCarsFromDB = async (searchTerm?: string) => {
  try {
    let filter = {}; // Default to no filter, returning all cars if no search term is given

    // If a searchTerm is provided, apply filter for brand, model, or category
    if (searchTerm) {
      filter = {
        $or: [
          { brand: { $regex: searchTerm, $options: 'i' } }, // case-insensitive match
          { model: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } },
        ],
      };
    }

    //querying on the db
    const result = await CarModel.find(filter);
    return result;
  } catch (err) {
    // console.log(err);
    throw new Error('An error occur creating a car' + err);
  }
};

//retrieving a specific car from the DB by an ID
const getACarByIdFromDB = async (carId: string) => {
  try {
    const result = await CarModel.findById(carId);
    return result;
  } catch (err) {
    // console.log(err);
    throw new Error('An error occur retrieving the car!' + err);
  }
};

// updating  a specific car from the DB by an ID
const updateACarIntoDB = async (carId: string, updateData: Partial<TCar>) => {
  try {
    const result = await CarModel.findByIdAndUpdate(carId, updateData, {
      new: true,
      runValidators: true,
    });
    //added {new: true} because it ensures: mongoose returns the new data, not the last updated data. without {new: true} it needs to try two times to get the new updated result
    return result;
  } catch (err) {
    // console.log(err);
    throw new Error('An error occur updating the car!' + err);
  }
};

//deleting a specific car from the DB by an ID
const deleteACarFromDB = async (carId: string) => {
  try {
    const result = await CarModel.findByIdAndDelete(carId);
    return result;
  } catch (err) {
    // console.log(err);
    throw new Error(`An error occur deleting the car with id: ${carId}` + err);
  }
};

//exporting these functions wrapping as an object
export const CarService = {
  createACarIntoDB,
  getAllCarsFromDB,
  getACarByIdFromDB,
  updateACarIntoDB,
  deleteACarFromDB,
};
