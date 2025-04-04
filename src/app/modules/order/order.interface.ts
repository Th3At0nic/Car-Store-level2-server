//creating a type name Order

import { Types } from 'mongoose';

export type TOrder = {
  customerEmail: string;
  car: Types.ObjectId;
  quantity: number;
  totalPrice: number;
  orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  paymentStatus: 'PAID' | 'UNPAID' | 'FAILED';
  estimatedDeliveryStart: Date | undefined;
  estimatedDeliveryEnd: Date | undefined;

  customerName: string;
  customerPhone: string;
  customerAddress: string;
};
