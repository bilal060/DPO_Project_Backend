import { Router } from 'express';
import * as UserController from './user.controller';
import * as UserValidator from '../../validators/users.validator';

const router = Router();

router.route('/getAllUsers').post(UserValidator.getAllUsers, UserController.getAllUsers);



export default router