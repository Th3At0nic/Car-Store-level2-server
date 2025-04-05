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

export type TShurjoPayRequest = {
  username: string;
  password: string;
  prefix: string;
  token: string;
  store_id: string;
  amount: number;
  order_id: string;
  currency: string;
  customer_name: string;
  customer_address: string;
  customer_city: string;
  customer_phone: string;
  customer_email?: string;
  return_url: string;
  cancel_url: string;
  client_ip: string;
};
