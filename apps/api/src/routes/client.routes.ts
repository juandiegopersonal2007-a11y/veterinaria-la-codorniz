// apps/api/src/routes/client.routes.ts
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authMiddleware } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();
const router = Router();

const clientSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional().nullable(),
  address: z.string().optional().nullable(),
});

router.use(authMiddleware);

router.get('/', async (req: Request, res: Response) => {
  const clients = await prisma.client.findMany({
    include: { _count: { select: { pets: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(clients);
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const data = clientSchema.parse(req.body);
    const client = await prisma.client.create({ data });
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const client = await prisma.client.findUnique({
    where: { id: req.params.id },
    include: { pets: true, appointments: { include: { pet: true } } }
  });
  if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.json(client);
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const data = clientSchema.partial().parse(req.body);
    const client = await prisma.client.update({
      where: { id: req.params.id },
      data
    });
    res.json(client);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  await prisma.client.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
