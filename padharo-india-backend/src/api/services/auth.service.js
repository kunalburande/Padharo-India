import User from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/hashPassword.js';
import { createToken } from '../utils/jwtHelper.js';

export const registerUser = async ({ firstName, lastName, email, mobile, password, role, businessType }) => {
  if (!firstName || !lastName || !email || !mobile || !password || !role) {
    throw new Error('Missing required registration fields');
  }

  const existingByEmail = await User.findByEmail(email);
  if (existingByEmail) {
    throw new Error('Email already registered.');
  }

  const existingByMobile = await User.findByMobile(mobile);
  if (existingByMobile) {
    throw new Error('Mobile number already registered.');
  }

  const hashedPassword = await hashPassword(password);
  const userId = await User.createUser({
    firstName,
    lastName,
    email,
    mobile,
    hashedPassword,
    role,
    businessType: role === 'Business' ? businessType : null
  });

  const token = createToken({ id: userId });
  const user = await User.findById(userId);
  return { user, token };
};

export const authenticateUser = async (email, password) => {
  const user = await User.findByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials.');
  }
  const match = await comparePassword(password, user.password);
  if (!match) {
    throw new Error('Invalid credentials.');
  }
  if (!user.isVerified) {
    throw new Error('Account not verified.');
  }
  const token = createToken({ id: user.id });
  const profile = await User.findById(user.id);
  return { user: profile, token };
};
