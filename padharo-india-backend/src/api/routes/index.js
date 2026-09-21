import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import cabRoutes from './cab.routes.js';
import hotelRoutes from './hotel.routes.js';
import guideRoutes from './guide.routes.js';
import packageRoutes from './package.routes.js';
import bookingRoutes from './booking.routes.js';
import reviewRoutes from './review.routes.js';
import supportRoutes from './support.routes.js';
import adminRoutes from './admin.routes.js';
import businessCabRoutes from './business.cab.routes.js';
import businessGuideRoutes from './business.guide.routes.js';
import businessHotelRoutes from './business.hotel.routes.js';
import queryRoutes from './query.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/cabs', cabRoutes);
router.use('/hotels', hotelRoutes);
router.use('/guides', guideRoutes);
router.use('/packages', packageRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/support', supportRoutes);
router.use('/admin', adminRoutes);
router.use('/business/cabs', businessCabRoutes);
router.use('/business/guides', businessGuideRoutes);
router.use('/business/hotels', businessHotelRoutes);
router.use('/query', queryRoutes);

export default router;
