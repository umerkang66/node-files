import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';

import { errorHandler } from './middlewares/error-handler';
import { authRouter } from './routes/auth';
import { adminUsersRouter } from './routes/admin/users';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/api/umerdidthis', (_, res) => {
  console.log('umer did this');
  res.send({ name: 'kangdidthis' });
});

// Routes
app.use('/api/auth', authRouter);
// These routes are all controlled by admin
app.use('/api/admin/users', adminUsersRouter);

if (process.env.NODE_ENV === 'production') {
  // FIRSTLY the express will check if the request for any static file has come, then it will serve static files, SECONDLY it will check about the routes for react router, then it will serve the index.html file that again will send the recommended static files

  // 1) Express will serve up production assets, like main.js file, or main.css file
  const staticPath = path.join(process.cwd(), 'client', 'build');
  app.use(express.static(staticPath));

  // 2) Express will serve up the index.html file if it doesn't recognize the route
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

// Error Handler
app.use(errorHandler);

export { app };
