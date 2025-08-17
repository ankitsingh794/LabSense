import Report from '../models/report.js'; 
import AppError from '../utils/AppError.js';
import cloudinaryConfig from '../config/cloudinary.js';
import responseHelper from '../utils/responseHelper.js';
import { processReportWithOCR, parseOcrText } from '../services/reportParser.js';
import logger from '../utils/logger.js';

/**
 * @desc    Upload a new lab report
 * @route   POST /api/reports
 * @access  Private
 */
export async function uploadReport(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError('No file was uploaded. Please select a file.', 400));
        }

        const { reportName, reportType } = req.body;
        if (!reportName || !reportType) {
            await cloudinaryConfig.cloudinary.uploader.destroy(req.file.filename);
            return next(new AppError('Please provide a report name and type.', 400));
        }

        const newReport = await Report.create({
            user: req.user.id,
            reportName,
            reportType,
            fileUrl: req.file.path,
            filePublicId: req.file.filename,
            fileMimeType: req.file.mimetype,
            ocrStatus: 'processing', 
        });

        responseHelper.sendSuccess(res, 201, 'Report uploaded and is being processed.', newReport);

        (async () => {
            try {
                const rawText = await processReportWithOCR(newReport.fileUrl);

                const structuredData = parseOcrText(rawText);

                newReport.parsedData = structuredData;
                newReport.ocrStatus = 'completed';
                await newReport.save();
                logger.info(`Successfully processed and saved parsed data for report ID: ${newReport._id}`);

            } catch (error) {
                newReport.ocrStatus = 'failed';
                await newReport.save();
                logger.error(`Failed to process OCR for report ID: ${newReport._id}`, error);
            }
        })();

    } catch (error) {
        next(error);
    }
}

/**
 * @desc    Get all reports for the logged-in user
 * @route   GET /api/reports
 * @access  Private
 */
export async function getUserReports(req, res, next) {
    try {
        const reports = await Report.find({ user: req.user.id }).sort({ createdAt: -1 });
        responseHelper.sendSuccess(res, 200, 'Reports retrieved successfully.', reports);
    } catch (error) {
        next(error);
    }
}

/**
 * @desc    Get a single report by its ID
 * @route   GET /api/reports/:id
 * @access  Private
 */
export async function getReportById(req, res, next) {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return next(new AppError('Report not found.', 404));
        }

        // Authorization check: Ensure the report belongs to the user
        if (report.user.toString() !== req.user.id) {
            return next(new AppError('You are not authorized to view this report.', 403));
        }

        responseHelper.sendSuccess(res, 200, 'Report retrieved successfully.', report);
    } catch (error) {
        next(error);
    }
}

/**
 * @desc    Delete a report by its ID
 * @route   DELETE /api/reports/:id
 * @access  Private
 */
export async function deleteReport(req, res, next) {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return next(new AppError('Report not found.', 404));
        }

        if (report.user.toString() !== req.user.id) {
            return next(new AppError('You are not authorized to delete this report.', 403));
        }

        // Delete the file from Cloudinary first
        await cloudinary.uploader.destroy(report.filePublicId);

        // Then, delete the record from the database
        await report.deleteOne();

        responseHelper.sendSuccess(res, 200, 'Report deleted successfully.');
    } catch (error) {
        next(error);
    }
}
