import { model, Schema, Types } from 'mongoose';
import { TOrder } from './order.interface';

//creating the order schema bfrom the type Order
const orderSchema = new Schema<TOrder>(
  {
    email: { type: String, required: true },
    car: {
      type: Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

//creating a order model based on the orderSchema
export const OrderModel = model<TOrder>('Order', orderSchema);
