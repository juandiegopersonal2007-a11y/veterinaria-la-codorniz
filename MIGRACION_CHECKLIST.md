# Migración Neon + Cloudflare R2 — Checklist

## Ya resuelto en código

- [x] Prisma apuntando a Neon PostgreSQL (`DATABASE_URL` pooled + `DIRECT_URL`)
- [x] Esquema sincronizado en Neon (`prisma db push`) + seed (admin, servicios, productos, ejemplo)
- [x] Imágenes con Cloudflare R2 (subida verificada: upload + URL pública OK)
- [x] Cloudinary eliminado; límite JSON de API subido a 10 MB (antes cortaba fotos en base64)
- [x] Modelo `Product` + API `/api/products` + tienda leyendo de la DB
- [x] Admin → Productos (`/admin/productos`) para subir/editar imágenes
- [x] Foto de mascota en admin → R2
- [x] `next.config.js` con dominio R2 permitido
- [x] Scripts: `db:generate`, `db:push`, `db:seed`, `api` build con `prisma generate`

## Decisiones (resumen)

| Tema | Recomendación aplicada |
|------|------------------------|
| Neon pooled vs directa | **Pooled** en runtime (serverless); **directa** solo en migraciones |
| R2 público vs URLs firmadas | **Bucket público** — más simple para tienda y fotos de mascotas |

## Lo que tú debes hacer manualmente

### 1. Cloudflare R2 (ya casi listo)
- [x] Bucket `veterinaria-codorniz-productos` creado
- [x] Public Access / URL `pub-....r2.dev` configurada
- [ ] (Opcional) Conectar dominio custom tipo `img.tudominio.com` y actualizar `R2_PUBLIC_URL` + `next.config.js`

### 2. Variables locales
- [ ] Confirma que `apps/api/.env` y `.env.local` tienen Neon + R2 (ya sincronizados en esta migración)
- [ ] Copia JWT y `ADMIN_*` desde `apps/api/.env` si te faltan en `.env.local`
- [ ] Nunca subas `.env` / `.env.local` al repo

### 3. Hosting de la API (importante)
Vercel hospeda bien el **frontend Next.js**. La API es **Express** y necesita otro servicio gratuito o de pago que no se pause (o con wake corto):

Opciones recomendadas: **Render** (actualmente configurada) o **Fly.io**.

En ese servicio configura las mismas env vars:
`DATABASE_URL`, `DIRECT_URL`, `R2_*`, `JWT_*`, `FRONTEND_URL`, `ADMIN_*`, `PORT`

Build/start tipicos:
```
cd apps/api
npm install
npm run build
npm start
```

### 4. Frontend en Vercel
- [ ] Importa el repo en Vercel
- [ ] Root Directory: `apps/web`
- [ ] Env vars en Vercel:
  - `NEXT_PUBLIC_API_URL` = `https://veterinaria-api-88vn.onrender.com/api` (o la URL real de tu API en Render)
  - `NEXT_PUBLIC_WHATSAPP_NUMBER`, redes, etc.
- [ ] Deploy y prueba `/tienda`, `/chip`, `/login`, `/admin/productos`

### 5. Dominio propio
- [ ] En Vercel: Settings → Domains → añade tu dominio
- [ ] Actualiza DNS según indique Vercel
- [ ] Pon `FRONTEND_URL` en la API con `https://tudominio.com` (CORS)

### 6. Seguridad post-deploy
- [ ] Cambia `ADMIN_PASSWORD` y vuelve a hashear/seed o actualiza en DB
- [ ] Rota `JWT_SECRET` / `JWT_REFRESH_SECRET` si los de local son débiles
- [ ] Si las keys de R2 se expusieron en algún chat/archivo, rótalas en Cloudflare

### 7. Prueba rápida local
```bash
npm run db:push
npm run db:seed
npm run api:build && npm run api:dev
# otra terminal
npm run web:dev
```
Abre `http://localhost:12345/tienda` y `http://localhost:12345/admin/productos`.
