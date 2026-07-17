# Guía de despliegue a producción

## Arquitectura del proyecto

```
Frontend (Next.js)  →  Vercel
Backend (Express)   →  Render (Web Service)
Base de datos       →  Neon (PostgreSQL serverless)
Imágenes            →  Cloudflare R2
```

---

## PASO 1 — Subir el código a GitHub

1. Ve a [github.com](https://github.com) y crea un repositorio nuevo:
   - Nombre: `veterinaria-la-codorniz` (o el que prefieras)
   - Visibilidad: **Private** (recomendado — tiene credenciales en los secrets)
   - No inicialices con README ni .gitignore

2. En la terminal de tu computadora, dentro de la carpeta del proyecto:

```bash
git remote add origin https://github.com/TU_USUARIO/veterinaria-la-codorniz.git
git branch -M main
git add .
git commit -m "feat: deploy inicial"
git push -u origin main
```

---

## PASO 2 — Desplegar la API en Render

Render hospeda el backend Express.

1. Ve a [render.com](https://render.com) e inicia sesión con tu cuenta de GitHub.

2. Haz clic en **New + → Web Service**.

3. Selecciona tu repositorio `veterinaria-la-codorniz`.

4. En la configuración del servicio:
   - **Name:** `veterinaria-api`
   - **Root Directory:** `apps/api`
   - **Runtime:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`

5. En la sección **Environment Variables**, añade estas variables de entorno una por una:

```
DATABASE_URL=postgresql://neondb_owner:npg_i6mtXzh3FfST@ep-purple-union-aumemj4w-pooler.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

DIRECT_URL=postgresql://neondb_owner:npg_i6mtXzh3FfST@ep-purple-union-aumemj4w.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=YDgWg_foXFO-GyjFW1dDs1onsuAW_Z4Z!nqp_RtN-MD0qB6X
JWT_REFRESH_SECRET=YIfqWAYGcsGAXMSrqs9gn%1V0yjmCKFR8NKHumB0YGittrCO
JWT_EXPIRES_IN=8h
JWT_REFRESH_EXPIRES_IN=7d

R2_ACCOUNT_ID=c18b8415a11b1f13012c8b8915b2ded7
R2_ACCESS_KEY_ID=6266e7700ad23834702387ddaca595e0
R2_SECRET_ACCESS_KEY=9e1c779495156a31891ec30a91481408d6cacb5f802f19bbef3d330a09ba2275
R2_ENDPOINT=https://c18b8415a11b1f13012c8b8915b2ded7.r2.cloudflarestorage.com
R2_BUCKET_NAME=veterinaria-codorniz-productos
R2_PUBLIC_URL=https://pub-ccf8a9a9104b48a5a457aab2e743cf0b.r2.dev

ADMIN_EMAIL=admin@veterinariacodorniz.com
ADMIN_PASSWORD=Codorniz-hJrl@@RQ*1FZNP

NODE_ENV=production
PORT=3001
```

> **FRONTEND_URL** lo añades después, cuando tengas la URL de Vercel (Paso 4).

6. Haz clic en **Create Web Service**. Espera a que se complete el build y el despliegue.

7. Copia la URL que te asigna Render, por ejemplo: `https://veterinaria-api-88vn.onrender.com`.

---

## PASO 3 — Desplegar el frontend en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.

2. Haz clic en **Add New → Project**.

3. Importa el repositorio `veterinaria-la-codorniz`.

4. En la configuración del proyecto:
   - **Framework Preset:** Next.js (se detecta automático)
   - **Root Directory:** `apps/web`
   - **Build Command:** `next build` (default)
   - **Output Directory:** `.next` (default)

5. Ve a **Settings → Environment Variables** del proyecto en Vercel y añade:

```
NEXT_PUBLIC_API_URL=https://veterinaria-api-88vn.onrender.com/api
NEXT_PUBLIC_WHATSAPP_NUMBER=523131163103
```

6. Haz clic en **Deploy**.

7. Copia la URL de Vercel (formato: `https://veterinaria-la-codorniz-web.vercel.app`).

---

## PASO 4 — Conectar API y frontend (CORS)

Ahora que tienes la URL de Vercel:

1. Abre tu panel de control de Render y entra a tu servicio de API.
2. Ve a la pestaña **Environment** y añade o actualiza:

```
FRONTEND_URL=https://veterinaria-la-codorniz-web.vercel.app
```

3. Render redesplegará automáticamente para aplicar el cambio.

---

## PASO 5 — Verificar que todo funciona

Abre estas URLs en el navegador y verifica:

| Página | URL esperada |
|--------|-------------|
| Inicio | `https://tu-proyecto.vercel.app` |
| Tienda | `https://tu-proyecto.vercel.app/tienda` |
| Admin  | `https://tu-proyecto.vercel.app/admin/dashboard` |
| Health API | `https://veterinaria-api-88vn.onrender.com/api/health` |

El endpoint `/api/health` debe responder: `{"status":"ok","db":"connected"}`

Para el login del admin:
- Email: `admin@veterinariacodorniz.com`
- Contraseña: `Codorniz-hJrl@@RQ*1FZNP`

---

## PASO 6 — Conectar dominio propio (opcional)

Si tienes un dominio (ej. `veterinariacodorniz.com`):

### Frontend (Vercel)
1. Ve a Settings → Domains en tu proyecto de Vercel.
2. Escribe tu dominio y haz clic en Add.
3. Vercel te dará registros DNS. Ve al panel de tu registrador de dominio y añade esos registros.

### API (Render)
1. Ve a Settings en tu servicio de Render.
2. En la sección **Custom Domains**, añade tu subdominio (ej: `api.veterinariacodorniz.com`).
3. Sigue las instrucciones de DNS de Render.
4. Actualiza `FRONTEND_URL` en Render y `NEXT_PUBLIC_API_URL` en Vercel con los nuevos dominios.

---

## PASO 7 — Configurar GitHub Actions (opcional)

Para desplegar automáticamente el frontend a través de GitHub Actions en cada push a main:

### Secrets necesarios en GitHub
Ve a tu repo en GitHub → Settings → Secrets and variables → Actions → New repository secret:

| Secret | Valor |
|--------|-------|
| `VERCEL_TOKEN` | Token de Vercel (Vercel → Settings → Tokens) |
| `VERCEL_ORG_ID` | ID de tu organización en Vercel (Settings → General) |
| `VERCEL_PROJECT_ID` | ID del proyecto (Project Settings → General) |
| `NEXT_PUBLIC_API_URL` | `https://veterinaria-api-88vn.onrender.com/api` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `523131163103` |

---

## Resumen de URLs producción

| Servicio | URL |
|----------|-----|
| Frontend (Vercel) | `https://veterinaria-la-codorniz-web.vercel.app` |
| API (Render) | `https://veterinaria-api-88vn.onrender.com` |
| Base de datos | Neon — `ep-purple-union-aumemj4w` |
| Imágenes | Cloudflare R2 — `pub-ccf8a9a9104b48a5a457aab2e743cf0b.r2.dev` |

---

## Notas de mantenimiento

- **Neon** escala a cero cuando no hay actividad pero se reactiva automáticamente.
- **Render** en el plan gratuito suspende los Web Services tras 15 minutos de inactividad, lo que provoca un retardo en la primera petición (wake-up de unos 50 segundos).
- **Vercel** y **Cloudflare R2** son gratuitos en el volumen esperado de esta aplicación.
- Los tokens JWT expiran en 8 horas. El sistema los renueva automáticamente sin cerrar sesión.
