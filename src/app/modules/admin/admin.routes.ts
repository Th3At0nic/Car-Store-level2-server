import { NextFunction, Request, Response, Router } from 'express';
import { auth } from '../../middlewares/authRequest';
import { USER_ROLE } from '../user/user.constant';
import { AdminControllers } from './admin.controller';
import { upload } from '../../utils/sendImageToCloudinary';
import {
  carValidationSchema,
  updateCarValidationSchema,
} from '../car/car.validation';
import { validateRequest } from '../../middlewares/validateRequest';

const router = Router();

router.post(
  '/add-car',
  auth(USER_ROLE.admin),
  upload.array('files', 5),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(carValidationSchema),
  AdminControllers.createACar,
);

router.put(
  '/:carId',
  auth(USER_ROLE.admin),
  validateRequest(updateCarValidationSchema),
  AdminControllers.updateACar,
);

router.delete('/:carId', auth(USER_ROLE.admin), AdminControllers.deleteACar);

router.patch(
  '/users/:userId',
  auth(USER_ROLE.admin),
  AdminControllers.deactivateUserByAdmin,
);

router.get('/orders', auth(USER_ROLE.admin), AdminControllers.getAllOrders);

router.get(
  '/orders/:orderId',
  auth(USER_ROLE.admin),
  AdminControllers.getAnOrder,
);

router.get('/users', auth(USER_ROLE.admin), AdminControllers.getAllUsers);

router.get(
  '/orders/revenue',
  auth(USER_ROLE.admin),
  AdminControllers.calcRevenue,
);

router.delete(
  '/orders/:orderId',
  auth(USER_ROLE.admin),
  AdminControllers.deleteOrder,
);

export const AdminRoutes = router;
