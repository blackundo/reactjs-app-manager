import { API_BASE_URL, headersBuilder, API_ENDPOINTS } from '@/config/api';

export interface StartAutoRequest {
    api_config_id: number;
    product_id: string | null;
}

export interface StartAutoResponse {
    job_id: string;
    message: string;
    status: string;
}

export interface JobsResponse {
    jobs: Job[];
}

export interface Job {
    id: string;
    name?: string;
    next_run?: string;
    interval?: number;
    status?: string;
}

export const startAutoJob = async (payload: StartAutoRequest): Promise<StartAutoResponse> => {
    const { headers } = headersBuilder();
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTO_START}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};

export const stopAutoJob = async (jobId: string): Promise<void> => {
    const { headers } = headersBuilder();
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTO_STOP.replace('{jobId}', jobId)}`, {
        method: 'DELETE',
        headers
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
};

export const refreshJobs = async (): Promise<JobsResponse> => {
    const { headers } = headersBuilder();
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTO}`, {
        method: 'GET',
        headers
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};
