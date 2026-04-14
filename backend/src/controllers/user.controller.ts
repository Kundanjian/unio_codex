import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const userDashboard = async (req: AuthenticatedRequest, res: Response) => {
  return res.status(200).json({
    message: 'User dashboard data',
    user: req.user
  });
};
