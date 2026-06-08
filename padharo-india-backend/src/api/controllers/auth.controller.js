/* === Filename: src/api/controllers/auth.controller.js === */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; // Corrected filename and path depth
import { generateOtp, sendOtpService } from '../../utils/otpHelper.js'; // Removed
// ... rest of the code
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Correctly locate .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') }); // Go up from controllers/ to api/ to src/ to backend/

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
// const OTP_EXPIRY_MINUTES = 5; // Removed

// --- Helper Functions ---
const generateToken = (userId) => {
    // Ensure JWT_SECRET is loaded
    if (!JWT_SECRET) {
        console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
        process.exit(1);
    }
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Removed calculateOtpExpiry function
const calculateOtpExpiry = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + OTP_EXPIRY_MINUTES);
    return now;
};
// --- NEW Validation Helpers ---
const validateEmailDomain = (email) => {
    // Allow common domains
    const allowedDomains = [
        'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'live.com'
    ];
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
};

const validatePassword = (password) => {
    // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
};
// --- End NEW Helpers ---


// --- Controller Methods ---

export const signup = async (req, res, next) => {
    const { firstName, lastName, email, mobile, password, userType, businessType } = req.body;

    // Basic Validation
    if (!firstName || !lastName || !email || !mobile || !password || !userType) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
     if (userType === 'Business' && !businessType) {
         return res.status(400).json({ message: 'Business type is required for Business accounts.' });
    }
     if (!['User', 'Business','Admin'].includes(userType)) {
        return res.status(400).json({ message: 'Invalid user type.' });
    }
    // Validate specific business types based on frontend SignUpForm
     if (userType === 'Business' && !['Hotel', 'Guide', 'Cab'].includes(businessType)) { //
        return res.status(400).json({ message: 'Invalid business type specified.' });
    }

    // --- NEW Email Validation ---
    if (!validateEmailDomain(email)) {
        return res.status(400).json({ message: 'Please use a valid email provider (e.g., Gmail, Outlook, Yahoo).' });
    }

    // --- NEW Password Validation ---
    if (!validatePassword(password)) {
        return res.status(400).json({ 
            message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.' 
        });
    }
    // --- END NEW Validation ---


    try {
        const existingUserByEmail = await User.findByEmail(email);
        if (existingUserByEmail) {
            return res.status(409).json({ message: 'Email already registered.' });
        }
        const existingUserByMobile = await User.findByMobile(mobile);
         if (existingUserByMobile) {
            return res.status(409).json({ message: 'Mobile number already registered.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userId = await User.createUser({
            firstName,
            lastName,
            email,
            mobile,
            hashedPassword,
            role: userType,
            businessType: userType === 'Business' ? businessType : null,
            // isVerified is set to TRUE by default in user.model.js
        });

        // --- OTP Logic Removed ---
        const otp = generateOtp();
        const expiry = calculateOtpExpiry();
        const otpStored = await User.storeOtp(mobile, otp, expiry);

        if (!otpStored) {
             console.error(`Failed to store OTP for mobile: ${mobile}`);
            return res.status(500).json({ message: 'Failed to initiate verification. Please try again.' });
        }

        const otpSent = await sendOtpService(mobile, otp);

        if (!otpSent) {
             console.error(`Failed to send OTP for mobile: ${mobile}`);
            return res.status(500).json({ message: 'Account created, but failed to send verification OTP. Please contact support or try resending.' });
        }
        // --- Sign up is now immediate login ---
        const token = generateToken(userId);
        const newUserDetails = await User.findById(userId);

        // !!!!! THIS IS THE FIX !!!!!
        // Add a safety check to ensure the user was found after creation
        if (!newUserDetails) {
            console.error(`FATAL: User with ID ${userId} was created but not found immediately after.`);
            // Pass a new Error to the global error handler
            return next(new Error('User account created but failed to retrieve details. Please contact support.'));
        }
        // !!!!! END FIX !!!!!

        res.status(201).json({
            message: `Signup successful! Welcome, ${newUserDetails.firstName}.`,
            token,
            user: newUserDetails,
        });

    } catch (error) {
        next(error); // Pass errors to the global error handler
    }
};

// --- Removed verifyOtp controller ---
export const verifyOtp = async (req, res, next) => {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
        return res.status(400).json({ message: 'Mobile number and OTP are required.' });
    }

    try {
        const user = await User.verifyOtp(mobile, otp);

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        const markedVerified = await User.markAsVerified(user.id);

        if (!markedVerified) {
             console.error(`Failed to mark user ${user.id} as verified after OTP success.`);
             return res.status(500).json({ message: 'Verification failed. Please try again.' });
        }

        const token = generateToken(user.id);
        const verifiedUserDetails = await User.findById(user.id);

        res.status(200).json({
            message: 'OTP verified successfully! Registration complete.',
            token,
            user: verifiedUserDetails,
        });

    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials (email not found).' });
        }

        // This check is still useful for old accounts or manual DB entries
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Account not verified. Please contact support.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials (password mismatch).' });
        }

        const token = generateToken(user.id);
         const userDetails = await User.findById(user.id);

        // Safety check (similar to signup)
        if (!userDetails) {
             console.error(`FATAL: User with ID ${user.id} logged in but could not be found.`);
             return next(new Error('Login successful but failed to retrieve user details.'));
        }

        res.status(200).json({
            message: 'Login successful!',
            token,
            user: userDetails,
        });

    } catch (error) {
        next(error); // Pass errors to the global error handler
    }
};
export const resendOtp = async (req, res, next) => {
    const { mobile } = req.body;
     if (!mobile) {
        return res.status(400).json({ message: 'Mobile number is required.' });
    }

    try {
        const user = await User.findByMobile(mobile);
        if (!user) {
            return res.status(404).json({ message: 'Mobile number not registered.' });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: 'Account is already verified.' });
        }

        const otp = generateOtp();
        const expiry = calculateOtpExpiry();
        const otpStored = await User.storeOtp(mobile, otp, expiry);

         if (!otpStored) {
             console.error(`Resend OTP: Failed to store OTP for mobile: ${mobile}`);
            return res.status(500).json({ message: 'Failed to generate new OTP. Please try again.' });
        }

        const otpSent = await sendOtpService(mobile, otp);

        if (!otpSent) {
             console.error(`Resend OTP: Failed to send OTP for mobile: ${mobile}`);
            return res.status(500).json({ message: 'Failed to resend verification OTP. Please contact support.' });
        }

         res.status(200).json({ message: `New OTP sent to ${mobile}.` });

    } catch (error) {
        next(error);
    }
}
// --- Removed resendOtp controller ---