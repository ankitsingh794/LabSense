import { Router } from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import {
    uploadReport,
    getUserReports,
    getReportById,
    deleteReport
} from '../controllers/reportController.js';
import cloudinaryConfig from '../config/cloudinary.js';

const router = Router();
const upload = multer({ storage: cloudinaryConfig.storage, fileFilter: cloudinaryConfig.fileFilter });

// All report routes are protected
router.use(protect);

router.route('/')
    .post(upload.single('reportFile'), uploadReport)
    .get(getUserReports);

router.route('/:id')
    .get(getReportById)
    .delete(deleteReport);

export default router;