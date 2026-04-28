import { Router } from 'express';
import { createWallet } from '../controllers/wallet.controller';
import { validate } from '../middlewares/wallet.validate';
import { createWalletSchema } from '../validations/wallet.validation';

const router = Router();

router.post('/', validate(createWalletSchema), createWallet);

export default router;
