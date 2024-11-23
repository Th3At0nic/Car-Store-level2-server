import mongoose from 'mongoose';
import { TOrder } from './order.interface';
import { OrderModel } from './order.model';
import { CarModel } from '../car/car.model';

//creating an order to DB
const createOrderWithInventoryManagementIntoDB = async (order: TOrder) => {
  const session = await mongoose.startSession(); // creating a session from the mongoose
  try {
    //starting a transaction with the session which allow us to execute multiple opt together, or cancel together.
    session.startTransaction();

    // Step 1: Find the car being ordered to check its availability and stock
    const car = await CarModel.findById(order.car).session(session);

    if (!car) {
      throw new Error('Car not found!');
    }
    if (car.quantity < order.quantity && car.quantity >= 1) {
      throw new Error(
        `Insufficient stock! Only ${car.quantity} unit available.`,
      );
    }

    // reducing the order quantity from the car quantity and assigning the new quantity to the car quantity
    car.quantity -= order.quantity;

    //updating the car inStock status
    if (car.quantity === 0) {
      car.inStock = false;
    }

    // saving the updated car details into the DB with the session
    await car.save({ session });

    //creating a new order in the DB
    const result = await OrderModel.create([order], { session });

    // committing the transaction to finalize all the changes into the DB
    await session.commitTransaction();

    // finishing the session as the all job is done by session successfully
    session.endSession();

    //finally returning the result of created order. also inventory management done.
    return result;
  } catch (err) {
    // if any error occur, abort all the transaction to undo all the changes including the inventory and order
    await session.abortTransaction();

    session.endSession();

    throw new Error('An error occur ordering a car!' + err);
  }
};

//
//
//
//
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
    return result;
  } catch (err) {
    console.log(err);
    throw new Error('An error occure while calculating total revenue');
  }
};

export const OrderService = {
  createOrderIntoDB: createOrderWithInventoryManagementIntoDB,
  calcRevenueFromOrders,
};
