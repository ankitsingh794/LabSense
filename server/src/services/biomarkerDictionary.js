/**
 * An "enterprise-level" dictionary for parsing biomarkers from OCR text.
 * Each entry includes:
 * - name: The standardized name of the biomarker.
 * - aliases: An array of common names and abbreviations found on lab reports.
 * - category: The lab panel this biomarker belongs to.
 * - standardUnit: The common unit of measurement for clinical reference.
 * - regex: An advanced regular expression to capture the value (group 1) and unit (group 2).
 * - The value capture group is enhanced to handle prefixes like <, >, or ≥.
 */
export const biomarkers = [
    // --- Comprehensive Metabolic Panel (CMP) & Electrolytes ---
    {
        name: 'Glucose',
        aliases: ['Glucose', 'GLU'],
        category: 'Metabolic Panel',
        standardUnit: 'mg/dL',
        regex: /(?:Glucose|GLU)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },
    {
        name: 'Sodium',
        aliases: ['Sodium', 'Na'],
        category: 'Metabolic Panel',
        standardUnit: 'mmol/L',
        regex: /(?:Sodium|Na)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },
    {
        name: 'Potassium',
        aliases: ['Potassium', 'K'],
        category: 'Metabolic Panel',
        standardUnit: 'mmol/L',
        regex: /(?:Potassium|K)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },
    {
        name: 'Chloride',
        aliases: ['Chloride', 'Cl'],
        category: 'Metabolic Panel',
        standardUnit: 'mmol/L',
        regex: /(?:Chloride|Cl)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },
    {
        name: 'Blood Urea Nitrogen',
        aliases: ['BUN', 'Blood Urea Nitrogen'],
        category: 'Metabolic Panel',
        standardUnit: 'mg/dL',
        regex: /(?:BUN|Blood Urea Nitrogen)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },
    {
        name: 'Creatinine',
        aliases: ['Creatinine'],
        category: 'Metabolic Panel',
        standardUnit: 'mg/dL',
        regex: /(?:Creatinine)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },
    {
        name: 'eGFR',
        aliases: ['eGFR', 'Estimated GFR'],
        category: 'Metabolic Panel',
        standardUnit: 'mL/min/1.73m²',
        regex: /(?:eGFR|Estimated GFR)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z0-9\/²min]+)/i
    },

    // --- Liver Function Panel ---
    {
        name: 'Alkaline Phosphatase',
        aliases: ['Alkaline Phosphatase', 'ALP'],
        category: 'Liver Panel',
        standardUnit: 'U/L',
        regex: /(?:Alkaline Phosphatase|ALP)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },
    {
        name: 'Alanine Aminotransferase',
        aliases: ['Alanine Aminotransferase', 'ALT', 'SGPT'],
        category: 'Liver Panel',
        standardUnit: 'U/L',
        regex: /(?:Alanine Aminotransferase|ALT|SGPT)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },
    {
        name: 'Aspartate Aminotransferase',
        aliases: ['Aspartate Aminotransferase', 'AST', 'SGOT'],
        category: 'Liver Panel',
        standardUnit: 'U/L',
        regex: /(?:Aspartate Aminotransferase|AST|SGOT)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },
    {
        name: 'Bilirubin, Total',
        aliases: ['Bilirubin, Total', 'Bilirubin'],
        category: 'Liver Panel',
        standardUnit: 'mg/dL',
        regex: /(?:Bilirubin, Total|Bilirubin)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },

    // --- Lipid Panel ---
    {
        name: 'Cholesterol, Total',
        aliases: ['Cholesterol', 'Total Cholesterol', 'CHOL'],
        category: 'Lipid Panel',
        standardUnit: 'mg/dL',
        regex: /(?:Total Cholesterol|Cholesterol|CHOL)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },
    {
        name: 'Triglycerides',
        aliases: ['Triglycerides', 'TRIG'],
        category: 'Lipid Panel',
        standardUnit: 'mg/dL',
        regex: /(?:Triglycerides|TRIG)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },
    {
        name: 'HDL Cholesterol',
        aliases: ['HDL Cholesterol', 'HDL'],
        category: 'Lipid Panel',
        standardUnit: 'mg/dL',
        regex: /(?:HDL Cholesterol|HDL)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },
    {
        name: 'LDL Cholesterol',
        aliases: ['LDL Cholesterol', 'LDL'],
        category: 'Lipid Panel',
        standardUnit: 'mg/dL',
        regex: /(?:LDL Cholesterol|LDL)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },
    
    // --- Complete Blood Count (CBC) ---
    {
        name: 'White Blood Cell Count',
        aliases: ['White Blood Cell', 'WBC'],
        category: 'Complete Blood Count',
        standardUnit: 'x10^3/uL',
        regex: /(?:White Blood Cell|WBC)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z0-9^/µL]+)/i
    },
    {
        name: 'Red Blood Cell Count',
        aliases: ['Red Blood Cell', 'RBC'],
        category: 'Complete Blood Count',
        standardUnit: 'x10^6/uL',
        regex: /(?:Red Blood Cell|RBC)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z0-9^/µL]+)/i
    },
    {
        name: 'Hemoglobin',
        aliases: ['Hemoglobin', 'Hgb'],
        category: 'Complete Blood Count',
        standardUnit: 'g/dL',
        regex: /(?:Hemoglobin|Hgb)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },
    {
        name: 'Hematocrit',
        aliases: ['Hematocrit', 'Hct'],
        category: 'Complete Blood Count',
        standardUnit: '%',
        regex: /(?:Hematocrit|Hct)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([%])/i
    },
    {
        name: 'Platelet Count',
        aliases: ['Platelet Count', 'Platelets'],
        category: 'Complete Blood Count',
        standardUnit: 'x10^3/uL',
        regex: /(?:Platelet Count|Platelets)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z0-9^/µL]+)/i
    },
    
    // --- Thyroid Panel ---
    {
        name: 'Thyroid-Stimulating Hormone',
        aliases: ['TSH', 'Thyroid-Stimulating Hormone'],
        category: 'Thyroid Panel',
        standardUnit: 'µIU/mL',
        regex: /(?:TSH|Thyroid-Stimulating Hormone)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([µa-zA-Z\/]+)/i
    },
    {
        name: 'Free T4',
        aliases: ['Free T4', 'FT4'],
        category: 'Thyroid Panel',
        standardUnit: 'ng/dL',
        regex: /(?:Free T4|FT4)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },

    // --- Other Common Tests ---
    {
        name: 'Hemoglobin A1c',
        aliases: ['Hemoglobin A1c', 'HbA1c', 'A1c'],
        category: 'Endocrinology',
        standardUnit: '%',
        regex: /(?:Hemoglobin A1c|HbA1c|A1c)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([%])/i
    },
    {
        name: 'Vitamin D, 25-Hydroxy',
        aliases: ['Vitamin D', '25-Hydroxy'],
        category: 'Vitamins',
        standardUnit: 'ng/mL',
        regex: /(?:Vitamin D|25-Hydroxy)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },
];