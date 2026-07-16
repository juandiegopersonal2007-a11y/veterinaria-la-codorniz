import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';
import { deleteImageByUrl, uploadImage } from '../services/r2.service';

const router = Router();

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  price: z.number().positive(),
  rating: z.number().min(0).max(5).optional(),
  active: z.boolean().optional(),
  image: z.string().optional().nullable(), // data URL base64
});

/** Público: solo productos activos (tienda). */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar productos' });
  }
});

router.use(authMiddleware, adminMiddleware);

/** Admin: todos los productos. */
router.get('/admin/all', async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar productos' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { image, ...data } = productSchema.parse(req.body);
    let imageUrl: string | null = null;

    if (image) {
      imageUrl = await uploadImage(image, 'products');
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        rating: data.rating ?? 4.5,
        active: data.active ?? true,
        imageUrl,
      },
    });
    res.status(201).json(product);
  } catch (error: any) {
    const message = error?.message || 'Error al crear producto';
    res.status(400).json({ error: message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { image, ...data } = productSchema.partial().parse(req.body);
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    let imageUrl = existing.imageUrl;
    if (image) {
      imageUrl = await uploadImage(image, 'products');
      await deleteImageByUrl(existing.imageUrl);
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { ...data, imageUrl },
    });
    res.json(product);
  } catch (error: any) {
    const message = error?.message || 'Error al actualizar producto';
    res.status(400).json({ error: message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await prisma.product.delete({ where: { id: req.params.id } });
    await deleteImageByUrl(existing.imageUrl);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

export default router;
