import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import bcrypt from 'bcryptjs';
const { hash, compare } = bcrypt;
import { randomBytes, createHash } from 'crypto';

/**
 * User Schema
 * Defines the structure for user documents in MongoDB, including personal details,
 * authentication fields, and account status management.
 */
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name.'],
        trim: true,
    },
    age: {
        type: Number,
        required: [true, 'Please provide your age.'],
        min: [0, 'Age cannot be negative.'],
    },
    sex: {
        type: String,
        required: [true, 'Please specify your sex.'],
        enum: ['Male', 'Female', 'Other'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email.'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please provide a valid email address.'],
    },
    password: {
        type: String,
        minlength: [8, 'Password must be at least 8 characters long.'],
        select: false,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local',
    },
    passwordChangedAt: Date,
    role: {
        type: String,
        enum: ['user', 'doctor', 'admin'],
        default: 'user',
    },
    accountStatus: {
        type: String,
        enum: ['pending_verification', 'active', 'suspended', 'deactivated'],
        default: 'pending_verification',
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: String,
    emailVerificationTokenExpires: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    medicalHistory: {
        type: Object,
        default: {
            allergies: [],
            conditions: [],
            medications: [],
        },
    },
    lifestyleInfo: {
        type: Object,
        default: {
            diet: 'Not specified',
            exercise: 'Not specified',
            smoking: 'Not specified',
        },
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// --- Middleware (Hooks) ---

// Hash password before saving the user document
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await hash(this.password, 12);
    next();
});

// Update passwordChangedAt field when password is modified
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000; // Subtract 1s to ensure token is created after password change
    next();
});

// --- Schema Methods ---

/**
 * Compares an entered password with the hashed password in the database.
 * @param {string} candidatePassword - The password to check.
 * @returns {Promise<boolean>} - True if passwords match, false otherwise.
 */
userSchema.methods.matchPassword = async function (candidatePassword) {
    return await compare(candidatePassword, this.password);
};

/**
 * Generates a token for email verification.
 * @returns {string} - The unhashed verification token.
 */
userSchema.methods.createEmailVerifyToken = function () {
    const verificationToken = randomBytes(32).toString('hex');
    this.emailVerificationToken = createHash('sha256').update(verificationToken).digest('hex');
    this.emailVerificationTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return verificationToken;
};

/**
 * Generates a token for resetting the user's password.
 * @returns {string} - The unhashed password reset token.
 */
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = randomBytes(32).toString('hex');
    this.passwordResetToken = createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};

const User = model('User', userSchema);
export default User;
