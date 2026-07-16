// apps/api/prisma/seed.ts
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@veterinariacodorniz.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'CambiarEsto123!';

  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin Codorniz',
      role: 'ADMIN',
    },
  });

  console.log('Admin created:', admin.email);

  const serviceDefs = [
    { name: 'Consulta General', description: 'Evaluación completa de salud.', price: 350 },
    { name: 'Vacunación', description: 'Refuerzos y vacunas iniciales.', price: 250 },
    { name: 'Estética Canina', description: 'Baño, corte y limpieza.', price: 400 },
  ];

  for (const s of serviceDefs) {
    const existing = await prisma.service.findFirst({ where: { name: s.name } });
    if (!existing) {
      await prisma.service.create({ data: { ...s, active: true } });
    }
  }
  console.log('Services ready');

  const productDefs = [
    {
      name: 'Alimento Premium para Perros',
      category: 'Alimentos',
      price: 450,
      description: 'Nutrición completa para tu mejor amigo, con proteínas de alta calidad.',
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'Shampoo Aloe Vera para Mascotas',
      category: 'Cuidado',
      price: 180,
      description: 'Hipoalergénico, ideal para pieles sensibles. Deja el pelaje suave y brillante.',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1568640347023-a616a0d424b6?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'Collar Reflectante Seguro',
      category: 'Accesorios',
      price: 120,
      description: 'Seguridad nocturna con material reflectante. Ajustable y resistente.',
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1583512603805-3cc6b7f065a1?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'Juguete para Morder Resistente',
      category: 'Juguetes',
      price: 85,
      description: 'Para horas de diversión! Resistente y seguro para tu mascota.',
      rating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'Alimento para Gatos Adultos',
      category: 'Alimentos',
      price: 420,
      description: 'Fórmula balanceada para mantener a tu gatito sano y feliz.',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'Cama Orthopédica Premium',
      category: 'Accesorios',
      price: 890,
      description: 'Confort máximo para mascotas mayores o con problemas articulares.',
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    },
  ];

  for (const p of productDefs) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.product.create({ data: { ...p, active: true } });
    }
  }
  console.log('Products ready');

  const existingClient = await prisma.client.findFirst({ where: { phone: '3131163103' } });
  if (!existingClient) {
    const client1 = await prisma.client.create({
      data: {
        name: 'Diego Pérez',
        phone: '3131163103',
        email: 'diego@test.com',
        address: 'Tecomán, Colima',
        pets: {
          create: {
            name: 'Firulais',
            species: 'Perro',
            breed: 'Labrador',
            birthDate: new Date('2020-05-10'),
            chipNumber: 'CHIP-001',
          },
        },
      },
      include: { pets: true },
    });

    const pet1 = client1.pets[0];
    if (pet1) {
      await prisma.appointment.create({
        data: {
          clientId: client1.id,
          petId: pet1.id,
          date: new Date(),
          service: 'CONSULTA',
          status: 'PENDING',
        },
      });
    }
    console.log('Sample clients, pets and appointments created');
  } else {
    console.log('Sample client already exists, skipping');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
