// apps/api/src/routes/pet.routes.ts
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authMiddleware } from '../middlewares/auth.middleware';
import { uploadImage } from '../services/cloudinary.service';

const prisma = new PrismaClient();
const router = Router();

const petSchema = z.object({
  name: z.string().min(1),
  species: z.string().min(1),
  breed: z.string().optional().nullable(),
  birthDate: z.string().optional().nullable().transform(val => val ? new Date(val) : null),
  weight: z.number().optional().nullable(),
  chipNumber: z.string().optional().nullable(),
  clientId: z.string().cuid(),
  photo: z.string().optional().nullable(), // base64 photo
});

router.use(authMiddleware);

router.get('/', async (req: Request, res: Response) => {
  const pets = await prisma.pet.findMany({
    include: { client: { select: { name: true } } },
    orderBy: { name: 'asc' }
  });
  res.json(pets);
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { photo, ...petData } = petSchema.parse(req.body);
    let photoUrl = null;
    
    if (photo) {
      photoUrl = await uploadImage(photo);
    }

    const pet = await prisma.pet.create({ 
      data: { ...petData, photoUrl } 
    });
    res.status(201).json(pet);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const pet = await prisma.pet.findUnique({
    where: { id: req.params.id },
    include: { client: true, medicalHistory: true, appointments: true }
  });
  if (!pet) return res.status(404).json({ error: 'Mascota no encontrada' });
  res.json(pet);
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const data = petSchema.partial().parse(req.body);
    const pet = await prisma.pet.update({
      where: { id: req.params.id },
      data
    });
    res.json(pet);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  await prisma.pet.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
