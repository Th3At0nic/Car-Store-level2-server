import { Types } from 'mongoose';

export type TPayment = {
  orderId: Types.ObjectId; // Reference to Order
  transactionId: string; // Unique transaction ID from ShurjoPay
  amount: number; // Payment amount
  currency: 'BDT' | 'USD'; // ShurjoPay only supports BDT
  paidAt?: Date; // Timestamp when payment was successful
  createdAt?: Date;
  updatedAt?: Date;
};
