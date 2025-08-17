import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import AppError from '../utils/AppError.js';

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer storage engine for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lab_reports',
    // Transformation to apply on upload for images (e.g., optimize)
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    // Define allowed formats
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    // Generate a unique public_id for each file
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `report-${req.user.id}-${uniqueSuffix}`;
    },
  },
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Invalid file type. Only JPG, PNG, and PDF are allowed.', 400), false);
    }
};

export default { cloudinary, storage, fileFilter };
