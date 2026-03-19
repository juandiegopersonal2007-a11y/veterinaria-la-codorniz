# Veterinaria La Codorniz

Este proyecto es una plataforma web para la gestión de una veterinaria, incluyendo administración de clientes, mascotas, citas y servicios.

## Estructura del proyecto

- **apps/api**: Backend (Express + Prisma + Supabase)
- **apps/web**: Frontend (Next.js + Tailwind CSS)

## Instalación y ejecución local

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Compila el backend:
   ```bash
   cd apps/api && npm run build
   ```
3. Inicia el backend:
   ```bash
   cd apps/api && npm run dev
   ```
4. Inicia el frontend:
   ```bash
   cd apps/web && npm run dev
   ```

## Variables de entorno

- `.env` en la raíz y en `apps/api`:
  - `DATABASE_URL`: URL de conexión a Supabase
  - `JWT_SECRET`, `JWT_REFRESH_SECRET`, etc.
- `.env` en `apps/web`:
  - `NEXT_PUBLIC_API_URL`: URL del backend

## Despliegue

- **Frontend**: Netlify
- **Backend**: Render
- **Base de datos**: Supabase

## Notas
- El frontend se conecta al backend usando la variable `NEXT_PUBLIC_API_URL`.
- El backend debe estar corriendo para que la web funcione correctamente.

## Autor
- Diego (veterinariacoodorniz@gmail.com)

---

Para dudas o soporte, contacta por email o revisa la documentación en cada carpeta.
