// apps/api/src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
const xss = require('xss-clean');
import { PrismaClient } from '@prisma/client';
import winston from 'winston';

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

import authRoutes from './routes/auth.routes';
import clientRoutes from './routes/client.routes';
import petRoutes from './routes/pet.routes';
import appointmentRoutes from './routes/appointment.routes';
import dashboardRoutes from './routes/dashboard.routes';

const prisma = new PrismaClient();
const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(xss());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Auth Routes
app.use('/api/auth', authRoutes);

// Protected Routes
app.use('/api/clients', clientRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Public Routes (Buscador de chip)
app.get('/api/pets/chip/:chipNumber', async (req: Request, res: Response) => {
  try {
    const { chipNumber } = req.params;
    const pet = await prisma.pet.findUnique({
      where: { chipNumber },
      include: {
        client: {
          select: {
            name: true,
            phone: true,
          }
        }
      }
    });

    if (!pet) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    // Return sanitized data for privacy
    const sanitizedClientName = pet.client.name.split(' ')[0] + ' ***';
    const sanitizedClientPhone = pet.client.phone.slice(0, -4) + '****';

    return res.json({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      owner: sanitizedClientName,
      phone: sanitizedClientPhone,
    });
  } catch (error) {
    logger.error('Error in chip search:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

export default app;
