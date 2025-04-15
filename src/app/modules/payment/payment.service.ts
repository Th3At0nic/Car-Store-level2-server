import jwt, { JwtPayload } from 'jsonwebtoken';
import { verifyShurjopayTransaction } from './payment.utility';
import { StatusCodes } from 'http-status-codes';
import throwAppError from '../../utils/throwAppError';
import { TPayment } from './payment.interface';
import { PaymentModel } from './payment.model';
import { OrderModel } from '../order/order.model';
import mongoose from 'mongoose';
import config from '../../config';

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

// const getPaymentByTransactionIdFromDB = async (transactionId: string) => {
//   const result = await PaymentModel.findOne({ transactionId });

//   if (!result) {
//     throwAppError(
//       '',
//       'No Payment Data found with the transactionId',
//       StatusCodes.NOT_FOUND,
//     );
//   }

//   return result;
// };

// const getPaymentsByOrderIdFromDB = async (orderId: string) => {
//   const result = await PaymentModel.find({ orderId });

//   if (!result.length) {
//     throwAppError(
//       '',
//       'No Payment Data found with the orderId',
//       StatusCodes.NOT_FOUND,
//     );
//   }

//   return result;
// };

const verifyPaymentFromShurjopay = async (spOrderId: string) => {
  const paymentRes = await verifyShurjopayTransaction(spOrderId);

  const response = paymentRes[0];

  if (response.sp_message === 'Success' && response.bank_status === 'Success') {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const formattedVerifiedData: TPayment = {
        spId: response.id,
        spOrderId: response.order_id,
        customerOrderId: response.customer_order_id,
        transactionId: response.order_id,
        amount: response.amount,
        discountAmount: response.discount_amount ?? null,
        payableAmount: response.payable_amount,
        discountPercent: response.disc_percent,
        receivedAmount: response.received_amount,
        usdAmount: response.usd_amt,
        usdRate: response.usd_rate,
        isVerified:
          response.sp_message === 'Success' &&
          response.bank_status === 'Success',
        cardHolderName: response.card_holder_name ?? null,
        cardNumber: response.card_number ?? null,
        phoneNo: response.phone_no ?? null,
        bankTrxId: response.bank_trx_id,
        invoiceNo: response.invoice_no,
        bankStatus: response.bank_status,
        currency: response.currency,
        customerName: response.name,
        customerEmail: response.email,
        customerAddress: response.address,
        customerCity: response.city,
        spCode: response.sp_code,
        spMessage: response.sp_message,
        trxStatus: response.transaction_status ?? null,
        method: response.method,
        paidAt: new Date(response.date_time + 6 * 60 * 60 * 1000),
      };

      const savePaymentData = await PaymentModel.create(
        [formattedVerifiedData],
        { session },
      );

      if (!savePaymentData || !savePaymentData[0]) {
        throwAppError(
          '',
          "Something went wrong. Payment Success but Couldn't Save to Server",
          StatusCodes.INTERNAL_SERVER_ERROR,
        );
      }

      const now = new Date();

      const updateOrder = await OrderModel.findByIdAndUpdate(
        savePaymentData[0].customerOrderId,
        {
          orderStatus: 'CONFIRMED',
          paymentStatus: 'PAID',
          estimatedDeliveryStart: new Date(
            now.getTime() + 2 * 24 * 60 * 60 * 1000,
          ),
          estimatedDeliveryEnd: new Date(
            now.getTime() + 12 * 24 * 60 * 60 * 1000,
          ),
        },
        { new: true, session },
      );

      if (!updateOrder) {
        throwAppError(
          'customerOrderId',
          "Something went Wrong. Couldn't Confirm the order",
          StatusCodes.NOT_FOUND,
        );
      }

      await session.commitTransaction();
      session.endSession();

      return savePaymentData[0]; // Return saved payment data
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  if (
    response.sp_message === 'Cancel' ||
    response.sp_message === 'Bank Response Failed'
  ) {
    await OrderModel.findByIdAndUpdate(response.customer_order_id, {
      paymentStatus: 'PAYMENT FAILED',
    });
  }

  return paymentRes;
};

const getMyPaymentHistoryFromDB = async (userToken: string) => {
  const decoded = jwt.verify(
    userToken as string,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  const result = await PaymentModel.find({ customerEmail: decoded.userEmail });

  if (!result.length) {
    throwAppError(
      'email',
      'Currently You have no Payment History',
      StatusCodes.NOT_FOUND,
    );
  }
  return result;
};

export const paymentServices = {
  createPaymentIntoDB,
  // getPaymentByTransactionIdFromDB,
  // getPaymentsByOrderIdFromDB,
  verifyPaymentFromShurjopay,
  getMyPaymentHistoryFromDB,
};
