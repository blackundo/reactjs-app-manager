export interface UserInfo {
    telegram_id: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    photo_url?: string;
}

export interface AuthResponse {
    status: string;
    token: string;
    user: UserInfo;
}

export const verifyUser = async (initData?: string | null): Promise<AuthResponse> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (initData) {
        console.log('[AUTH Frontend] Using Telegram init data:', initData.slice(0, 100) + '...');
        headers['x-telegram-init-data'] = initData;
    } else {
        console.log('[AUTH Frontend] No init data found, using dev bypass');
        // Development mode - use dev credentials
        const devAdminId = import.meta.env.VITE_DEV_ADMIN_ID || '5168993511';
        const devSecret = import.meta.env.VITE_DEV_SECRET || '123456';
        if (devAdminId) headers['x-dev-admin-id'] = devAdminId;
        if (devSecret) headers['x-dev-secret'] = devSecret;
    }

    console.log('[AUTH Frontend] Sending headers:', Object.keys(headers));

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify`, {
        method: 'POST',
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Lỗi xác thực người dùng');
    }

    return response.json();
};

// Store user data và token trong localStorage
export const storeAuthData = (authData: AuthResponse): void => {
    localStorage.setItem('auth_token', authData.token);
    localStorage.setItem('user_info', JSON.stringify(authData.user));
};

// Get stored user data
export const getStoredUserInfo = (): UserInfo | null => {
    const userInfo = localStorage.getItem('user_info');
    if (!userInfo) return null;

    try {
        return JSON.parse(userInfo);
    } catch {
        return null;
    }
};

// Get stored token
export const getStoredToken = (): string | null => {
    return localStorage.getItem('auth_token');
};

// Clear stored auth data
export const clearAuthData = (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    const token = getStoredToken();
    const userInfo = getStoredUserInfo();
    return !!(token && userInfo);
};
