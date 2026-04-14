import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const adminDashboard = async (req: AuthenticatedRequest, res: Response) => {
  const totalUsers = await prisma.user.count();
  const totalAdmins = await prisma.user.count({ where: { role: 'ADMIN' } });

  return res.status(200).json({
    message: 'Admin dashboard data',
    user: req.user,
    stats: {
      totalUsers,
      totalAdmins
    }
  });
};
