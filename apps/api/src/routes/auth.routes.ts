// apps/api/src/routes/auth.routes.ts
import { Router, Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware';
import { prisma } from '../lib/prisma';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user || !(await bcrypt.compare(validatedData.password, user.password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const secret = process.env.JWT_SECRET || 'tu_secreto_super_seguro_de_al_menos_32_chars';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '8h' }
    );

    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'otro_secreto_diferente_32_chars';
    const refreshToken = jwt.sign(
      { id: user.id },
      refreshTokenSecret,
      { expiresIn: '7d' }
    );

    return res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Datos de entrada inválidos', details: error.errors });
    }
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener usuario autenticado
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Renovar access token usando refresh token
router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Se requiere refreshToken' });
  }

  try {
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'otro_secreto_diferente_32_chars';
    const decoded = jwt.verify(refreshToken, refreshSecret) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const secret = process.env.JWT_SECRET || 'tu_secreto_super_seguro_de_al_menos_32_chars';
    const newToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '8h' }
    );

    // Rotar el refresh token también
    const newRefreshToken = jwt.sign(
      { id: user.id },
      refreshSecret,
      { expiresIn: '7d' }
    );

    return res.json({ token: newToken, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(401).json({ error: 'Refresh token inválido o expirado. Por favor inicia sesión nuevamente.' });
  }
});

// Logout (elimina token en cliente, endpoint informativo)
router.post('/logout', authMiddleware, (req: AuthRequest, res: Response) => {
  return res.status(200).json({ message: 'Sesión cerrada correctamente' });
});

export default router;
