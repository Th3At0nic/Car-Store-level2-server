import express from 'express';
import { OrderController } from './order.controller';
import { auth } from '../../middlewares/authRequest';
import { USER_ROLE } from '../user/user.constant';
import { orderValidationSchema } from './order.validation';
import { validateRequest } from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/create-order',
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(orderValidationSchema),
  OrderController.createOrderWithInventoryManagement,
);

router.get(
  '/',
  auth(USER_ROLE.user, USER_ROLE.admin),
  OrderController.getMyOrders,
);

//exporting the router
export const OrderRoutes = router;
