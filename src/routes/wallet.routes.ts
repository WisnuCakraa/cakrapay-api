import { Router } from 'express';
import {
    createWallet,
    getTransactions,
    getWallet,
    paymentWallet,
    topUpWallet,
    transferFunds
} from '../controllers/wallet.controller';
import { validate } from '../middlewares/wallet.validate';
import {
    createWalletSchema,
    paymentSchema,
    topUpSchema,
    transferSchema
} from '../validations/wallet.validation';

const router = Router();

router.post('/', validate(createWalletSchema), createWallet);
router.post('/:id/topup', validate(topUpSchema), topUpWallet);
router.post('/:id/payment', validate(paymentSchema), paymentWallet);
router.post('/transfer', validate(transferSchema), transferFunds);

router.get('/:id', getWallet);
router.get('/:id/transactions', getTransactions);

export default router;
