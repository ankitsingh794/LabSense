import Diagnosis from '../models/diagnosis.js';
import Report from '../models/report.js'; // --- 1. IMPORT THE REPORT MODEL ---
import AppError from '../utils/AppError.js';
import responseHelper from '../utils/responseHelper.js';
import { getAiDiagnosis } from '../services/aiService.js';

/**
 * @desc    Create a new AI-powered diagnosis
 * @route   POST /api/diagnose
 * @access  Private
 */
export async function createDiagnosis(req, res, next) {
    try {
        const { symptoms, reportId } = req.body; // reportId is now an expected field
        if (!symptoms) {
            return next(new AppError('Symptoms are required to get a diagnosis.', 400));
        }

        let labData = null;
        if (reportId) {
            const report = await Report.findOne({ _id: reportId, user: req.user.id });
            if (!report) {
                return next(new AppError('The specified lab report was not found.', 404));
            }
            if (report.ocrStatus !== 'completed' || !report.parsedData) {
                return next(new AppError('The specified lab report is still being processed or failed processing.', 409));
            }
            labData = report.parsedData;
        }

        const aiResponse = await getAiDiagnosis({
            symptoms,
            user: req.user,
            labData, // Pass the parsed lab data to the AI service
        });

        const newDiagnosis = await Diagnosis.create({
            user: req.user.id,
            report: reportId, 
            symptoms,
            aiResponse,
            possibleConditions: aiResponse.possible_conditions,
            recommendations: aiResponse.recommendations,
            severityLevel: aiResponse.severity_level,
        });

        responseHelper.sendSuccess(res, 201, 'Diagnosis received successfully.', newDiagnosis);
    } catch (error) {
        next(error);
    }
}


/**
 * @desc    Get all diagnoses for the logged-in user
 * @route   GET /api/diagnose
 * @access  Private
 */
export async function getUserDiagnoses(req, res, next) {
    try {
        const diagnoses = await Diagnosis.find({ user: req.user.id })
            .populate('report', 'reportName reportType') // Optionally populate linked report info
            .sort({ createdAt: -1 });
            
        responseHelper.sendSuccess(res, 200, 'Diagnoses retrieved successfully.', diagnoses);
    } catch (error) {
        next(error);
    }
}


/**
 * @desc    Get a single diagnosis by its ID
 * @route   GET /api/diagnose/:id
 * @access  Private
 */
export async function getDiagnosisById(req, res, next) {
    try {
        const diagnosis = await Diagnosis.findById(req.params.id);

        if (!diagnosis || diagnosis.user.toString() !== req.user.id) {
            return next(new AppError('Diagnosis not found.', 404));
        }

        responseHelper.sendSuccess(res, 200, 'Diagnosis retrieved successfully.', diagnosis);
    } catch (error) {
        next(error);
    }
}