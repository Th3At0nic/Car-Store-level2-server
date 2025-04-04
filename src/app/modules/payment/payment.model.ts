import { model, Schema } from 'mongoose';
import { TPayment } from './payment.interface';

const paymentSchema = new Schema<TPayment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    transactionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['BDT', 'USD'], default: 'BDT' },
    paidAt: { type: Date },
  },
  { timestamps: true },
);

export const PaymentModel = model<TPayment>('Payment', paymentSchema);
