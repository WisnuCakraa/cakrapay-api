import { Router } from 'express';
import { createWallet, topUpWallet } from '../controllers/wallet.controller';
import { validate } from '../middlewares/wallet.validate';
import { createWalletSchema, topUpSchema } from '../validations/wallet.validation';

const router = Router();

router.post('/', validate(createWalletSchema), createWallet);
router.post('/:id/topup', validate(topUpSchema), topUpWallet);

export default router;
