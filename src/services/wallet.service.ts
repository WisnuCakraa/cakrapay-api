import prisma from '../config/database';
import { AppError } from '../utils/AppError';

export const createWallet = async (owner_id: string, currency: string) => {
  const existingWallet = await prisma.wallet.findUnique({
    where: {
      owner_id_currency: { owner_id, currency },
    },
  });
  if (existingWallet) {
    throw new AppError(
      409,
      `User sudah memiliki wallet aktif untuk mata uang ${currency}`,
    );
  }
  const newWallet = await prisma.wallet.create({
    data: {
      owner_id,
      currency,
    },
  });
  return newWallet;
};
