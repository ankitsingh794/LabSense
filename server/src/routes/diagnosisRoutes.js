import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createDiagnosis, getUserDiagnoses, getDiagnosisById } from '../controllers/diagnosisController.js';

const router = Router();

// All diagnosis routes are protected
router.use(protect);

router.route('/')
    .post(createDiagnosis)
    .get(getUserDiagnoses);


router.route('/:id')
    .get(getDiagnosisById);


export default router;