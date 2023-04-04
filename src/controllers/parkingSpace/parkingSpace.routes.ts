import { Router } from 'express';
import * as ParkingSpaceController from './parkingSpace.controller';
import * as ParkingSpaceValidator from '../../validators/parkingSpaces.validator';
import { upload } from '../../middleware/filesUpload';

const router = Router();

router.route('/addNewParkingSpace').post(upload.array('files'), ParkingSpaceController.addNewParkingSpace);
router.route('/getAllParkingSpaces').post(ParkingSpaceValidator.getAllParkingSpaces, ParkingSpaceController.getAllParkingSpaces);
router.route('/:id').get(ParkingSpaceValidator.getParkingSpaceDetails, ParkingSpaceController.getParkingSpaceDetails);
router.route('/:id').put(upload.array('files'), ParkingSpaceController.updateParkingDetails);
router.route('/assignUserToParkingSpace').patch(ParkingSpaceValidator.assignUserToParkingSpace, ParkingSpaceController.assignUserToParkingSpace);


export default router