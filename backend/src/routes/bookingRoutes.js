import express from 'express';
import { createBooking, getBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .post(createBooking)
    .get(getBookings);

router.put('/:id/status', updateBookingStatus);

export default router;
