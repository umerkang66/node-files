import express from 'express';
import cookieParser from 'cookie-parser';

import { errorHandler } from './middlewares/error-handler';
import { authRouter } from './routes/auth';
import { adminUsersRouter } from './routes/admin/users';

const app = express();
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);
// These routes are all controlled by admin
app.use('/api/admin/users', adminUsersRouter);

// Error Handler
app.use(errorHandler);

export { app };
