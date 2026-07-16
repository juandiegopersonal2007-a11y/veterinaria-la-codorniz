const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

function secret(n) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@%^&*-_';
  const bytes = crypto.randomBytes(n);
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
}

function updateEnv(filePath, map) {
  if (!fs.existsSync(filePath)) return;
  let text = fs.readFileSync(filePath, 'utf8');
  for (const [k, v] of Object.entries(map)) {
    const quoted = `${k}="${v.replace(/"/g, '')}"`;
    const re = new RegExp(`^${k}=.*$`, 'm');
    if (re.test(text)) {
      text = text.replace(re, quoted);
    } else {
      if (!text.endsWith('\n')) text += '\n';
      text += quoted + '\n';
    }
  }
  fs.writeFileSync(filePath, text);
  console.log('Updated', filePath);
}

(async () => {
  const email = 'admin@veterinariacodorniz.com';
  const password = 'Codorniz-' + secret(14);
  const jwt = secret(48);
  const jwtRefresh = secret(48);

  const map = {
    ADMIN_EMAIL: email,
    ADMIN_PASSWORD: password,
    JWT_SECRET: jwt,
    JWT_REFRESH_SECRET: jwtRefresh,
  };

  const apiDir = path.resolve(__dirname, '..');
  const mono = path.resolve(__dirname, '../../..');
  updateEnv(path.join(apiDir, '.env'), map);
  updateEnv(path.join(mono, '.env'), map);
  updateEnv(path.join(mono, '.env.local'), map);

  // Recargar env del api
  require('dotenv').config({ path: path.join(apiDir, '.env'), override: true });

  const prisma = new PrismaClient();
  const hash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { password: hash, role: 'ADMIN', name: 'Admin Codorniz' },
    create: { email, password: hash, name: 'Admin Codorniz', role: 'ADMIN' },
  });
  await prisma.$disconnect();

  console.log('--- ANOTA ESTAS CREDENCIALES ---');
  console.log('EMAIL=' + email);
  console.log('PASSWORD=' + password);
  console.log('JWT_SECRET=' + jwt);
  console.log('JWT_REFRESH_SECRET=' + jwtRefresh);
  console.log('--------------------------------');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
