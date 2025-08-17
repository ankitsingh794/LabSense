// In src/services/apiService.ts

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const getAuthToken = () => localStorage.getItem("accessToken");

export const uploadReport = async (file: File, reportName: string, reportType: string) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('reportFile', file);
    formData.append('reportName', reportName);
    formData.append('reportType', reportType);

    const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload report.');
    }

    return await response.json();
};

// 2. Function to get a diagnosis
export const getDiagnosis = async (symptoms: string, reportId: string | null) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/diagnose`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms, reportId }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get diagnosis.');
    }
    
    return await response.json();
};

export const getDiagnosesHistory = async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/diagnose`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch history.');
    }
    
    return await response.json();
}

export const getDiagnosisById = async (id: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/diagnose/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch diagnosis.');
    }
    return await response.json();
};