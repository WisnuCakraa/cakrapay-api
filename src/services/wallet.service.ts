import { Decimal } from 'decimal.js';
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

export const topUp = async (walletId: string, ammount: number, referenceId: string) => {
  return await prisma.$transaction(async (tx) => {
    // check wallet
    const wallet = await tx.wallet.findUnique({
      where: { id: walletId }
    })

    if (!wallet) throw new AppError(404, 'Wallet tidak ditemukan');
    if (wallet.status === 'SUSPENDED') throw new AppError(403, 'Wallet sedang ditangguhkan');

    const topUpAmmount = new Decimal(ammount).toDecimalPlaces(2);
    const newBalance = Decimal.add(wallet.balance, topUpAmmount);

    const updatedWallet = await tx.wallet.update({
      where: { id: walletId },
      data: { balance: newBalance },
    })

    await tx.ledger.create({
      data: {
        wallet_id: walletId,
        transaction_type: 'TOPUP',
        amount: topUpAmmount,
        currency: wallet.currency,
        reference_id: referenceId,
      },
    });
    return updatedWallet
  })
}