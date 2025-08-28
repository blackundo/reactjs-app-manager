import React, { useState, useEffect } from 'react';
import { Section, Cell, Text, Spinner } from '@telegram-apps/telegram-ui';
import { useSignal, isMiniAppDark } from '@telegram-apps/sdk-react';
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
                const user = await authService.getCurrentUser();
                setUserInfo(user);
                setIsAuthorized(true);
                setError(null);
            } catch (err: any) {
                console.error('Authorization failed:', err);
                setIsAuthorized(false);
                setError(err.message || 'Không có quyền truy cập');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const LoadingSkeleton = () => (
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
                </Section>
            </Page>
        </SkeletonTheme>
    );

    const UnauthorizedPage = () => (
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
                            lineHeight: '1.4'
                        }}>
                            Bạn không có quyền sử dụng ứng dụng này. Vui lòng liên hệ admin để được cấp quyền.
                        </Text>
                        {error && (
                            <Text style={{
                                color: '#ff4757',
                                fontSize: '14px',
                                marginTop: '12px',
                                backgroundColor: isDark ? '#2a1f1f' : '#ffe8e8',
                                padding: '8px 12px',
                                borderRadius: '8px'
                            }}>
                                Chi tiết: {error}
                            </Text>
                        )}
                    </div>
                </Cell>
            </Section>
        </Page>
    );

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
