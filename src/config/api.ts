// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888';

// Headers builder for API calls
export const headersBuilder = () => {
    const headers: Record<string, string> = {};

    // Get initData from Telegram WebApp SDK
    const tg = (window as any).Telegram?.WebApp;
    const initData = tg?.initData || '';

    if (initData) {
        headers['x-telegram-init-data'] = initData;
    } else {
        // Development mode - use dev credentials
        const devAdminId = import.meta.env.VITE_DEV_ADMIN_ID || '5168993511';
        const devSecret = import.meta.env.VITE_DEV_SECRET || '123456';
        if (devAdminId) headers['x-dev-admin-id'] = devAdminId;
        if (devSecret) headers['x-dev-secret'] = devSecret;
    }

    return { apiBase: API_BASE_URL, headers };
};

// API endpoints
export const API_ENDPOINTS = {
    ACCOUNTS: '/api/accounts',
    API_CONFIGS: '/api/api-configs',
    CONFIGS: '/api/configs',
    AUTO: '/api/auto',
    AUTO_START: '/api/auto/start',
    AUTO_STOP: '/api/auto',
    SMART_AUTO: '/api/smart-auto',
    SMART_AUTO_START: '/api/smart-auto/start',
    SMART_AUTO_STOP: '/api/smart-auto',
    AUTO_RUN: '/api/auto-run',
    RUNS: '/api/runs',
    UPLOAD_TXT: '/api/upload/txt',
    UPLOAD_XML: '/api/upload/xml',
    PRODUCTS: '/api/products',
    PURCHASE: '/api/purchase',
    CHECK_ALL_BALANCES: '/api/check-all-balances',
} as const;
