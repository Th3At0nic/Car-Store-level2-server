import mongoose from 'mongoose';
import { TOrder } from './order.interface';
import { OrderModel } from './order.model';
import { CarModel } from '../car/car.model';
import throwAppError from '../../utils/throwAppError';
import { StatusCodes } from 'http-status-codes';
import { initiateShurjoPayPayment } from '../payment/payment.utility';

//creating an order to DB
const createOrderWithInventoryManagementIntoDB = async (
  userEmail: string,
  order: TOrder,
) => {
  let createdOrder = null;
  let paymentUrl = '';
  const session = await mongoose.startSession(); // creating a session from the mongoose

  try {
    //starting a transaction with the session which allow us to execute multiple opt together, or cancel together.
    session.startTransaction();

    // Step 1: Find the car being ordered to check its availability and stock
    const car = await CarModel.findById(order.car).session(session);

    if (!car) {
      throwAppError(
        'car',
        'The car not found with the car id',
        StatusCodes.NOT_FOUND,
      );
    }

    if (car!.quantity < order.quantity && car!.quantity >= 1) {
      throwAppError(
        'quantity',
        `Insufficient stock! Only ${car?.quantity} unit available. But you ordered ${order.quantity} unit`,
        StatusCodes.UNPROCESSABLE_ENTITY,
      );
    }

    // reducing the order quantity from the car quantity and assigning the new quantity to the car quantity
    car!.quantity -= order.quantity;

    //updating the car inStock status
    if (car?.quantity === 0) {
      car!.inStock = false;
    }

    // saving the updated car details into the DB with the session
    await car?.save({ session });

    //assigning email and status to the order data
    const now = new Date();

    order.customerEmail = userEmail;
    order.customerAddress = 'something';
    order.customerName = 'something';
    order.customerPhone = 'something';
    order.orderStatus = 'PENDING';
    order.paymentStatus = 'UNPAID';
    order.totalPrice = Number(car?.price) * Number(order.quantity);
    order.estimatedDeliveryStart = new Date(
      now.getTime() + 2 * 24 * 60 * 60 * 1000,
    ); // 2 days later of Order placement date

    order.estimatedDeliveryEnd = new Date(
      now.getTime() + 12 * 24 * 60 * 60 * 1000,
    ); // 12 days later

    //creating a new order in the DB
    const result = await OrderModel.create([order], { session });

    createdOrder = result[0];

    // console.log('result: ', result);

    // console.log('result id: ', result[0]._id.toString());

    // committing the transaction to finalize all the changes into the DB
    await session.commitTransaction();
  } catch (err) {
    // if any error occur, abort all the transaction to undo all the changes including the inventory and order
    await session.abortTransaction();

    throwAppError(
      '',
      `An error occur ordering a car! + ${err}`,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  } finally {
    session.endSession();
  }

  if (createdOrder) {
    paymentUrl = await initiateShurjoPayPayment(createdOrder._id.toString());
  }

  return { order: createdOrder, paymentUrl };
};

const getMyOrdersFromDB = async (userEmail: string) => {
  const result = await OrderModel.find({ email: userEmail });

  if (!result.length) {
    throwAppError('', 'Currently You have no Orders', StatusCodes.NOT_FOUND);
  }

  return result;
};

export const OrderService = {
  createOrderWithInventoryManagementIntoDB,
  getMyOrdersFromDB,
};
