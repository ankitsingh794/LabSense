import { Router } from 'express';
import passport from '../config/passport.js';
import {
    registerUser,
    verifyEmail,
    loginUser,
    refreshToken,
    logoutUser,
    updatePassword,
    forgotPassword,
    resetPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// --- Public Routes ---
router.post('/register', registerUser);
router.post('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// --- Protected Routes (require a valid access token) ---
router.post('/logout', protect, logoutUser);
router.patch('/update-password', protect, updatePassword);

// --- Google OAuth2 Routes ---
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
}));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
        session: false
    }),
    (req, res) => {
        const { accessToken } = issueTokens(req.user);
        
        const userJson = JSON.stringify({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
        });

        res.redirect(`${process.env.CLIENT_URL}/auth/callback?accessToken=${accessToken}&user=${encodeURIComponent(userJson)}`);
    }
);

export default router;
