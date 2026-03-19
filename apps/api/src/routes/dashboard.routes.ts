// apps/api/src/routes/dashboard.routes.ts
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();
const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

// GET /api/dashboard/stats
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const [clientsCount, petsCount, appointmentsCount] = await Promise.all([
      prisma.client.count(),
      prisma.pet.count(),
      prisma.appointment.count(),
    ]);

    return res.json({
      clients: clientsCount,
      pets: petsCount,
      appointments: appointmentsCount,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener estadísticas del dashboard' });
  }
});

export default router;

