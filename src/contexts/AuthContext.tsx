import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    verifyUser,
    storeAuthData,
    getStoredUserInfo,
    clearAuthData,
    isAuthenticated,
    UserInfo,
    AuthResponse
} from '@/services/authService';
import { useSnackbar } from '@/components/Snackbar/useSnackbar';
import { useInitData } from '@/hooks/useInitData';

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
    const { initData } = useInitData();

    // Function để thực hiện login
    const login = async (): Promise<void> => {
        try {
            setIsLoading(true);
            const authData: AuthResponse = await verifyUser(initData);

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
                // Luôn verify với server để đảm bảo quyền thực tế
                // Không dựa vào localStorage để tăng tính bảo mật
                console.log('[AUTH] Starting fresh authentication check...');
                await login();
            } catch (error) {
                // Login failed, user sẽ thấy error screen
                console.error('[AUTH] Authentication failed:', error);
                setIsLoading(false);
                setIsAuthorized(false);
                setUser(null);
                clearAuthData(); // Clear any stale data
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
