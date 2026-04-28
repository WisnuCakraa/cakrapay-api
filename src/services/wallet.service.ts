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

export const topUp = async (walletId: string, amount: number, referenceId: string) => {
  return await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({
      where: { id: walletId }
    })

    if (!wallet) throw new AppError(404, 'Wallet tidak ditemukan');
    if (wallet.status === 'SUSPENDED') throw new AppError(403, 'Wallet sedang ditangguhkan');

    const topUpAmount = new Decimal(amount).toDecimalPlaces(2);
    const newBalance = Decimal.add(wallet.balance, topUpAmount);

    const updatedWallet = await tx.wallet.update({
      where: { id: walletId },
      data: { balance: newBalance },
    })

    await tx.ledger.create({
      data: {
        wallet_id: walletId,
        transaction_type: 'TOPUP',
        amount: topUpAmount,
        currency: wallet.currency,
        reference_id: referenceId,
      },
    });
    return updatedWallet
  })
}

export const payment = async (walletId: string, amount: number, referenceId: string) => {
  return await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({
      where: { id: walletId }
    });

    if (!wallet) throw new AppError(404, 'Wallet tidak ditemukan');
    if (wallet.status === 'SUSPENDED') throw new AppError(403, 'Wallet sedang ditangguhkan');

    const payAmount = new Decimal(amount).toDecimalPlaces(2);

    if (wallet.balance.lt(payAmount)) throw new AppError(400, 'Saldo tidak cukup');

    const updatedWallet = await tx.wallet.update({
      where: { id: walletId },
      data: {
        balance: Decimal.sub(wallet.balance, payAmount),
      },
    });

    await tx.ledger.create({
      data: {
        wallet_id: walletId,
        transaction_type: "PAYMENT",
        amount: payAmount.negated(),
        currency: wallet.currency,
        reference_id: referenceId,
      }
    });

    return updatedWallet
  })
}

export const transfer = async (senderId: string, receiverId: string, amount: number, referenceId: string) => {
  return prisma.$transaction(async (tx) => {
    const sender = await tx.wallet.findUnique({
      where: { id: senderId }
    });
    const receiver = await tx.wallet.findUnique({
      where: { id: receiverId }
    });

    if (!sender || !receiver) throw new AppError(404, 'Salah satu wallet tidak ditemukan');

    if (sender.currency !== receiver.currency) throw new AppError(400, 'Transfer antar mata uang berbeda belum didukung');
    if (sender.status === "SUSPENDED") throw new AppError(403, 'Wallet Pengirim sedang ditangguhkan');

    const transferAmount = new Decimal(amount).toDecimalPlaces(2);

    if (sender.balance.lt(transferAmount)) throw new AppError(400, 'Saldo pengirim tidak mencukupi');

    await tx.wallet.update({
      where: { id: senderId },
      data: { balance: Decimal.sub(sender.balance, transferAmount) },
    });
    await tx.wallet.update({
      where: { id: receiverId },
      data: { balance: Decimal.add(receiver.balance, transferAmount) },
    });

    await tx.ledger.createMany({
      data: [
        {
          wallet_id: senderId,
          transaction_type: "TRANSFER_OUT",
          amount: transferAmount.negated(),
          currency: sender.currency,
          reference_id: `${referenceId}-OUT`
        },
        {
          wallet_id: receiverId,
          transaction_type: "TRANSFER_IN",
          amount: transferAmount,
          currency: receiver.currency,
          reference_id: `${referenceId}-IN`
        }
      ],
    });

    return { sender_id: senderId, receiver_id: receiverId, amount: transferAmount };
  });
}

export const getWalletById = async (id: string) => {
  const wallet = await prisma.wallet.findUnique({
    where: { id },
    include: {
      _count: {
        select: { ledgers: true }
      }
    }
  });

  if (!wallet) throw new AppError(404, 'Wallet tidak ditemukan');
  return wallet;
};

export const getTransactionHistory = async (walletId: string) => {
  const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
  if (!wallet) throw new AppError(404, 'Wallet tidak ditemukan');

  return await prisma.ledger.findMany({
    where: { wallet_id: walletId },
    orderBy: { created_at: 'desc' },
  });
};