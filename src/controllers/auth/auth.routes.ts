import { Router } from 'express';
import * as AuthController from './auth.controller';
import * as UserValidator from '../../validators/users.validator';
const router = Router();

router.route('/login').post(UserValidator.login, AuthController.login);
router.route('/signup').post(UserValidator.signup, AuthController.signup);
router.route('/forgetPassword').post(UserValidator.forgetPassword, AuthController.forgetPassword);
router.route('/resetPassword').post(UserValidator.resetPassword, AuthController.resetPassword);

export default router