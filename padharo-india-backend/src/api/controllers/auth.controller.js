import { registerUser, authenticateUser } from '../services/auth.service.js';

const allowedEmailDomains = new Set([
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'icloud.com',
  'live.com'
]);

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validateEmailDomain = (email) => {
  const domain = email?.split('@')[1];
  return domain && allowedEmailDomains.has(domain.toLowerCase());
};

const validatePassword = (password) => passwordRegex.test(password);

export const signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, mobile, password, userType, businessType } = req.body;

    if (!firstName || !lastName || !email || !mobile || !password || !userType) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }
    if (userType === 'Business' && !businessType) {
      return res.status(400).json({ message: 'Business type is required for Business accounts.' });
    }
    if (!['User', 'Business', 'Admin'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type.' });
    }
    if (userType === 'Business' && !['Hotel', 'Guide', 'Cab'].includes(businessType)) {
      return res.status(400).json({ message: 'Business type must be Hotel, Guide, or Cab.' });
    }
    if (!validateEmailDomain(email)) {
      return res.status(400).json({ message: 'Please use a common email provider like Gmail, Outlook, or Yahoo.' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      });
    }

    const { user, token } = await registerUser({
      firstName,
      lastName,
      email,
      mobile,
      password,
      role: userType,
      businessType
    });

    res.status(201).json({ message: 'Signup successful.', token, user });
  } catch (error) {
    if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const { user, token } = await authenticateUser(email, password);
    res.status(200).json({ message: 'Login successful.', token, user });
  } catch (error) {
    if (error.message === 'Invalid credentials.') {
      return res.status(401).json({ message: error.message });
    }
    if (error.message === 'Account not verified.') {
      return res.status(403).json({ message: error.message });
    }
    next(error);
  }
};
