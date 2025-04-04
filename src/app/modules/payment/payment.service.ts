import { StatusCodes } from 'http-status-codes';
import throwAppError from '../../utils/throwAppError';
import { TPayment } from './payment.interface';
import { PaymentModel } from './payment.model';

const createPaymentIntoDB = async (paymentData: TPayment) => {
  const result = await PaymentModel.create(paymentData);

  if (!result) {
    throwAppError(
      '',
      'Payment Failed. Something went wrong',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return result;
};

const getPaymentByTransactionIdFromDB = async (transactionId: string) => {
  const result = await PaymentModel.findOne({ transactionId });

  if (!result) {
    throwAppError(
      '',
      'No Payment Data found with the transactionId',
      StatusCodes.NOT_FOUND,
    );
  }

  return result;
};

const getPaymentsByOrderIdFromDB = async (orderId: string) => {
  const result = await PaymentModel.find({ orderId });

  if (!result.length) {
    throwAppError(
      '',
      'No Payment Data found with the orderId',
      StatusCodes.NOT_FOUND,
    );
  }

  return result;
};

export const paymentServices = {
  createPaymentIntoDB,
  getPaymentByTransactionIdFromDB,
  getPaymentsByOrderIdFromDB,
};
