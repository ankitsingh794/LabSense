import OpenAI from 'openai';
import logger from '../utils/logger.js';
import { retrieveRelevantContext } from './vectorStore.js';

// --- 1. CONFIGURE THE OPENAI CLIENT TO POINT TO OPENROUTER ---
const openrouter = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
});

export const getAiDiagnosis = async ({ symptoms, user, labData }) => {
    const formatLabData = (data) => {
        if (!data || Object.keys(data).length === 0) return 'No lab data provided.';
        const { rawText, ...metrics } = data;
        let formattedString = 'Lab Results:\n';
        for (const [key, valueObj] of Object.entries(metrics)) {
            formattedString += `- ${key}: ${valueObj.value} ${valueObj.unit || ''}\n`;
        }
        return formattedString;
    };

    const userQuery = `Symptoms: ${symptoms}. Lab Data: ${formatLabData(labData)}`;
    const context = await retrieveRelevantContext(userQuery);

    const prompt = `
        You are an expert medical analysis AI. You MUST base your answer ONLY on the provided "Trusted Medical Context". If the context is insufficient, state that you cannot provide an answer.

        --- START OF TRUSTED MEDICAL CONTEXT ---
        ${context}
        --- END OF TRUSTED MEDICAL CONTEXT ---

        Analyze the following user information in light of the trusted context:
        1. User Profile: Age ${user.age}, Sex ${user.sex}
        2. User Symptoms: "${symptoms}"
        3. Lab Data: ${formatLabData(labData)}

        Your response MUST be a valid JSON object with the specified structure and nothing else:
        {
          "possible_conditions": [
            {"name": "Condition Name", "likelihood": 0.8, "reasoning": "Explain why, citing facts ONLY from the Trusted Medical Context and referencing user data."}
          ],
          "recommendations": [ "Provide a clear, actionable next step.", "Provide a relevant wellness recommendation." ],
          "severity_level": "Medium"
        }
    `;

    try {
        logger.info('Sending enhanced diagnosis request to OpenRouter...');
        const response = await openrouter.chat.completions.create({
            model: 'tngtech/deepseek-r1t2-chimera:free',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            response_format: { type: "json_object" }, 
            timeout: 30000, // 30 seconds timeout
        });

        const content = response.choices[0].message.content;
        logger.info('OpenRouter response received.');
        
        return JSON.parse(content);

    } catch (error) {
        logger.error('Error with OpenRouter AI Service:', { message: error.message });
        return {
            possible_conditions: [],
            recommendations: ['An error occurred while communicating with the AI service. Please try again later.'],
            severity_level: 'Unknown',
        };
    }
};