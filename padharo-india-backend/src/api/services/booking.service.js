import Booking from '../models/booking.model.js';

export const createBooking = async (bookingData) => Booking.create(bookingData);
export const getUserBookings = async (userId) => Booking.findByUserId(userId);
export const getBookingById = async (bookingId) => Booking.findById(bookingId);
export const cancelBooking = async (bookingId, userId) => Booking.updateStatus(bookingId, 'Cancelled', userId);
