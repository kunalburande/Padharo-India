import Guide from '../models/guide.model.js';

export const getGuideByUserId = async (userId) => {
  const guideId = await Guide.findIdByUserId(userId);
  if (!guideId) return null;
  return Guide.findById(guideId);
};

export const createBusinessGuide = async (guideData) => Guide.create(guideData);
export const updateBusinessGuide = async (guideId, updateData, guideUserId) => Guide.update(guideId, updateData, guideUserId);
export const deleteBusinessGuide = async (guideId, guideUserId) => Guide.deleteById(guideId, guideUserId);
