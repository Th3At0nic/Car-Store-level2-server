import { StatusCodes } from 'http-status-codes';
import throwAppError from '../../utils/throwAppError';
import { OrderModel } from '../order/order.model';
import config from '../../config';
import axios from 'axios';
import { TShurjoPayRequest } from './payment.interface';

let cachedToken: string | null = null;

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

    return_url: `${config.sp_return_url}`,
    cancel_url: `${config.sp_return_url}`,
    client_ip: '102.324.0.5',
  };

  //retrieving token from the shurjopay with credentials
  const tokenRes = await axios.post(
    `${config.sp_endpoint}/get_token`,
    { username: config.sp_username, password: config.sp_password },
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );
  //extracting for shortcut
  const token = await tokenRes.data.token;
  const executeUrl = await tokenRes.data.execute_url;

  // assigning token to global variable to reuse it
  cachedToken = token;
  // console.log('cached token: ', cachedToken);

  //assigning store id and token to paymentData dynamically
  paymentData.store_id = await tokenRes.data.store_id;
  paymentData.token = token;

  const paymentRes = await axios.post(executeUrl, paymentData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // console.log('paymentRes: ', paymentRes.data);

  if (!paymentRes.data.checkout_url) {
    throwAppError('', 'Payment initiation failed', StatusCodes.BAD_REQUEST);
  }

  return paymentRes.data.checkout_url; // Redirect URL for payment
};

export const verifyShurjopayTransaction = async (spOrderId: string) => {
  const verificationRes = await axios.post(
    `${config.sp_endpoint}/verification`,
    { order_id: spOrderId },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cachedToken}`,
      },
    },
  );

  // console.log('verifi res uti: ', verificationRes.data);
  return verificationRes.data;
};
