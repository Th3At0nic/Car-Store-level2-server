import { StatusCodes } from 'http-status-codes';
import throwAppError from '../../utils/throwAppError';
import { OrderModel } from '../order/order.model';
import config from '../../config';
import axios from 'axios';

type TShurjoPayRequest = {
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

export const initiateShurjoPayPayment = async (
  orderId: string,
): Promise<string> => {
  const order = await OrderModel.findById(orderId);

  if (!order) {
    throwAppError('orderId', 'Order Not Found', StatusCodes.NOT_FOUND);
  }

  const paymentData: TShurjoPayRequest = {
    username: config.sp_username as string,
    password: config.sp_password as string,

    prefix: config.sp_prefix as string,
    token: '',
    store_id: config.sp_store_id as string,

    amount: order?.totalPrice as number,
    order_id: orderId,
    currency: 'BDT',

    customer_name: (order?.customerName as string) || 'RAHAT',
    customer_address: (order?.customerAddress as string) || 'ADDRESS ONE',
    customer_city: 'Dhaka',
    customer_phone: (order?.customerPhone as string) || '23R2R2',
    customer_email: order?.customerEmail || 'rahat@gmail.com',

    return_url: `${config.sp_return_url}/api/payment/success`,
    cancel_url: `${config.sp_return_url}/api/payment/cancel`,
    client_ip: '102.324.0.5',
  };

  const tokenRes = await axios.post(
    config.sp_token_endpoint as string,
    { username: config.sp_username, password: config.sp_password },
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );

  const token = await tokenRes.data.token;
  const executeUrl = await tokenRes.data.execute_url;

  paymentData.store_id = await tokenRes.data.store_id;
  paymentData.token = token;

  const paymentRes = await axios.post(executeUrl, paymentData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!paymentRes.data.checkout_url) {
    throwAppError('', 'Payment initiation failed', StatusCodes.BAD_REQUEST);
  }

  // const dataToReturn = {
  //   checkoutUrl: paymentRes.data.checkout_url,
  //   amount: paymentRes.data.amount,
  //   currency: paymentRes.data.currency,
  //   transactionStatus: paymentRes.data.transactionStatus,
  // };

  return paymentRes.data.checkout_url; // Redirect URL for payment
};
