"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// apps/api/prisma/seed.ts
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
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
            role: client_1.Role.ADMIN,
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
                service: client_1.ServiceType.CONSULTA,
                status: client_1.AppointmentStatus.PENDING,
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
//# sourceMappingURL=seed.js.map