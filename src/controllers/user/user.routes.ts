import { Router } from 'express';
import * as UserController from './user.controller';
import * as UserValidator from '../../validators/users.validator';

const router = Router();

router.route('/getAllUsers').post(UserValidator.getAllUsers, UserController.getAllUsers);
router.route('/addNewUser').post(UserValidator.signup, UserController.addNewUser);
router.route('/changeRole').put(UserValidator.changeUserRole, UserController.changeUserRole);
router.route('/userActivation').put(UserValidator.userActivation, UserController.userActivation);
router.route('/:id').delete(UserValidator.userDeletion, UserController.userDeletion);


export default router