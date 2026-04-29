import { Router } from 'express';
import walletRoutes from './wallet.routes';
import ledgerRoutes from './ledger.routes';

const router = Router();

router.use('/wallets', walletRoutes);
router.use('/ledgers', ledgerRoutes);

export default router;
