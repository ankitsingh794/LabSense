import mongoose from 'mongoose';
const { Schema, model } = mongoose;

/**
 * Diagnosis Schema
 * Stores the results of an AI-powered diagnosis based on user-provided symptoms.
 */
const diagnosisSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    report: {
        type: Schema.Types.ObjectId,
        ref: 'Report',
    },
    symptoms: {
        type: String,
        required: [true, 'Symptoms must be provided for diagnosis.'],
        trim: true,
    },
    aiResponse: {
        type: Object,
        required: true,
    },
    possibleConditions: [{
        name: String,
        likelihood: Number, 
    }],
    recommendations: [String],
    severityLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical', 'Unknown'],
        default: 'Unknown',
    },
}, {
    timestamps: true,
});

const Diagnosis = model('Diagnosis', diagnosisSchema);
export default Diagnosis;
