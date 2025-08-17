import jwt from 'jsonwebtoken';
const { verify } = jwt;
import { Types } from 'mongoose';
import User from '../models/user.js';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';
import redisService from '../config/redis.js';
const { isTokenBlacklisted } = redisService;

/**
 * Main authentication middleware to protect routes.
 * Verifies the JWT, checks for blacklisted tokens, and validates the user session.
 */
export async function protect(req, res, next) {
    try {
        let accessToken;
        if (req.headers.authorization?.startsWith('Bearer')) {
            accessToken = req.headers.authorization.split(' ')[1];
        }

        if (!accessToken) {
            return next(new AppError('Authentication failed. Please log in.', 401));
        }

        const decoded = verify(accessToken, process.env.JWT_SECRET);

        if (await isTokenBlacklisted(decoded.jti)) {
            return next(new AppError('Authentication failed. Token has been invalidated.', 401));
        }

        const user = await User.findById(decoded.id).select('+passwordChangedAt');
        
        if (!user) {
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }

        if (user.accountStatus !== 'active') {
            return next(new AppError(`Access denied. Your account is ${user.accountStatus}.`, 403));
        }

        if (user.passwordChangedAt && (decoded.iat * 1000 < user.passwordChangedAt.getTime())) {
            return next(new AppError('Password was recently changed. Please log in again.', 401));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new AppError('Authentication failed. Token is invalid or expired.', 401));
    }
}

/**
 * Role-based access control middleware.
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'editor').
 */
export function authorizeRoles(...roles) { return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        logger.warn(`Authorization failed for ${req.user.email} (Role: ${req.user.role}) trying to access role-protected route: ${req.originalUrl}`);
        return next(new AppError('Access denied. You do not have permission to perform this action.', 403));
    }
    next();
};     }

/**
 * Authorization middleware to verify if the user is a member of a Trip.
 */
export async function isTripMember(req, res, next) {
    const tripId = req.params.id || req.params.tripId;
    if (!Types.ObjectId.isValid(tripId)) {
        return next(new AppError('Invalid trip ID.', 400));
    }
    
    const trip = await User.findOne({ _id: tripId, 'group.members.userId': req.user._id });

    if (!trip) {
        return next(new AppError('You are not authorized to access this trip.', 403));
    }
    req.trip = trip; 
    next();
}

/**
 * Authorization middleware to verify if the user is the owner of a Trip.
 */
export async function isTripOwner(req, res, next) {
    const tripId = req.params.id || req.params.tripId;
    if (!Types.ObjectId.isValid(tripId)) {
        return next(new AppError('Invalid trip ID.', 400));
    }

    const trip = await User.findById(tripId);
    if (!trip) {
        return next(new AppError('Trip not found.', 404));
    }

    const member = trip.group.members.find(m => m.userId.equals(req.user._id));
    if (!member || member.role !== 'owner') {
        return next(new AppError('Access denied. Only the trip owner can perform this action.', 403));
    }

    req.trip = trip;
    next();
}


/**
 * Authorization middleware to verify if the user is a member of a ChatSession.
 */
export async function isChatMember(req, res, next) {
    const sessionId = req.body.sessionId || req.params.sessionId;
    if (!sessionId) {
        return next(new AppError('A valid session ID is required.', 400));
    }
    const session = await User.findOne({ _id: sessionId, participants: req.user._id });

    if (!session) {
        return next(new AppError('You are not authorized to access this chat session.', 403));
    }
    next();
}