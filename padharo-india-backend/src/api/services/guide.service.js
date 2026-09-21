import Guide from '../models/guide.model.js';

export const getAllGuides = async (filters) => Guide.findAll(filters);
export const getGuideDetails = async (id) => Guide.findById(id);
export const createGuide = async (guideData) => Guide.create(guideData);
export const updateGuide = async (guideId, updateData, guideUserId) => Guide.update(guideId, updateData, guideUserId);
export const deleteGuide = async (guideId, guideUserId) => Guide.deleteById(guideId, guideUserId);
