import { TOrder } from './order.interface';
import { OrderModel } from './order.model';

//creating an order to DB
const createOrderIntoDB = async (order: TOrder) => {
  try {
    const result = await OrderModel.create(order);
    return result;
  } catch (err) {
    throw new Error('An error occur ordering a car!' + err);
  }
};

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
  createOrderIntoDB,
  calcRevenueFromOrders,
};
