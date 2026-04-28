import { Request, Response, NextFunction } from 'express';
import * as WalletService from '../services/wallet.service';
import { AppError } from '../utils/AppError';

export const createWallet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { owner_id, currency } = req.body;

    const newWallet = await WalletService.createWallet(owner_id, currency);

    res.status(201).json({
      status: 'success',
      message: 'Wallet berhasil dibuat',
      data: newWallet,
    });
  } catch (error) {
    next(error);
  }
};

export const topUpWallet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {

    const { id } = req.params
    const { amount, reference_id } = req.body

    const result = await WalletService.topUp(id, amount, reference_id);

    res.status(200).json({
      message: "Topup berhasil !",
      data: result
    })
  } catch (err: any) {
    if (err.code === 'P2002') {
      return next(new AppError(409, "Transaksi dengan reference ID ini sudah pernah dilakukan"));
    }
    next(err);
  }
}
