import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { notFound } from './app/middlewares/notFound';
const app: Application = express();

app.use(express.json());
app.use(
  cors({ origin: 'https://carstore-client.vercel.app', credentials: true }), //http://localhost:5173
);

app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

//this is the global error handler
app.use(globalErrorHandler);

// not found handler
app.use(notFound);

export default app;

//http://localhost:5173
