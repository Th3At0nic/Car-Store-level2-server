import { Router } from 'express';
import { paymentControllers } from './payment.controller';

const router = Router();

// router.get('/:transactionId', paymentControllers.getPaymentInfoByTransactionId);

// router.get('/:orderId', paymentControllers.getPaymentInfoByOrderId);

router.get('/verifyPayment', paymentControllers.verifyPayment);

export const PaymentRoutes = router;
