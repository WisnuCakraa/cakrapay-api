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

export const paymentWallet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params
    const { amount, reference_id } = req.body

    const result = await WalletService.payment(id, amount, reference_id);

    res.status(200).json({
      message: "Payment berhasil!",
      data: result
    })

  } catch (err: any) {
    if (err.code === 'P2002') {
      return next(new AppError(409, 'Reference ID sudah pernah digunakan'));
    }
    next(err);

  }
}

export const transferFunds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sender_id, receiver_id, amount, reference_id } = req.body;
    const result = await WalletService.transfer(sender_id, receiver_id, amount, reference_id);

    res.status(200).json({ message: 'Transfer berhasil', data: result });
  } catch (error: any) {
    if (error.code === 'P2002') return next(new AppError(409, 'Reference ID duplikat'));
    next(error);
  }
};

export const getWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await WalletService.getWalletById(id);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await WalletService.getTransactionHistory(id);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const suspendWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await WalletService.updateWalletStatus(id, status);

    res.status(200).json({
      message: `Wallet berhasil di-${status.toLowerCase()}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};