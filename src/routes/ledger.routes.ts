import { Router } from 'express';
import { getAllLedgers } from '../controllers/ledger.controller';

const router = Router();

router.get('/', getAllLedgers);

export default router;
