import { Request, Response } from 'express';
import { OrderService } from './order.service';

// processing the req and  order and sending response to the client
const createOrder = async (req: Request, res: Response) => {
  try {
    const { order } = req.body;
    console.log('ekhane order: ', order);
    const result = await OrderService.createOrderIntoDB(order);
    res.status(200).json({
      success: true,
      message: 'Order created successfully!',
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'An error occur ordering the car!',
    });
  }
};

// processing req of calculation of total revenue
const calcRevenue = async (req: Request, res: Response) => {
  try {
    const result = await OrderService.calcRevenueFromOrders();
    res.status(200).json({
      success: true,
      message: 'Successfully calculated total revenue!',
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'An error occur while calculating total revenue!',
    });
  }
};

export const OrderController = {
  createOrder,
  calcRevenue,
};
