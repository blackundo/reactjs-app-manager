import React, { useState, useEffect } from 'react';
import { Section, Cell, Text, Spinner } from '@telegram-apps/telegram-ui';
import { useSignal, isMiniAppDark, retrieveLaunchParams } from '@telegram-apps/sdk-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import authService, { UserInfo } from '@/services/authService';
import { Page } from '@/components/Page';

interface AuthGuardProps {
    children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const isDark = useSignal(isMiniAppDark);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsLoading(true);

                // Debug: Log initData info
                try {
                    const { initDataRaw } = retrieveLaunchParams();
                    console.log('🔍 Debug AuthGuard - initDataRaw:', initDataRaw);
                    if (initDataRaw && typeof initDataRaw === 'string') {
                        const parsed = new URLSearchParams(initDataRaw);
                        const userStr = parsed.get('user');
                        if (userStr) {
                            const user = JSON.parse(userStr);
                            console.log('🔍 Debug AuthGuard - Parsed user:', user);
                            console.log('🔍 Debug AuthGuard - User ID:', user.id);
                        }
                    }
                } catch (debugErr) {
                    console.log('🔍 Debug AuthGuard - Parse error:', debugErr);
                }

                const user = await authService.getCurrentUser();
                console.log('✅ Debug AuthGuard - Auth success:', user);

                // Log user ID để thêm vào database
                if (user.id !== 5168993511) {
                    console.log(`🆔 ADD THIS USER TO ADMIN DATABASE:`);
                    console.log(`curl -X POST ${import.meta.env.DEV ? 'http://localhost:8888' : 'https://miniapp.modundo.com'}/api/admin-users \\`);
                    console.log(`-H "Content-Type: application/json" \\`);
                    console.log(`-H "x-dev-admin-id: 5168993511" \\`);
                    console.log(`-H "x-dev-secret: 123456" \\`);
                    console.log(`-d '{"telegram_id": "${user.id}", "first_name": "${user.first_name}", "last_name": "${user.last_name}", "username": "${user.username}"}'`);
                }

                setUserInfo(user);
                setIsAuthorized(true);
                setError(null);
            } catch (err: any) {
                console.error('❌ Debug AuthGuard - Authorization failed:', err);
                setIsAuthorized(false);
                setError(err.message || 'Không có quyền truy cập');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const LoadingSkeleton = () => {
        // Debug info during loading too
        let debugUserId = 'Không xác định';
        try {
            const { initDataRaw } = retrieveLaunchParams();
            if (initDataRaw && typeof initDataRaw === 'string') {
                const parsed = new URLSearchParams(initDataRaw);
                const userStr = parsed.get('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    debugUserId = user.id || 'Không có ID';
                }
            }
        } catch (err) {
            console.log('Debug loading: Could not extract user ID:', err);
        }

        return (
            <SkeletonTheme
                baseColor={isDark ? "#2a2f3a" : "#e9edf3"}
                highlightColor={isDark ? "#3a4050" : "#f7f9fc"}
            >
                <Page back={false}>
                    <Section header="Đang xác thực...">
                        <Cell>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Skeleton circle height={48} width={48} />
                                <div style={{ flex: 1 }}>
                                    <Skeleton width="60%" height={16} style={{ marginBottom: '8px' }} />
                                    <Skeleton width="40%" height={14} />
                                </div>
                            </div>
                        </Cell>
                        <Cell>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                                <Spinner size="m" />
                                <Text style={{ marginLeft: '12px' }}>Đang kiểm tra quyền truy cập...</Text>
                            </div>
                        </Cell>
                        <Cell>
                            <div style={{
                                backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                                padding: '8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                color: isDark ? '#8e8e93' : '#6d6d6d',
                                textAlign: 'center'
                            }}>
                                Debug: User ID = {debugUserId}
                            </div>
                        </Cell>
                    </Section>
                </Page>
            </SkeletonTheme>
        );
    };

    const UnauthorizedPage = () => {
        // Try to get user ID from initData for debugging
        let debugUserId = 'Không xác định';
        try {
            const { initDataRaw } = retrieveLaunchParams();
            if (initDataRaw && typeof initDataRaw === 'string') {
                const parsed = new URLSearchParams(initDataRaw);
                const userStr = parsed.get('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    debugUserId = user.id || 'Không có ID';
                }
            }
        } catch (err) {
            console.log('Debug: Could not extract user ID:', err);
        }

        return (
            <Page back={false}>
                <Section header="Truy cập bị từ chối">
                    <Cell>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '40px 20px',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '48px',
                                marginBottom: '16px',
                                color: '#ff4757'
                            }}>
                                🚫
                            </div>
                            <Text weight="1" style={{
                                fontSize: '18px',
                                marginBottom: '8px',
                                color: '#ff4757'
                            }}>
                                Không có quyền truy cập
                            </Text>
                            <Text style={{
                                color: isDark ? '#8e8e93' : '#6d6d6d',
                                lineHeight: '1.4',
                                marginBottom: '12px'
                            }}>
                                Bạn không có quyền sử dụng ứng dụng này. Vui lòng liên hệ admin để được cấp quyền.
                            </Text>

                            {/* Debug info */}
                            <div style={{
                                backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                                padding: '12px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                color: isDark ? '#8e8e93' : '#6d6d6d',
                                marginBottom: '12px'
                            }}>
                                <div><strong>Debug Info:</strong></div>
                                <div>User ID hiện tại: {debugUserId}</div>
                                <div>Admin ID yêu cầu: 5168993511</div>
                            </div>

                            {error && (
                                <Text style={{
                                    color: '#ff4757',
                                    fontSize: '14px',
                                    marginTop: '12px',
                                    backgroundColor: isDark ? '#2a1f1f' : '#ffe8e8',
                                    padding: '8px 12px',
                                    borderRadius: '8px'
                                }}>
                                    Chi tiết lỗi: {error}
                                </Text>
                            )}
                        </div>
                    </Cell>
                </Section>
            </Page>
        );
    };

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (!isAuthorized || !userInfo) {
        return <UnauthorizedPage />;
    }

    // Pass userInfo through context or props to children
    return (
        <UserContext.Provider value={userInfo}>
            {children}
        </UserContext.Provider>
    );
};

// Create a context for user info
export const UserContext = React.createContext<UserInfo | null>(null);

// Hook to use user info
export const useUser = () => {
    const context = React.useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within AuthGuard');
    }
    return context;
};

export default AuthGuard;
