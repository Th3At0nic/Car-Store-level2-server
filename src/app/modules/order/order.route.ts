import express from 'express';
import { OrderController } from './order.controller';
import { auth } from '../../middlewares/authRequest';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-order',
  auth(USER_ROLE.user, USER_ROLE.admin),
  OrderController.createOrderWithInventoryManagement,
);

//exporting the router
export const OrderRoutes = router;
