import { Router } from 'express';
import authRouter from './controllers/auth/auth.routes';
import companyRouter from './controllers/company/company.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/company', companyRouter);


export default router;