/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { OrderService } from './order.service';
import catchAsync from '../../utils/catchAsync';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import { JwtPayload } from 'jsonwebtoken';

// processing the req and  order and sending response to the client
const createOrderWithInventoryManagement = catchAsync(
  async (req, res, next) => {
    const { userEmail } = req.user as JwtPayload;

    const result = await OrderService.createOrderWithInventoryManagementIntoDB(
      userEmail,
      req.body,
    );

    sendResponse(
      res,
      StatusCodes.OK,
      true,
      'Order Placed Successfully',
      result,
    );
  },
);

const getMyOrders = catchAsync(async (req, res, next) => {
  const { userEmail } = req.user as JwtPayload;
  const result = await OrderService.getMyOrdersFromDB(userEmail);

  const message = 'My Orders retrieved Successfully';
  sendResponse(res, StatusCodes.OK, true, message, result);
});

export const OrderController = {
  createOrderWithInventoryManagement,
  getMyOrders,
};
