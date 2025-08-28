import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSignal, initDataRaw as _initDataRaw } from '@telegram-apps/sdk-react';
import {
    storeAuthData,
    getStoredUserInfo,
    clearAuthData,
    isAuthenticated,
    UserInfo,
    AuthResponse
} from '@/services/authService';
import { useSnackbar } from '@/components/Snackbar/useSnackbar';

interface AuthContextType {
    user: UserInfo | null;
    isLoading: boolean;
    isAuthorized: boolean;
    login: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const { showSnackbar } = useSnackbar();

    // Sử dụng useSignal để lấy init data như trong InitDataPage mẫu
    const initDataRaw = useSignal(_initDataRaw);

    // Function để verify user với init data từ hook
    const verifyUserWithInitData = async (): Promise<AuthResponse> => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        try {
            if (initDataRaw && initDataRaw.trim()) {
                console.log('[AUTH Context] Using Telegram init data:', initDataRaw.slice(0, 100) + '...');
                headers['x-telegram-init-data'] = initDataRaw;
            } else {
                console.log('[AUTH Context] No init data found, using dev bypass');
                // Development mode - use dev credentials
                const devAdminId = import.meta.env.VITE_DEV_ADMIN_ID || '5168993511';
                const devSecret = import.meta.env.VITE_DEV_SECRET || '123456';
                if (devAdminId) headers['x-dev-admin-id'] = devAdminId;
                if (devSecret) headers['x-dev-secret'] = devSecret;
            }
        } catch (error) {
            console.warn('[AUTH Context] Error with init data, falling back to dev mode:', error);
            // Fallback to development mode
            const devAdminId = import.meta.env.VITE_DEV_ADMIN_ID || '5168993511';
            const devSecret = import.meta.env.VITE_DEV_SECRET || '123456';
            if (devAdminId) headers['x-dev-admin-id'] = devAdminId;
            if (devSecret) headers['x-dev-secret'] = devSecret;
        }

        console.log('[AUTH Context] Sending headers:', Object.keys(headers));

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

    // Function để thực hiện login
    const login = async (): Promise<void> => {
        try {
            setIsLoading(true);
            const authData: AuthResponse = await verifyUserWithInitData();

            storeAuthData(authData);
            setUser(authData.user);
            setIsAuthorized(true);

            showSnackbar({
                message: `Chào mừng, ${authData.user.first_name || authData.user.username || 'Admin'}!`,
                type: 'success'
            });
        } catch (error) {
            console.error('Login failed:', error);
            setIsAuthorized(false);
            setUser(null);
            clearAuthData();

            const errorMessage = error instanceof Error ? error.message : 'Lỗi xác thực không xác định';
            showSnackbar({
                message: errorMessage,
                type: 'error'
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Function để logout
    const logout = (): void => {
        clearAuthData();
        setUser(null);
        setIsAuthorized(false);
        showSnackbar({
            message: 'Đã đăng xuất thành công',
            type: 'info'
        });
    };

    // Kiểm tra authentication khi component mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (isAuthenticated()) {
                    const storedUser = getStoredUserInfo();
                    if (storedUser) {
                        setUser(storedUser);
                        setIsAuthorized(true);
                        setIsLoading(false);
                        return;
                    }
                }

                // Nếu không có stored data hoặc invalid, thử verify lại
                await login();
            } catch (error) {
                // Login failed, user sẽ thấy error screen
                setIsLoading(false);
                setIsAuthorized(false);
                setUser(null);
            }
        };

        checkAuth();
    }, []);

    const contextValue: AuthContextType = {
        user,
        isLoading,
        isAuthorized,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
