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
    // --- Renal / Kidney Function Panel ---
    {
        name: 'Uric Acid',
        aliases: ['Uric Acid'],
        category: 'Renal Panel',
        standardUnit: 'mg/dL',
        regex: /(?:Uric Acid)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },
    {
        name: 'Calcium',
        aliases: ['Calcium', 'Ca'],
        category: 'Renal Panel',
        standardUnit: 'mg/dL',
        regex: /(?:Calcium|Ca)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },
    {
        name: 'Phosphorus',
        aliases: ['Phosphorus', 'Phosphate', 'PO4'],
        category: 'Renal Panel',
        standardUnit: 'mg/dL',
        regex: /(?:Phosphorus|Phosphate|PO4)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },

    // --- Iron Studies ---
    {
        name: 'Ferritin',
        aliases: ['Ferritin'],
        category: 'Iron Studies',
        standardUnit: 'ng/mL',
        regex: /(?:Ferritin)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },
    {
        name: 'Iron',
        aliases: ['Iron', 'Serum Iron'],
        category: 'Iron Studies',
        standardUnit: 'µg/dL',
        regex: /(?:Iron|Serum Iron)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([µa-zA-Z\/]+)/i
    },
    {
        name: 'Total Iron-Binding Capacity',
        aliases: ['TIBC', 'Total Iron-Binding Capacity'],
        category: 'Iron Studies',
        standardUnit: 'µg/dL',
        regex: /(?:TIBC|Total Iron-Binding Capacity)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([µa-zA-Z\/]+)/i
    },

    // --- Inflammatory Markers ---
    {
        name: 'C-Reactive Protein',
        aliases: ['CRP', 'C-Reactive Protein'],
        category: 'Inflammation',
        standardUnit: 'mg/L',
        regex: /(?:CRP|C-Reactive Protein)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([a-zA-Z\/]+)/i
    },
    {
        name: 'Erythrocyte Sedimentation Rate',
        aliases: ['ESR', 'Erythrocyte Sedimentation Rate'],
        category: 'Inflammation',
        standardUnit: 'mm/hr',
        regex: /(?:ESR|Erythrocyte Sedimentation Rate)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*(mm\/hr)/i
    },

    // --- Cardiac Markers ---
    {
        name: 'Troponin I',
        aliases: ['Troponin I'],
        category: 'Cardiac Markers',
        standardUnit: 'ng/mL',
        regex: /(?:Troponin I)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*([ng\/mL]+)/i
    },
    {
        name: 'BNP',
        aliases: ['BNP', 'B-Type Natriuretic Peptide'],
        category: 'Cardiac Markers',
        standardUnit: 'pg/mL',
        regex: /(?:BNP|B-Type Natriuretic Peptide)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*(pg\/mL)/i
    },

    // --- Coagulation ---
    {
        name: 'Prothrombin Time',
        aliases: ['PT', 'Prothrombin Time'],
        category: 'Coagulation',
        standardUnit: 'sec',
        regex: /(?:PT|Prothrombin Time)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*[HL]?\s*(sec)/i
    },
    {
        name: 'INR',
        aliases: ['INR', 'International Normalized Ratio'],
        category: 'Coagulation',
        standardUnit: '',
        regex: /(?:INR|International Normalized Ratio)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)/i
    },
    {
        name: 'aPTT',
        aliases: ['aPTT', 'APTT', 'Activated Partial Thromboplastin Time'],
        category: 'Coagulation',
        standardUnit: 'sec',
        regex: /(?:aPTT|APTT|Activated Partial Thromboplastin Time)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(sec)/i
    },

    // --- Pancreatic Enzymes ---
    {
        name: 'Amylase',
        aliases: ['Amylase'],
        category: 'Pancreatic Enzymes',
        standardUnit: 'U/L',
        regex: /(?:Amylase)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(U\/L)/i
    },
    {
        name: 'Lipase',
        aliases: ['Lipase'],
        category: 'Pancreatic Enzymes',
        standardUnit: 'U/L',
        regex: /(?:Lipase)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(U\/L)/i
    },

    // --- Reproductive Hormones ---
    {
        name: 'Testosterone',
        aliases: ['Testosterone'],
        category: 'Hormones',
        standardUnit: 'ng/dL',
        regex: /(?:Testosterone)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(ng\/dL)/i
    },
    {
        name: 'Estradiol',
        aliases: ['Estradiol', 'E2'],
        category: 'Hormones',
        standardUnit: 'pg/mL',
        regex: /(?:Estradiol|E2)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(pg\/mL)/i
    },
    {
        name: 'Progesterone',
        aliases: ['Progesterone'],
        category: 'Hormones',
        standardUnit: 'ng/mL',
        regex: /(?:Progesterone)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(ng\/mL)/i
    },
    {
        name: 'FSH',
        aliases: ['FSH', 'Follicle Stimulating Hormone'],
        category: 'Hormones',
        standardUnit: 'mIU/mL',
        regex: /(?:FSH|Follicle Stimulating Hormone)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(mIU\/mL)/i
    },
    {
        name: 'LH',
        aliases: ['LH', 'Luteinizing Hormone'],
        category: 'Hormones',
        standardUnit: 'mIU/mL',
        regex: /(?:LH|Luteinizing Hormone)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(mIU\/mL)/i
    },
    {
        name: 'Prolactin',
        aliases: ['Prolactin'],
        category: 'Hormones',
        standardUnit: 'ng/mL',
        regex: /(?:Prolactin)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(ng\/mL)/i
    },

    // --- Cortisol / Stress Hormone ---
    {
        name: 'Cortisol',
        aliases: ['Cortisol'],
        category: 'Hormones',
        standardUnit: 'µg/dL',
        regex: /(?:Cortisol)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(µg\/dL)/i
    },

    // --- Vitamins / Minerals ---
    {
        name: 'Vitamin B12',
        aliases: ['Vitamin B12'],
        category: 'Vitamins',
        standardUnit: 'pg/mL',
        regex: /(?:Vitamin B12)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(pg\/mL)/i
    },
    {
        name: 'Magnesium',
        aliases: ['Magnesium', 'Mg'],
        category: 'Minerals',
        standardUnit: 'mg/dL',
        regex: /(?:Magnesium|Mg)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(mg\/dL)/i
    },
    {
        name: 'Zinc',
        aliases: ['Zinc'],
        category: 'Minerals',
        standardUnit: 'µg/dL',
        regex: /(?:Zinc)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(µg\/dL)/i
    },

    // --- Tumor Markers ---
    {
        name: 'PSA',
        aliases: ['PSA', 'Prostate Specific Antigen'],
        category: 'Tumor Markers',
        standardUnit: 'ng/mL',
        regex: /(?:PSA|Prostate Specific Antigen)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(ng\/mL)/i
    },
    {
        name: 'CA-125',
        aliases: ['CA-125'],
        category: 'Tumor Markers',
        standardUnit: 'U/mL',
        regex: /(?:CA-125)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(U\/mL)/i
    },
    {
        name: 'CEA',
        aliases: ['CEA', 'Carcinoembryonic Antigen'],
        category: 'Tumor Markers',
        standardUnit: 'ng/mL',
        regex: /(?:CEA|Carcinoembryonic Antigen)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(ng\/mL)/i
    },
    // --- Infectious Disease Serology ---
    {
        name: 'HIV Antibody',
        aliases: ['HIV Ab', 'HIV Antibody'],
        category: 'Infectious Disease',
        standardUnit: '',
        regex: /(?:HIV Ab|HIV Antibody)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)/i
    },
    {
        name: 'Hepatitis B Surface Antigen',
        aliases: ['HBsAg', 'Hepatitis B Surface Antigen'],
        category: 'Infectious Disease',
        standardUnit: '',
        regex: /(?:HBsAg|Hepatitis B Surface Antigen)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)/i
    },
    {
        name: 'Hepatitis C Antibody',
        aliases: ['Anti-HCV', 'HCV Ab'],
        category: 'Infectious Disease',
        standardUnit: '',
        regex: /(?:Anti-HCV|HCV Ab)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)/i
    },
    {
        name: 'Tuberculosis Quantiferon',
        aliases: ['Quantiferon', 'TB Quantiferon'],
        category: 'Infectious Disease',
        standardUnit: 'IU/mL',
        regex: /(?:Quantiferon|TB Quantiferon)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(IU\/mL)/i
    },

    // --- Autoimmune / Rheumatology ---
    {
        name: 'ANA',
        aliases: ['ANA', 'Antinuclear Antibody'],
        category: 'Autoimmune',
        standardUnit: 'titer',
        regex: /(?:ANA|Antinuclear Antibody)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(titer)?/i
    },
    {
        name: 'Rheumatoid Factor',
        aliases: ['RF', 'Rheumatoid Factor'],
        category: 'Autoimmune',
        standardUnit: 'IU/mL',
        regex: /(?:RF|Rheumatoid Factor)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(IU\/mL)/i
    },
    {
        name: 'Anti-CCP',
        aliases: ['Anti-CCP', 'Cyclic Citrullinated Peptide Antibody'],
        category: 'Autoimmune',
        standardUnit: 'U/mL',
        regex: /(?:Anti-CCP|Cyclic Citrullinated Peptide Antibody)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(U\/mL)/i
    },

    // --- Bone & Metabolism ---
    {
        name: 'Parathyroid Hormone',
        aliases: ['PTH', 'Parathyroid Hormone'],
        category: 'Bone/Metabolism',
        standardUnit: 'pg/mL',
        regex: /(?:PTH|Parathyroid Hormone)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(pg\/mL)/i
    },
    {
        name: 'Alkaline Phosphatase, Bone Specific',
        aliases: ['Bone ALP', 'Bone Alkaline Phosphatase'],
        category: 'Bone/Metabolism',
        standardUnit: 'U/L',
        regex: /(?:Bone ALP|Bone Alkaline Phosphatase)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(U\/L)/i
    },
    {
        name: 'Osteocalcin',
        aliases: ['Osteocalcin'],
        category: 'Bone/Metabolism',
        standardUnit: 'ng/mL',
        regex: /(?:Osteocalcin)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(ng\/mL)/i
    },

    // --- Neurology / Muscle ---
    {
        name: 'Creatine Kinase',
        aliases: ['CK', 'Creatine Kinase', 'CPK'],
        category: 'Neurology/Muscle',
        standardUnit: 'U/L',
        regex: /(?:CK|Creatine Kinase|CPK)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(U\/L)/i
    },
    {
        name: 'LDH',
        aliases: ['LDH', 'Lactate Dehydrogenase'],
        category: 'Neurology/Muscle',
        standardUnit: 'U/L',
        regex: /(?:LDH|Lactate Dehydrogenase)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(U\/L)/i
    },

    // --- Rare Tumor / Special Markers ---
    {
        name: 'CA 19-9',
        aliases: ['CA 19-9'],
        category: 'Tumor Markers',
        standardUnit: 'U/mL',
        regex: /(?:CA ?19-9)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(U\/mL)/i
    },
    {
        name: 'Alpha-fetoprotein',
        aliases: ['AFP', 'Alpha-fetoprotein'],
        category: 'Tumor Markers',
        standardUnit: 'ng/mL',
        regex: /(?:AFP|Alpha-fetoprotein)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(ng\/mL)/i
    },
    {
        name: 'Beta-hCG',
        aliases: ['hCG', 'Beta-hCG'],
        category: 'Tumor Markers / Pregnancy',
        standardUnit: 'mIU/mL',
        regex: /(?:hCG|Beta-hCG)[\s,:.•●]*([<>≥]?\s*\d+(?:\.\d+)?)\s*(mIU\/mL)/i
    }
];