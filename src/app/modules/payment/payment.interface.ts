import { Types } from 'mongoose';

export type TPayment = {
  spId: number; // `id` from ShurjoPay response
  spOrderId: string; // `order_id` from ShurjoPay
  customerOrderId: Types.ObjectId; // Your Order._id (reference)

  transactionId: string; // Same as spOrderId OR could be different from your side
  amount: number;
  discountAmount: number | null; // From `discsount_amount`
  payableAmount: number;
  discountPercent: number;
  receivedAmount: string;
  usdAmount: number; // from usd_amt
  usdRate: number;

  isVerified: boolean; // Derived from sp_message === 'Success' and bank_status
  cardHolderName: string | null;
  cardNumber: string | null;
  phoneNo: string | null;
  bankTrxId: string;
  invoiceNo: string;

  bankStatus: 'Success' | 'Failed' | 'Cancelled' | string; // Keep string fallback for unknown values
  currency: 'BDT' | 'USD'; // USD might be supported later by ShurjoPay, keeping it safe

  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerCity: string;

  spCode: string; // e.g. "1000" or "1064"
  spMessage: string; // e.g. "Success", "Unauthorized", etc.
  trxStatus: string | null; // `transaction_status`, sometimes null

  method: string; // e.g. "iBanking", could vary in future, so `string` not enum
  paidAt: Date; // Derived from `date_time` if Success

  value1?: string | null;
  value2?: string | null;
  value3?: string | null;
  value4?: string | null;

  createdAt?: Date;
  updatedAt?: Date;
};

export type TShurjoPayRequest = {
  username: string;
  password: string;
  prefix: string;
  token: string;
  store_id: string;
  amount: number;
  order_id: string;
  currency: string;
  customer_name: string;
  customer_address: string;
  customer_city: string;
  customer_phone: string;
  customer_email?: string;
  return_url: string;
  cancel_url: string;
  client_ip: string;
};
