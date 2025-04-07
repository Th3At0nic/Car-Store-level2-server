//creating a type name Order

import { Types } from 'mongoose';

export type TOrder = {
  customerEmail: string;
  car: Types.ObjectId;
  quantity: number;
  totalPrice: number;
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  paymentStatus: 'PAID' | 'UNPAID' | 'PAYMENT FAILED';
  estimatedDeliveryStart: Date | undefined;
  estimatedDeliveryEnd: Date | undefined;

  customerName: string;
  customerPhone: string;
  customerAddress: string;
};
