import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { CarRoutes } from './modules/car/car.route';
import { OrderRoutes } from './modules/order/order.route';
const app: Application = express();

app.use(express.json());
app.use(cors());

//routing to the car.router
app.use('/api/cars', CarRoutes);

//routing to the order router
app.use('/api/orders', OrderRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

export default app;
