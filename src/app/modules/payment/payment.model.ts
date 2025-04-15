import { model, Schema } from 'mongoose';
import { TPayment } from './payment.interface';

const paymentSchema = new Schema<TPayment>(
  {
    spId: {
      type: Number,
      required: true,
    },
    spOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    customerOrderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: null,
    },
    payableAmount: {
      type: Number,
      required: true,
    },
    discountPercent: {
      type: Number,
      required: true,
    },
    receivedAmount: {
      type: String,
      required: true,
    },
    usdAmount: {
      type: Number,
      required: true,
    },
    usdRate: {
      type: Number,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    cardHolderName: {
      type: String,
      default: null,
    },
    cardNumber: {
      type: String,
      default: null,
    },
    phoneNo: {
      type: String,
      default: null,
    },
    bankTrxId: {
      type: String,
      required: true,
    },
    invoiceNo: {
      type: String,
      required: true,
    },
    bankStatus: {
      type: String,
      enum: ['Success', 'Failed', 'Cancelled'],
      default: 'Failed',
    },
    currency: {
      type: String,
      enum: ['BDT', 'USD'],
      default: 'BDT',
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerAddress: {
      type: String,
      required: true,
    },
    customerCity: {
      type: String,
      required: true,
    },
    spCode: {
      type: String,
      required: true,
    },
    spMessage: {
      type: String,
      required: true,
    },
    trxStatus: {
      type: String,
      default: null,
    },
    method: {
      type: String,
      required: true,
    },
    paidAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const PaymentModel = model<TPayment>('Payment', paymentSchema);
