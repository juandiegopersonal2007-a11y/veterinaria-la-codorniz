import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value;
}

function getR2Client() {
  return new S3Client({
    region: 'auto',
    endpoint: requireEnv('R2_ENDPOINT'),
    credentials: {
      accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
      secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
    },
  });
}

function parseDataUrl(fileStr: string): { buffer: Buffer; contentType: string; extension: string } {
  const match = fileStr.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new Error('La imagen debe enviarse como data URL base64 (data:image/...;base64,...)');
  }

  const contentType = match[1];
  const buffer = Buffer.from(match[2], 'base64');

  if (buffer.length === 0) {
    throw new Error('La imagen está vacía');
  }
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new Error(`La imagen supera el límite de ${MAX_IMAGE_BYTES / (1024 * 1024)} MB`);
  }

  const extensionMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };
  const extension = extensionMap[contentType] || 'jpg';

  return { buffer, contentType, extension };
}

/**
 * Sube una imagen (data URL base64) a Cloudflare R2 y devuelve la URL pública.
 * El bucket debe tener acceso público habilitado (R2_PUBLIC_URL).
 */
export async function uploadImage(
  fileStr: string,
  folder: 'products' | 'pets' = 'products'
): Promise<string> {
  const { buffer, contentType, extension } = parseDataUrl(fileStr);
  const bucket = requireEnv('R2_BUCKET_NAME');
  const publicUrl = requireEnv('R2_PUBLIC_URL').replace(/\/$/, '');
  const key = `${folder}/${randomUUID()}.${extension}`;

  const client = getR2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  return `${publicUrl}/${key}`;
}

/** Elimina un objeto de R2 a partir de su URL pública (si pertenece a este bucket). */
export async function deleteImageByUrl(imageUrl: string | null | undefined): Promise<void> {
  if (!imageUrl) return;

  const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, '');
  const bucket = process.env.R2_BUCKET_NAME;
  if (!publicUrl || !bucket || !imageUrl.startsWith(publicUrl + '/')) {
    return;
  }

  const key = imageUrl.slice(publicUrl.length + 1);
  if (!key) return;

  const client = getR2Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}
