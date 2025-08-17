import { Router } from 'express';
import authRouter from './authRoutes.js';
import reportRouter from './reportRoutes.js';
import diagnosisRouter from './diagnosisRoutes.js';
import userRouter from './userRoutes.js';

const router = Router();

// Health check route
router.get('/status', (req, res) => res.json({ status: 'ok' }));

// Hook up other routers
router.use('/auth', authRouter);
router.use('/reports', reportRouter);
router.use('/diagnose', diagnosisRouter);
router.use('/user', userRouter);

export default router;