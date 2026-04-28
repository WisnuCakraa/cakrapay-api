import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from './index';

if (!config.db.url) {
  throw new Error('DATABASE_URL belum di-set di file .env');
}

const adapter = new PrismaPg({ connectionString: config.db.url });

const prisma = new PrismaClient({ adapter });

export default prisma;
