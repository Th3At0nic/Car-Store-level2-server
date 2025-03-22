import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CarRoutes } from '../modules/car/car.route';
import { OrderRoutes } from '../modules/order/order.route';
import { AdminRoutes } from '../modules/admin/admin.routes';

const router = Router();

const routeModules = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/cars',
    route: CarRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
];

routeModules.forEach((route) => router.use(route.path, route.route));

export default router;
