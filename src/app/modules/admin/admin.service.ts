import { StatusCodes } from 'http-status-codes';
import throwAppError from '../../utils/throwAppError';
import { UserModel } from '../user/user.model';
import { OrderModel } from '../order/order.model';

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

const getAnOrderFromDB = async (orderId: string) => {
  const result = await OrderModel.findById(orderId).populate('car');

  if (!result) {
    throwAppError(
      'orders',
      'Order Not Found in the System',
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

const getAllUsersFromDB = async () => {
  const result = await UserModel.find();

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

export const AdminServices = {
  toggleUserStatusByAdminIntoDB,
  getAllOrdersFromDB,
  getAnOrderFromDB,
  calcRevenueFromOrders,
  getAllUsersFromDB,
  deleteOrderFromDB,
};
