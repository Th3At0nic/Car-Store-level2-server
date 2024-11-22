import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { CarRoutes } from './modules/car/car.route';
const app: Application = express();

app.use(express.json());
app.use(cors());

//routing to the car.router
app.use('/api/cars', CarRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

export default app;
