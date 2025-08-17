// In src/controllers/userController.js

import User from '../models/user.js';
import AppError from '../utils/AppError.js';
import responseHelper from '../utils/responseHelper.js';

/**
 * @desc    Get current user's profile
 * @route   GET /api/users/me
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new AppError('User not found.', 404));
    }

    responseHelper.sendSuccess(res, 200, 'Profile retrieved successfully.', user);
};

/**
 * @desc    Update current user's profile
 * @route   PATCH /api/users/me
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
    const { name, age, sex, medicalHistory, lifestyleInfo } = req.body;
    
    const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, age, sex, medicalHistory, lifestyleInfo },
        { new: true, runValidators: true } 
    );

    if (!user) {
        return next(new AppError('User not found.', 404));
    }

    responseHelper.sendSuccess(res, 200, 'Profile updated successfully.', user);
};