import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { env } from './config/env';
import { prisma } from './config/prisma';
import { adminRouter } from './routes/admin.routes';
import { authRouter } from './routes/auth.routes';
import { propertyRouter } from './routes/property.routes';
import { userRouter } from './routes/user.routes';
import { globalLimiter } from './middleware/rate-limit.middleware';

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);
app.use(express.json());
app.use(globalLimiter);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/properties', propertyRouter);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
});

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(env.PORT, () => {
  console.log(`Backend running at http://localhost:${env.PORT}`);
});

const gracefulShutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
