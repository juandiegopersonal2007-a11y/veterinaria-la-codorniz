// apps/api/src/routes/appointment.routes.ts
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authMiddleware } from '../middlewares/auth.middleware';
import { prisma } from '../lib/prisma';

const router = Router();

const appointmentSchema = z.object({
  clientId: z.string().cuid(),
  petId: z.string().cuid(),
  date: z.string().transform(val => new Date(val)),
  service: z.string(),
  status: z.string().optional(),
  notes: z.string().optional().nullable(),
});

router.use(authMiddleware);

router.get('/', async (req: Request, res: Response) => {
  const appointments = await prisma.appointment.findMany({
    include: { client: { select: { name: true } }, pet: { select: { name: true } } },
    orderBy: { date: 'asc' }
  });
  res.json(appointments);
});

// GET /api/appointments/calendar?month=YYYY-MM
router.get('/calendar', async (req: Request, res: Response) => {
  const { month } = req.query;

  if (!month || typeof month !== 'string' || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ error: 'Parámetro "month" inválido. Formato esperado: YYYY-MM' });
  }

  try {
    const [year, monthNumber] = month.split('-').map(Number);
    const startDate = new Date(year, monthNumber - 1, 1);
    const endDate = new Date(year, monthNumber, 0, 23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        client: { select: { name: true } },
        pet: { select: { name: true } },
      },
      orderBy: { date: 'asc' },
    });

    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el calendario de citas' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const data = appointmentSchema.parse(req.body);
    const appointment = await prisma.appointment.create({ data });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: req.params.id },
    include: { client: true, pet: true }
  });
  if (!appointment) return res.status(404).json({ error: 'Cita no encontrada' });
  res.json(appointment);
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const data = appointmentSchema.partial().parse(req.body);
    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data
    });
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  await prisma.appointment.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
