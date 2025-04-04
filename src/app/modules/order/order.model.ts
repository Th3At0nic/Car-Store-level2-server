import { model, Schema } from 'mongoose';
import { TOrder } from './order.interface';

//creating the order schema bfrom the type Order
const orderSchema = new Schema<TOrder>(
  {
    customerEmail: { type: String, required: true },
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
      enum: ['PAID', 'UNPAID', 'FAILED'],
      required: true,
    },
    estimatedDeliveryStart: { type: Date },
    estimatedDeliveryEnd: { type: Date },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, required: true },
  },
  {
    timestamps: true, // shows the create and update time
    versionKey: false, // disable the version key
  },
);

//creating a order model based on the orderSchema
export const OrderModel = model<TOrder>('Order', orderSchema);
