import { Request, Response, NextFunction } from 'express';
import * as LedgerService from '../services/ledger.service';

export const getAllLedgers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await LedgerService.getAllLedgers();
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};
