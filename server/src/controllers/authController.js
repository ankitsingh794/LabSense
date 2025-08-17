import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';
const { decode } = jwt;
import User from '../models/user.js';
import AppError from '../utils/AppError.js';
import sendEmail from '../utils/sendEmail.js';
import logger from '../utils/logger.js';
import tokenUtils from '../utils/tokenUtils.js';
import redisService from '../config/redis.js';
const { blacklistToken } = redisService;
import { generateVerificationEmailHTML, generatePasswordResetEmailHTML } from '../utils/emailTemplates.js';
import responseHelper from '../utils/responseHelper.js';

/**
 * A helper function to generate tokens and send the final response.
 * This avoids code repetition in login, verify, reset, etc.
 */
const issueTokensAndRespond = (res, user, statusCode, message) => {
    const { accessToken } = issueTokens(user);
    const refreshToken = tokenUtils.generateRefreshToken(user._id);

    // 2. Prepare user data for the response payload (excluding sensitive info)
    const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    // 3. Call the response helper with the correct arguments
    responseHelper.sendTokenResponse(res, statusCode, message, { accessToken, refreshToken }, userData);
};


/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export async function registerUser(req, res, next) {
    try {
        // 1. Get ALL required fields from the body
        const { name, email, password, age, sex } = req.body;

        let user = await User.findOne({ email });

        if (user) {
            // This logic for existing users is fine
            const verificationToken = user.createEmailVerifyToken();
            await user.save({ validateBeforeSave: false });
            const verifyURL = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
            await sendEmail({ to: user.email, subject: `Action Required: Verify Your Email`, html: generateVerificationEmailHTML(user.name, verifyURL) });

            return responseHelper.sendSuccess(res, 200, 'Registration successful. Please check your email to verify your account.');
        }

        // 2. Pass ALL fields when creating the new user
        user = new User({ name, email, password, age, sex });

        const verificationToken = user.createEmailVerifyToken();
        await user.save();
        const verifyURL = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
        await sendEmail({ to: user.email, subject: `Welcome! Please Verify Your Email`, html: generateVerificationEmailHTML(user.name, verifyURL) });

        logger.info('User partially registered. Verification email sent.', { email });
        responseHelper.sendSuccess(res, 201, 'Registration successful. Please check your email to verify your account.');
    } catch (error) {
        next(error);
    }
}


/**
 * @desc    Verify email using a token
 * @route   POST /api/auth/verify-email
 * @access  Public
 */
export async function verifyEmail(req, res, next) {
    try {
        const hashedToken = createHash('sha256').update(req.body.token).digest('hex');
        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return next(new AppError('Invalid or expired verification token.', 400));
        }

        user.isEmailVerified = true;
        user.accountStatus = 'active';
        user.emailVerificationToken = undefined;
        user.emailVerificationTokenExpires = undefined;
        await user.save({ validateBeforeSave: false }); // Save the changes
        
        issueTokensAndRespond(res, user, 200, 'Email verified successfully. You are now logged in.');

    } catch (error) {
        next(error);
    }
}

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export async function loginUser(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return next(new AppError('Invalid email or password.', 401));
        }
        if (!user.isEmailVerified) {
            return next(new AppError('Please verify your email before logging in.', 403));
        }
        if (user.accountStatus !== 'active') {
            return next(new AppError(`Your account is currently ${user.accountStatus}. Access denied.`, 403));
        }

        // --- FIX ---
        // Use the helper to issue tokens and respond correctly
        issueTokensAndRespond(res, user, 200, 'Login successful');

    } catch (error) {
        next(error);
    }
}

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
export async function refreshToken(req, res, next) {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return next(new AppError('Authentication failed. No refresh token found.', 401));
        }

        const decoded = tokenUtils.verifyToken(refreshToken, 'refresh');
        if (!decoded) {
            return next(new AppError('Authentication failed. Invalid or expired refresh token.', 401));
        }
        
        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new AppError('Authentication failed. User not found.', 401));
        }

        // --- FIX ---
        // Use the helper to issue tokens and respond correctly
        issueTokensAndRespond(res, user, 200, 'Access token refreshed');

    } catch (error) {
        next(error);
    }
}

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export async function logoutUser(req, res, next) {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (accessToken) {
            const decoded = decode(accessToken);
            if (decoded?.jti) {
                const expires = decoded.exp - Math.floor(Date.now() / 1000);
                if (expires > 0) await blacklistToken(decoded.jti, expires);
            }
        }

        res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/' });
        
        responseHelper.sendSuccess(res, 200, 'Logged out successfully');
    } catch (error) {
        next(error);
    }
}

/**
 * @desc    Update password for an authenticated user
 * @route   PATCH /api/auth/update-password
 * @access  Private
 */
export async function updatePassword(req, res, next) {
    try {
        const user = await User.findById(req.user.id).select('+password');
        const { currentPassword, newPassword } = req.body;

        if (!(await user.matchPassword(currentPassword))) {
            return next(new AppError('Your current password is incorrect.', 401));
        }

        user.password = newPassword;
        await user.save();
        
        // --- FIX ---
        // Use the helper to issue tokens and respond correctly
        issueTokensAndRespond(res, user, 200, 'Password updated successfully. You have been logged in with a new secure session.');

    } catch (error) {
        next(error);
    }
}

// --- Password Reset Flow ---

export async function forgotPassword(req, res, next) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const resetToken = user.createPasswordResetToken();
            await user.save({ validateBeforeSave: false });
            const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
            await sendEmail({ to: user.email, subject: 'Your Password Reset Request', html: generatePasswordResetEmailHTML(user.name, resetURL) });
        }
        responseHelper.sendSuccess(res, 200, 'If an account with that email exists, a password reset link has been sent.');
    } catch (error) {
        next(error);
    }
}

export async function resetPassword(req, res, next) {
    try {
        const hashedToken = createHash('sha256').update(req.body.token).digest('hex');
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return next(new AppError('Invalid or expired password reset token.', 400));
        }

        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save(); // Save the new password
        issueTokensAndRespond(res, user, 200, 'Password reset successfully. You are now logged in.');
        
    } catch (error) {
        next(error);
    }
}
export const issueTokens = (user) => {
    const accessToken = tokenUtils.generateAccessToken(user._id);
    // You might also handle refresh tokens here if needed
    return { accessToken };
};

const _issueTokensAndRespond = issueTokensAndRespond;
export { _issueTokensAndRespond as issueTokensAndRespond };