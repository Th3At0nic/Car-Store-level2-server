import { model, Schema } from 'mongoose';
import { TOrder } from './order.interface';

//creating the order schema bfrom the type Order
const orderSchema = new Schema<TOrder>(
  {
    email: { type: String, required: true },
    car: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['PAID', 'UNPAID'],
      required: true,
    },
    estimatedDeliveryStart: { type: Date, required: true },
    estimatedDeliveryEnd: { type: Date, required: true },
  },
  {
    timestamps: true, // shows the create and update time
    versionKey: false, // disable the version key
  },
);

//creating a order model based on the orderSchema
export const OrderModel = model<TOrder>('Order', orderSchema);
