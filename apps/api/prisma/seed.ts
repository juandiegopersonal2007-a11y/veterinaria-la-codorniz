// apps/api/prisma/seed.ts
import { PrismaClient, Role, ServiceType, AppointmentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Admin User
  const hashedPassword = await bcrypt.hash('CambiarEsto123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@veterinariacodorniz.com' },
    update: {},
    create: {
      email: 'admin@veterinariacodorniz.com',
      password: hashedPassword,
      name: 'Admin Codorniz',
      role: Role.ADMIN,
    },
  });

  console.log('Admin created:', admin.email);

  // Services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Consulta General',
        description: 'Evaluación completa de salud.',
        price: 350,
        active: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Vacunación',
        description: 'Refuerzos y vacunas iniciales.',
        price: 250,
        active: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Estética Canina',
        description: 'Baño, corte y limpieza.',
        price: 400,
        active: true,
      },
    }),
  ]);

  console.log('Services created');

  // Clients & Pets
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
    include: {
      pets: true,
    },
  });

  const pet1 = client1.pets[0];
  if (pet1) {
    await prisma.appointment.create({
      data: {
        clientId: client1.id,
        petId: pet1.id,
        date: new Date(),
        service: ServiceType.CONSULTA,
        status: AppointmentStatus.PENDING,
      }
    });
  }

  console.log('Sample clients, pets and appointments created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
