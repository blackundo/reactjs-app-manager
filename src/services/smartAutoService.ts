import { headersBuilder, API_ENDPOINTS } from '@/config/api';

export interface Product {
    id: string;
    name: string;
    price: number;
    amount: number;
    category_id: string;
    category_name: string;
}

export interface Category {
    id: string;
    name: string;
    has_products: boolean;
    product_count: number;
}

export interface ProductsResponse {
    products: Product[];
    categories: Category[];
}

export interface SmartAutoConfig {
    enabled_api_ids: number[];
    check_interval_minutes: number;
    interval_seconds?: number;
    is_miniapp: boolean;
}

export interface SmartAutoResponse {
    status: 'completed' | 'scheduled' | 'skipped' | 'error';
    message: string;
    job_id?: string;
    results?: Array<{
        api_name: string;
        status: string;
        message: string;
    }>;
}

export interface Job {
    id: string;
    next_run?: string;
}

export interface JobsResponse {
    jobs: Job[];
}

// Fetch products for a specific API config
export const fetchProducts = async (configId: number): Promise<ProductsResponse> => {
    try {
        const { apiBase, headers } = headersBuilder();
        const response = await fetch(`${apiBase}${API_ENDPOINTS.PRODUCTS}/${configId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// Refresh jobs (both regular and smart auto jobs)
export const refreshJobs = async (): Promise<JobsResponse> => {
    try {
        const { apiBase, headers } = headersBuilder();
        const response = await fetch(`${apiBase}${API_ENDPOINTS.AUTO}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error refreshing jobs:', error);
        throw error;
    }
};

// Start Smart Auto (scheduled mode)
export const startSmartAutoScheduled = async (config: SmartAutoConfig): Promise<SmartAutoResponse> => {
    try {
        const { apiBase, headers } = headersBuilder();
        const response = await fetch(`${apiBase}${API_ENDPOINTS.SMART_AUTO_START}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify({ config }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error starting Smart Auto scheduled:', error);
        throw error;
    }
};

// Run Smart Auto once (one-time mode)
export const runSmartAutoOnce = async (config: SmartAutoConfig): Promise<SmartAutoResponse> => {
    try {
        const { apiBase, headers } = headersBuilder();
        const response = await fetch(`${apiBase}${API_ENDPOINTS.AUTO_RUN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify({ config }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error running Smart Auto once:', error);
        throw error;
    }
};

// Stop Smart Auto job
export const stopSmartAutoJob = async (jobId: string): Promise<void> => {
    try {
        const { apiBase, headers } = headersBuilder();
        const response = await fetch(`${apiBase}${API_ENDPOINTS.SMART_AUTO_STOP}/${jobId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error stopping Smart Auto job:', error);
        throw error;
    }
};
