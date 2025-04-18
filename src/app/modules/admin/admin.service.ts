import { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import throwAppError from '../../utils/throwAppError';
import { UserModel } from '../user/user.model';
import { OrderModel } from '../order/order.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { CarModel } from '../car/car.model';
import { TCar } from '../car/car.interface';
import { TOrder } from '../order/order.interface';
import { QueryBuilder } from '../../builder/QueryBuilder';

//creating a car into the DB
const createACarIntoDB = async (files: Express.Multer.File[], car: TCar) => {
  if (files && files.length > 0) {
    const uploadedImages: string[] = [];

    // Upload each file to Cloudinary
    for (const file of files) {
      const imgName = `${car.brand}${car.model}${car.year}-${Date.now()}`;
      // const imgPath = file.path;

      const uploadImgResult = await sendImageToCloudinary(file.buffer, imgName);
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
      "Couldn't delete the car. Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
  return result;
};

const toggleUserStatusByAdminIntoDB = async (userId: string) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throwAppError(
      'params.userId',
      `User not found with the id: ${userId}`,
      StatusCodes.NOT_FOUND,
    );
  }

  const result = await UserModel.findByIdAndUpdate(
    userId,
    { deactivated: !user?.deactivated },
    { new: true, runValidators: true },
  );

  if (!result) {
    throwAppError(
      'params.userId',
      `${user?.deactivated ? `Failed to activate the user` : `Failed to deactivate the user.`}`,
      StatusCodes.INTERNAL_SERVER_ERROR, // If the update fails, server error
    );
  }

  return result;
};

const getAllOrdersFromDB = async () => {
  const result = await OrderModel.find().populate('car');

  if (!result.length) {
    throwAppError(
      'orders',
      'No Orders found in the system',
      StatusCodes.NOT_FOUND,
    );
  }

  return result;
};

//
//
// calculating the total revenue from orders
const calcRevenueFromOrders = async () => {
  try {
    const result = await OrderModel.aggregate([
      {
        $lookup: {
          from: 'cars', // connecting with the cars collection from the order collection in the db to access its value,
          localField: 'car', // The field in the current orders collection that holds the car id
          foreignField: '_id', // The field in the cars collection that holds the car id
          as: 'carDetails', // The result of the lookup will be stored here (carDetails)
        },
      },
      {
        $unwind: '$carDetails', // Unwind to get individual car documents to access car's price
      },
      {
        $project: {
          totalRevenue: { $multiply: ['$carDetails.price', '$quantity'] },
          // Calculating revenue for each order, taking the each car price from the car document and taking the quantity of that car order from the orders, and then multiplying the the unit price and the order quantity.
        },
      },
      {
        $group: {
          _id: null, // _id is nothing so that it will Group all documents into a single group
          totalRevenue: { $sum: '$totalRevenue' }, // Sum the total revenue
        },
      },
      {
        $project: {
          _id: 0, // value 0 is to hide _id frm the output
          totalRevenue: 1, // 1 means show totalRevenue in the output
        },
      },
    ]);

    if (!result) {
      throwAppError(
        'revenue',
        `Something went wrong. Couldn't Calculate Revenue from Orders.`,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  } catch (err) {
    // console.log(err);
    throwAppError(
      '',
      `An error occur ordering a car! + ${err}`,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const searchableFields = ['name', 'email', 'role'];
  const userQuery = new QueryBuilder(query, UserModel.find())
    .search(searchableFields)
    .filter()
    .paginate()
    .sortBy()
    .fields();

  const result = await userQuery.modelQuery;

  if (!result.length) {
    throwAppError(
      'users',
      'No User Found in the System',
      StatusCodes.NOT_FOUND,
    );
  }

  return result;
};

const deleteOrderFromDB = async (orderId: string) => {
  const result = await OrderModel.findByIdAndDelete(orderId);

  if (!result) {
    throwAppError(
      'params.orderId',
      "Something went wrong. Couldn't Delete the order",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return result;
};

const updateOrderStatusIntoDB = async (
  orderId: string,
  payload: Pick<TOrder, 'orderStatus'>,
) => {
  const isOrderExists = await OrderModel.findById(orderId);

  if (!isOrderExists) {
    throwAppError(
      'orderId',
      'Order not Found in the System.',
      StatusCodes.NOT_FOUND,
    );
  }

  if (isOrderExists?.orderStatus === 'DELIVERED') {
    throwAppError(
      'status',
      `The Order is Already Delivered. Can't change status anymore.`,
      StatusCodes.BAD_REQUEST,
    );
  }
  if (
    (isOrderExists?.orderStatus === 'PROCESSING' &&
      payload.orderStatus === 'DELIVERED') ||
    (isOrderExists?.orderStatus === 'PENDING' &&
      payload.orderStatus === 'PROCESSING') ||
    (isOrderExists?.orderStatus === 'PENDING' &&
      payload.orderStatus === 'SHIPPED') ||
    (isOrderExists?.orderStatus === 'PENDING' &&
      payload.orderStatus === 'DELIVERED') ||
    (isOrderExists?.orderStatus === 'CONFIRMED' &&
      payload.orderStatus === 'SHIPPED') ||
    (isOrderExists?.orderStatus === 'CONFIRMED' &&
      payload.orderStatus === 'DELIVERED')
  ) {
    throwAppError(
      'status',
      `Invalid Status flow. A ${isOrderExists.orderStatus} order can't be ${payload.orderStatus} directly. Must follow the sequence: Pending → Processing → Shipped → Delivered.`,
      StatusCodes.FORBIDDEN,
    );
  } else if (
    isOrderExists?.orderStatus === 'SHIPPED' &&
    payload.orderStatus === 'PROCESSING'
  ) {
    throwAppError(
      'status',
      `Shipped order can't backward to "Processing".`,
      StatusCodes.FORBIDDEN,
    );
  }

  const result = await OrderModel.findByIdAndUpdate(orderId, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throwAppError(
      'orderId',
      "Something went Wrong. Couldn't Update the Order Status",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return result;
};

export const AdminServices = {
  createACarIntoDB,
  updateACarIntoDB,
  deleteACarFromDB,
  toggleUserStatusByAdminIntoDB,
  getAllOrdersFromDB,
  calcRevenueFromOrders,
  getAllUsersFromDB,
  deleteOrderFromDB,
  updateOrderStatusIntoDB,
};
