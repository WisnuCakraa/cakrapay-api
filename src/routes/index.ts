import { Router } from 'express';
import walletRoutes from './wallet.routes';

const router = Router();

router.use('/wallets', walletRoutes);

export default router;