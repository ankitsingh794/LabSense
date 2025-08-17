import mongoose from 'mongoose';
const { Schema, model } = mongoose;

/**
 * Report Schema
 * Stores metadata for user-uploaded lab reports.
 */
const reportSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    reportName: {
        type: String,
        required: [true, 'Please provide a name for the report.'],
        trim: true,
    },
    reportType: {
        type: String,
        required: [true, 'Please specify the type of report (e.g., Blood Test, X-Ray).'],
        trim: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    // The public_id from Cloudinary, used for file management (e.g., deletion)
    filePublicId: {
        type: String,
        required: true,
    },
    fileMimeType: {
        type: String,
        required: true,
    },
    ocrStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
    },
    parsedData: {
        type: Object,
        default: null,
    },
}, {
    timestamps: true,
});

const Report = model('Report', reportSchema);
export default Report;
