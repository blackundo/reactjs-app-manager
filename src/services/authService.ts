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
