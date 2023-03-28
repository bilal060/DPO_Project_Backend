import { Router } from 'express';
import authRouter from './controllers/auth/auth.routes';

const router = Router();

router.use('/auth', authRouter);



export default router;