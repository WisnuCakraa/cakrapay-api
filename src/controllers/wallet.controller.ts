import { Request, Response, NextFunction } from 'express';
import * as WalletService from '../services/wallet.service';

export const createWallet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { owner_id, currency } = req.body;

        const newWallet = await WalletService.createWallet(owner_id, currency);

        res.status(201).json({
            status: 'success',
            message: 'Wallet berhasil dibuat',
            data: newWallet
        })
    } catch (error) {
        next(error);
    }
}