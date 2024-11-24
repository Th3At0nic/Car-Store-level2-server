import { Request, Response } from 'express';
import { OrderService } from './order.service';
import { AccType, ErrorType, orderValidationSchema } from './order.validation';

// processing the req and  order and sending response to the client
const createOrder = async (req: Request, res: Response) => {
  try {
    //validating the order data
    const validation = orderValidationSchema.safeParse(req.body.order);

    //this much code is just for matching the generic of error message of the assignment.
    if (!validation.success) {
      //reduce method works as reducing the array by iterating on each array of errors and accumulate them into a single formatted object
      const formattedErrors = (
        validation.error.errors as ErrorType[]
      ).reduce<AccType>((acc, error) => {
        const { path, message, code, minimum } = error;
        const invalidValue = req.body.order.totalPrice; //i had to access it like this because that price value is not being sent by the zod validator. had to fullfill the assignmtn condition

        acc[path[0]] = {
          message: message,
          name: 'ValidatorError', // You can set the error name as required
          properties: {
            message: message,
            type: code, // Use the validation code as the type
            min: minimum, // For example, if it's a "min" validation
          },
          kind: code, // Use the validation code as the kind
          path: path.join('.'), // Convert path array to a string (e.g., 'price')
          value: invalidValue, // The value that was received
        };

        return acc;
      }, {});

      //sending failed response to the client
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: {
          name: 'ValidationError',
          errors: formattedErrors, // inserting the formatted errors here
        },
        stack: new Error().stack, // including the stack trace where the error is occuring actually
      });
    }

    const { order } = req.body;
    // console.log('ekhane order: ', order);
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
      stack: err.stack,
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
      stack: err.stack,
    });
  }
};

export const OrderController = {
  createOrder,
  calcRevenue,
};
