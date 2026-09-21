import OtpModel from '../models/otp.model.js';
import { sendSms } from '../utils/smsService.js';

export const generateOtpCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtpForMobile = async (mobile, otp) => {
  const message = `Your Padharo India verification code is ${otp}. It expires in 5 minutes.`;
  return sendSms(mobile, message);
};

export const createOtpEntry = async (mobile, otp, expiresAt) => OtpModel.storeOtp(mobile, otp, expiresAt);
export const verifyOtpEntry = async (mobile, otp) => OtpModel.verifyOtp(mobile, otp);
export const removeOtpEntry = async (mobile) => OtpModel.deleteOtp(mobile);
