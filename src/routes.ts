import { Router } from 'express';
import authRouter from './controllers/auth/auth.routes';
import companyRouter from './controllers/company/company.routes';
import userRouter from './controllers/user/user.routes';
import parkingSpaceRouter from './controllers/parkingSpace/parkingSpace.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/company', companyRouter);
router.use('/user', userRouter);
router.use('/parkingSpace', parkingSpaceRouter);


export default router;