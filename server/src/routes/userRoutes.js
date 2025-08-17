import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';

const router = Router();

// All routes in this file are protected
router.use(protect);

router.route('/me')
    .get(getUserProfile)
    .patch(updateUserProfile);

// Ensure this line is exporting as the default
export default router;