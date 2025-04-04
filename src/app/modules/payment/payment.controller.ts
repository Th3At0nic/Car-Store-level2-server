/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { paymentServices } from './payment.service';
import { Result } from 'express-validator';

const getPaymentInfoByTransactionId = catchAsync(async (req, res, next) => {
  const { transactionId } = req.params;
  const payment =
    await paymentServices.getPaymentByTransactionIdFromDB(transactionId);

  const message = 'Payment details retrieved successfully';
  sendResponse(res, StatusCodes.OK, true, message, Result);
});

const getPaymentInfoByOrderId = catchAsync(async (req, res, next) => {
  const { transactionId } = req.params;
  const payment =
    await paymentServices.getPaymentByTransactionIdFromDB(transactionId);

  const message = 'Payment details retrieved successfully';
  sendResponse(res, StatusCodes.OK, true, message, Result);
});

export const paymentControllers = {
  getPaymentInfoByTransactionId,
  getPaymentInfoByOrderId,
};
