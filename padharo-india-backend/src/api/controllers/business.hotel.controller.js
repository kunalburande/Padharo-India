import Hotel from '../models/hotel.model.js';

export const getMyHotelProfile = async (req, res, next) => {
  try {
    const ownerUserId = req.user.id;
    const hotel = await Hotel.findByOwnerUserId(ownerUserId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel profile not found.' });
    }
    res.status(200).json(hotel);
  } catch (error) {
    console.error('Error in getMyHotelProfile:', error);
    next(error);
  }
};

export const createBusinessHotel = async (req, res, next) => {
  try {
    const ownerUserId = req.user.id;
    const hotelData = { ...req.body, owner_user_id: ownerUserId };
    const hotelId = await Hotel.create(hotelData);
    res.status(201).json({ message: 'Hotel created successfully', hotelId });
  } catch (error) {
    console.error('Error in createBusinessHotel:', error);
    next(error);
  }
};

export const updateBusinessHotel = async (req, res, next) => {
  try {
    const hotelId = parseInt(req.params.id, 10);
    if (isNaN(hotelId)) {
      return res.status(400).json({ message: 'Invalid Hotel ID.' });
    }
    const ownerUserId = req.user.id;
    const updateData = { ...req.body };
    delete updateData.owner_user_id;
    try {
      const success = await Hotel.update(hotelId, updateData, ownerUserId);
      if (!success) {
        const ownerId = await Hotel.findOwnerId(hotelId);
        if (ownerId === null) {
          return res.status(404).json({ message: 'Hotel not found.' });
        }
        return res.status(403).json({ message: 'Forbidden: You do not own this hotel.' });
      }
      const updatedHotel = await Hotel.findById(hotelId);
      res.status(200).json({ message: 'Hotel updated successfully', hotel: updatedHotel });
    } catch (error) {
      if (error.message?.includes('Forbidden')) {
        return res.status(403).json({ message: error.message });
      }
      console.error('Error in updateBusinessHotel:', error);
      next(error);
    }
  } catch (error) {
    console.error('Error in updateBusinessHotel:', error);
    next(error);
  }
};

export const deleteBusinessHotel = async (req, res, next) => {
  try {
    const hotelId = parseInt(req.params.id, 10);
    if (isNaN(hotelId)) {
      return res.status(400).json({ message: 'Invalid Hotel ID.' });
    }
    const ownerUserId = req.user.id;
    try {
      const success = await Hotel.deleteById(hotelId, ownerUserId);
      if (!success) {
        const ownerId = await Hotel.findOwnerId(hotelId);
        if (ownerId === null) {
          return res.status(404).json({ message: 'Hotel not found.' });
        }
        return res.status(403).json({ message: 'Forbidden: You do not own this hotel.' });
      }
      res.status(200).json({ message: 'Hotel deleted successfully.' });
    } catch (error) {
      if (error.message?.includes('Forbidden')) {
        return res.status(403).json({ message: error.message });
      }
      console.error('Error in deleteBusinessHotel:', error);
      next(error);
    }
  } catch (error) {
    console.error('Error in deleteBusinessHotel:', error);
    next(error);
  }
};
