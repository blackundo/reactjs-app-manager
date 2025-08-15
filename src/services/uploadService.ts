import { headersBuilder, API_ENDPOINTS } from '@/config/api';

export interface UploadResponse {
    message?: string;
    detail?: string;
    import_result?: any;
}

// Upload txt file
export const uploadTxtFile = async (formData: FormData): Promise<UploadResponse> => {
    try {
        const { apiBase, headers } = headersBuilder();
        const response = await fetch(`${apiBase}${API_ENDPOINTS.UPLOAD_TXT}`, {
            method: 'POST',
            headers: {
                // Don't set Content-Type for FormData, let browser set it
                ...headers,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error uploading txt file:', error);
        throw error;
    }
};

// Upload xml file
export const uploadXmlFile = async (formData: FormData): Promise<UploadResponse> => {
    try {
        const { apiBase, headers } = headersBuilder();
        const response = await fetch(`${apiBase}${API_ENDPOINTS.UPLOAD_XML}`, {
            method: 'POST',
            headers: {
                // Don't set Content-Type for FormData, let browser set it
                ...headers,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error uploading xml file:', error);
        throw error;
    }
};
