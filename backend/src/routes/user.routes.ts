import { Router } from 'express';
import { userDashboard } from '../controllers/user.controller';
import { asyncHandler } from '../middleware/async-handler.middleware';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

export const userRouter = Router();

userRouter.get('/dashboard', requireAuth, requireRole('USER'), asyncHandler(userDashboard));
