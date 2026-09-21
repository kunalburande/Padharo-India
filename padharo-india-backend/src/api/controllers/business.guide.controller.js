import Guide from '../models/guide.model.js';

export const getMyGuideProfile = async (req, res, next) => {
  try {
    const guideUserId = req.user.id;
    const guideId = await Guide.findIdByUserId(guideUserId);
    if (!guideId) {
      return res.status(404).json({ message: 'Guide profile not found.' });
    }
    const guide = await Guide.findById(guideId);
    res.status(200).json(guide);
  } catch (error) {
    console.error('Error in getMyGuideProfile:', error);
    next(error);
  }
};

export const createBusinessGuide = async (req, res, next) => {
  try {
    const guideUserId = req.user.id;
    const guideData = { ...req.body, guide_user_id: guideUserId };
    const guideId = await Guide.create(guideData);
    res.status(201).json({ message: 'Guide profile created successfully', guideId });
  } catch (error) {
    console.error('Error in createBusinessGuide:', error);
    next(error);
  }
};

export const updateBusinessGuide = async (req, res, next) => {
  try {
    const guideId = parseInt(req.params.id, 10);
    if (isNaN(guideId)) {
      return res.status(400).json({ message: 'Invalid Guide ID.' });
    }
    const guideUserId = req.user.id;
    const updateData = { ...req.body };
    delete updateData.guide_user_id;
    delete updateData.is_verified;

    try {
      const success = await Guide.update(guideId, updateData, guideUserId);
      if (!success) {
        const ownerId = await Guide.findOwnerId(guideId);
        if (ownerId === null) {
          return res.status(404).json({ message: 'Guide profile not found.' });
        }
        return res.status(403).json({ message: 'Forbidden: You do not own this guide profile.' });
      }
      const updatedGuide = await Guide.findById(guideId);
      res.status(200).json({ message: 'Guide profile updated successfully', guide: updatedGuide });
    } catch (error) {
      if (error.message?.includes('Forbidden')) {
        return res.status(403).json({ message: error.message });
      }
      console.error('Error in updateBusinessGuide:', error);
      next(error);
    }
  } catch (error) {
    console.error('Error in updateBusinessGuide:', error);
    next(error);
  }
};

export const deleteBusinessGuide = async (req, res, next) => {
  try {
    const guideId = parseInt(req.params.id, 10);
    if (isNaN(guideId)) {
      return res.status(400).json({ message: 'Invalid Guide ID.' });
    }
    const guideUserId = req.user.id;
    try {
      const success = await Guide.deleteById(guideId, guideUserId);
      if (!success) {
        const ownerId = await Guide.findOwnerId(guideId);
        if (ownerId === null) {
          return res.status(404).json({ message: 'Guide profile not found.' });
        }
        return res.status(403).json({ message: 'Forbidden: You do not own this guide profile.' });
      }
      res.status(200).json({ message: 'Guide profile deleted successfully.' });
    } catch (error) {
      if (error.message?.includes('Forbidden')) {
        return res.status(403).json({ message: error.message });
      }
      console.error('Error in deleteBusinessGuide:', error);
      next(error);
    }
  } catch (error) {
    console.error('Error in deleteBusinessGuide:', error);
    next(error);
  }
};
