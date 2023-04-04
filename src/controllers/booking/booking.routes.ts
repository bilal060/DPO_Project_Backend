import { Router } from 'express';
import * as BookingController from './booking.controller';
import * as BookingValidator from '../../validators/bookings.validators';
const router = Router();

router.route('/addBooking').post(BookingValidator.addBooking, BookingController.addBooking );
router.route('/getAllBookings').post(BookingValidator.getAllBookings, BookingController.getAllBookings );
router.route('/parkingSpaceBookings').post(BookingValidator.parkingSpaceBookings, BookingController.parkingSpaceBookings );


export default router