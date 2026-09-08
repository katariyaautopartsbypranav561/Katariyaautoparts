const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { PrismaClient } = require('@prisma/client');

let prisma;

try {
  if (process.env.TURSO_DATABASE_URL && process.env.USE_TURSO === 'true') {
    const { createClient } = require('@libsql/client');
    const { PrismaLibSQL } = require('@prisma/adapter-libsql');
    const libsql = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const adapter = new PrismaLibSQL(libsql);
    prisma = new PrismaClient({ adapter });
  } else {
    if (process.env.VERCEL) {
      const fs = require('fs');
      const dbPath = path.join(__dirname, 'prisma', 'dev.db');
      const dest = '/tmp/dev.db';
      try {
        if (!fs.existsSync(dest)) {
          fs.copyFileSync(dbPath, dest);
        }
        prisma = new PrismaClient({ datasources: { db: { url: 'file:/tmp/dev.db' } } });
      } catch (err) {
        console.error("Vercel SQLite fallback failed:", err);
        prisma = new PrismaClient();
      }
    } else {
      prisma = new PrismaClient();
    }
  }
} catch (error) {
  console.warn("Falling back to standard PrismaClient initialization:", error.message);
  prisma = new PrismaClient();
}

module.exports = prisma;
