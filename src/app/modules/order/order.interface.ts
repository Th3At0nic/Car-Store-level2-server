//creating a type name Order

import { Types } from 'mongoose';

export type TOrder = {
  email: string;
  car: Types.ObjectId;
  quantity: number;
  totalPrice: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
};
