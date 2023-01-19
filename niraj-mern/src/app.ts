import express from 'express';
import cookieParser from 'cookie-parser';

import { errorHandler } from './middlewares/error-handler';
import { authRouter } from './routes/auth';

const app = express();
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);

// Error Handler
app.use(errorHandler);

export { app };
