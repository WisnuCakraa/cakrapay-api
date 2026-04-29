import prisma from '../config/database';

export const getAllLedgers = async () => {
  return await prisma.ledger.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      wallet: {
        select: { owner_id: true },
      },
    },
  });
};
