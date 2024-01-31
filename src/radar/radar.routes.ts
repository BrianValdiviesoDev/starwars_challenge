import { Router } from 'express';
import { getNextPoint } from './radar.controller';

const router = Router();
router.post('/radar', getNextPoint);

export default router;