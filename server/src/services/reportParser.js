// In src/services/reportParser.js
import Tesseract from 'tesseract.js';
import logger from '../utils/logger.js';
import { biomarkers } from './biomarkerDictionary.js';

/**
 * Processes a lab report image URL using OCR to extract text.
 * @param {string} fileUrl - The public URL of the report file.
 * @returns {Promise<string>} - The raw text extracted from the report.
 */
export const processReportWithOCR = async (fileUrl) => {
    try {
        const imageUrl = fileUrl.replace('/upload/', '/upload/f_png,pg_1,w_2000/');

        logger.info(`Starting OCR process for transformed image: ${imageUrl}`);

        const { data: { text } } = await Tesseract.recognize(
            imageUrl, 
            'eng',
            { logger: m => logger.debug(`Tesseract progress: ${m.status} (${(m.progress * 100).toFixed(2)}%)`) }
        );

        logger.info('OCR process completed successfully.');
        return text;

    } catch (error) {
        logger.error('Error during Tesseract OCR processing:', { message: error.message });
        throw new Error('Failed to process report with OCR.');
    }
};


/**
 * Parses raw OCR text to extract structured biomarker data.
 * @param {string} rawText - The raw text from the OCR process.
 * @returns {object} - An object with extracted biomarker data.
 */
export const parseOcrText = (rawText) => {
    const results = {};
    logger.info('Starting biomarker parsing...');

    for (const biomarker of biomarkers) {
        const matches = [...rawText.matchAll(new RegExp(biomarker.regex.source, 'gi'))];

        for (const match of matches) {
            if (match && match[1] && match[2]) {
                const numericString = match[1].replace(/[<>≥\s]/g, '');
                const value = parseFloat(numericString);
                const unit = match[2].trim();
                
                if (!isNaN(value)) {
                    if (!results[biomarker.name]) {
                        results[biomarker.name] = {
                            value: value,
                            unit: unit,
                            category: biomarker.category,
                        };
                        logger.info(`Found biomarker: ${biomarker.name} - Value: ${value}, Unit: ${unit}`);
                    }
                }
            }
        }
    }
    
    logger.info('Biomarker parsing completed.');
    return {
        ...results,
        rawText, 
    };
};