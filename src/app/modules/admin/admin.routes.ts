import { Router } from 'express';
import { auth } from '../../middlewares/authRequest';
import { USER_ROLE } from '../user/user.constant';
import { AdminControllers } from './admin.controller';

const router = Router();

router.patch(
  '/users/:userId',
  auth(USER_ROLE.admin),
  AdminControllers.deactivateUserByAdmin,
);

router.get('/orders', auth(USER_ROLE.admin), AdminControllers.getAllOrders);

router.get('/users', auth(USER_ROLE.admin), AdminControllers.getAllUsers);

router.get(
  '/orders/revenue',
  auth(USER_ROLE.admin),
  AdminControllers.calcRevenue,
);

export const AdminRoutes = router;
