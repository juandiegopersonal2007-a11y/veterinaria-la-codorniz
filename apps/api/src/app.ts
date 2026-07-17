// apps/api/src/app.ts
import path from 'path';
import dotenv from 'dotenv';

// Carga envs: raíz del monorepo (.env.local / .env) y luego apps/api/.env
dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
const xss = require('xss-clean');
import winston from 'winston';
import { prisma } from './lib/prisma';

import authRoutes from './routes/auth.routes';
import clientRoutes from './routes/client.routes';
import petRoutes from './routes/pet.routes';
import appointmentRoutes from './routes/appointment.routes';
import dashboardRoutes from './routes/dashboard.routes';
import productRoutes from './routes/product.routes';

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

const app = express();

app.use(helmet());
const allowedOrigins = [
  'http://localhost:3000',
  'https://veterinaria-la-codorniz-web.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origen (como herramientas de prueba)
    if (!origin) return callback(null, true);
    
    const customFrontend = process.env.FRONTEND_URL;
    if (customFrontend && origin === customFrontend) {
      return callback(null, true);
    }
    
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production'
    ) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
}));
// 10 MB: permite subir fotos en base64 sin el corte del límite default (100kb)
app.use(express.json({ limit: '10mb' }));
app.use(xss());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use('/api/auth', authRoutes);

app.post('/api/appointments/public', async (req: Request, res: Response) => {
  try {
    const { name, petName, phone, service } = req.body;

    let client = await prisma.client.findFirst({
      where: { phone: phone }
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: name,
          phone: phone,
        }
      });
    }

    let pet = await prisma.pet.findFirst({
      where: {
        name: petName,
        clientId: client.id
      }
    });

    if (!pet) {
      pet = await prisma.pet.create({
        data: {
          name: petName,
          species: 'Desconocida',
          clientId: client.id
        }
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        clientId: client.id,
        petId: pet.id,
        date: new Date(),
        service: service.toUpperCase(),
        status: 'PENDING',
        notes: 'Solicitada desde el formulario web'
      }
    });

    return res.status(201).json(appointment);
  } catch (error) {
    logger.error('Error creating public appointment:', error);
    return res.status(500).json({ error: 'Error al registrar la cita en la base de datos' });
  }
});

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

app.use('/api/clients', clientRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes);

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

export default app;
