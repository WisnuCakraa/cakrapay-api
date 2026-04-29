import { Router } from 'express';
import {
    createWallet,
    getTransactions,
    getWallet,
    paymentWallet,
    suspendWallet,
    topUpWallet,
    transferFunds,
    getWalletsByOwner,
    getAllWallets
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

router.get('/', getAllWallets);
router.get('/:id', getWallet);
router.get('/:id/transactions', getTransactions);
router.get('/user/:ownerId', getWalletsByOwner);

router.patch('/:id/status', suspendWallet);

export default router;
