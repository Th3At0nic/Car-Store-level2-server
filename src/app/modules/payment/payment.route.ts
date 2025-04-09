import { Router } from 'express';
import { paymentControllers } from './payment.controller';

const router = Router();

// router.get('/:transactionId', paymentControllers.getPaymentInfoByTransactionId);

router.get('/history', paymentControllers.getMyPaymentHistory);

router.get('/verifyPayment', paymentControllers.verifyPayment);

export const PaymentRoutes = router;
