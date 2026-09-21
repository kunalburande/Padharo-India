import Hotel from '../models/hotel.model.js';

export const getAllHotels = async (filters) => Hotel.findAll(filters);
export const getHotelDetails = async (id) => Hotel.findById(id);
export const getHotelByOwner = async (ownerUserId) => Hotel.findByOwnerUserId(ownerUserId);
export const createHotel = async (hotelData) => Hotel.create(hotelData);
export const updateHotel = async (hotelId, updateData, ownerUserId) => Hotel.update(hotelId, updateData, ownerUserId);
export const deleteHotel = async (hotelId, ownerUserId) => Hotel.deleteById(hotelId, ownerUserId);
