import { Router } from 'express';
import * as ParkingSpaceController from './parkingSpace.controller';
import { upload } from '../../middleware/filesUpload';

const router = Router();

router.route('/addNewParkingSpace').post(upload.array('files'), ParkingSpaceController.addNewParkingSpace);


export default router