import { headersBuilder, API_ENDPOINTS } from '@/config/api';

export interface ApiConfig {
    id: number;
    name: string;
    version: 'version_1' | 'version_2';
    domain: string;
    endpoint?: string;
    username?: string;
    password?: string;
    api_key?: string;
    coupon?: string;
    product_id: string;
    amount: number;
    chat_id?: string;
    price_range_min?: number;
    price_range_max?: number;
    excluded_category_ids?: string;
    enabled: boolean;
}

export interface CreateApiConfigRequest {
    name: string;
    version: 'version_1' | 'version_2';
    domain: string;
    endpoint: string;
    username: string;
    password: string;
    api_key: string;
    coupon: string;
    product_id: string;
    amount: number;
    chat_id: string;
    price_range_min: string;
    price_range_max: string;
    excluded_category_ids: string;
    enabled: boolean;
}

export interface UpdateApiConfigRequest extends CreateApiConfigRequest {
    id: number;
}

export interface TestPurchaseRequest {
    api_config_id: number;
    custom_amount: number;
}

export interface TestPurchaseResponse {
    message: string;
    success_count: number;
}

// Fetch API configs list
export const fetchApiConfigsList = async (): Promise<ApiConfig[]> => {
    try {
        const { apiBase, headers } = headersBuilder();
        const response = await fetch(`${apiBase}${API_ENDPOINTS.API_CONFIGS}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching API configs list:', error);
        throw error;
    }
};

// Create new API config
export const createApiConfig = async (config: CreateApiConfigRequest): Promise<ApiConfig> => {
    try {
        const { apiBase, headers } = headersBuilder();

        const payload = {
            ...config,
            product_id: parseInt(config.product_id),
            amount: config.amount,
            price_range_min: config.price_range_min ? parseInt(config.price_range_min) : null,
            price_range_max: config.price_range_max ? parseInt(config.price_range_max) : null,
            excluded_category_ids: config.excluded_category_ids || ""
        };

        const response = await fetch(`${apiBase}${API_ENDPOINTS.API_CONFIGS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating API config:', error);
        throw error;
    }
};

// Update existing API config
export const updateApiConfig = async (config: UpdateApiConfigRequest): Promise<ApiConfig> => {
    try {
        const { apiBase, headers } = headersBuilder();

        const payload = {
            ...config,
            product_id: parseInt(config.product_id),
            amount: config.amount,
            price_range_min: config.price_range_min ? parseInt(config.price_range_min) : null,
            price_range_max: config.price_range_max ? parseInt(config.price_range_max) : null,
            excluded_category_ids: config.excluded_category_ids || ""
        };

        const response = await fetch(`${apiBase}${API_ENDPOINTS.API_CONFIGS}/${config.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating API config:', error);
        throw error;
    }
};

// Delete API config
export const deleteApiConfig = async (configId: number): Promise<void> => {
    try {
        const { apiBase, headers } = headersBuilder();
        const response = await fetch(`${apiBase}${API_ENDPOINTS.API_CONFIGS}/${configId}`, {
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
        console.error('Error deleting API config:', error);
        throw error;
    }
};

// Test purchase with API config
export const testPurchase = async (request: TestPurchaseRequest): Promise<TestPurchaseResponse> => {
    try {
        const { apiBase, headers } = headersBuilder();
        const response = await fetch(`${apiBase}${API_ENDPOINTS.PURCHASE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error testing purchase:', error);
        throw error;
    }
};
