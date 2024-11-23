//creating a type name Order

import { ObjectId } from 'mongoose';

export type TOrder = {
  email: string;
  car: ObjectId;
  quantity: number;
  totalPrice: number;
};
