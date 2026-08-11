import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/user.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import orderRoutes from './routes/order.routes.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));


app.use('/api/auth', userRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);

export default app;