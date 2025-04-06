/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { paymentServices } from './payment.service';

// const getPaymentInfoByTransactionId = catchAsync(async (req, res, next) => {
//   const { transactionId } = req.params;
//   const result =
//     await paymentServices.getPaymentByTransactionIdFromDB(transactionId);

//   const message = 'Payment details retrieved successfully';
//   sendResponse(res, StatusCodes.OK, true, message, result);
// });

// const getPaymentInfoByOrderId = catchAsync(async (req, res, next) => {
//   const { transactionId } = req.params;
//   const result =
//     await paymentServices.getPaymentByTransactionIdFromDB(transactionId);

//   const message = 'Payment details retrieved successfully';
//   sendResponse(res, StatusCodes.OK, true, message, result);
// });

const verifyPayment = catchAsync(async (req, res, next) => {
  const { order_id } = req.query;

  const result = await paymentServices.verifyPaymentFromShurjopay(
    order_id as string,
  );

  let message: string = '';

  const { bank_status, sp_message } = result.length ? result[0] : result;

  if (bank_status === 'Failed' || bank_status === 'Cancel') {
    message = `Payment ${sp_message}`;
  } else {
    message = 'Payment Successful';
  }

  sendResponse(res, StatusCodes.OK, true, message, result);
});

export const paymentControllers = {
  // getPaymentInfoByTransactionId,
  // getPaymentInfoByOrderId,
  verifyPayment,
};
