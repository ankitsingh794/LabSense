import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import passport from './config/passport.js'; 

import indexRouter from './routes/indexRoutes.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();


// Middleware setup
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',  
  credentials: true
}));
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());


// Health check route
app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'LabSense API',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// --- Main API routes ---
app.use('/api', indexRouter);

// --- Error handling ---
app.use(notFound);
app.use(errorHandler);

export default app;
