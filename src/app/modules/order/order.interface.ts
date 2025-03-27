//creating a type name Order

import { Types } from 'mongoose';

export type TOrder = {
  email: string;
  car: Types.ObjectId;
  quantity: number;
  totalPrice: number;
  orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  paymentStatus: 'PAID' | 'UNPAID';
  estimatedDeliveryStart: Date;
  estimatedDeliveryEnd: Date;
};
