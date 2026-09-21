import Hotel from '../models/hotel.model.js';

export const getHotelByOwnerId = async (ownerUserId) => Hotel.findByOwnerUserId(ownerUserId);
export const createBusinessHotel = async (hotelData) => Hotel.create(hotelData);
export const updateBusinessHotel = async (hotelId, updateData, ownerUserId) => Hotel.update(hotelId, updateData, ownerUserId);
export const deleteBusinessHotel = async (hotelId, ownerUserId) => Hotel.deleteById(hotelId, ownerUserId);
