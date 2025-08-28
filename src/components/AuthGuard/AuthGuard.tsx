import React from 'react';
import { Placeholder, Spinner, Button } from '@telegram-apps/telegram-ui';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
    children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { isLoading, isAuthorized, login } = useAuth();

    // Hiển thị loading spinner
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <Spinner size="l" />
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    Đang xác thực người dùng...
                </div>
            </div>
        );
    }

    // Nếu không được authorize
    if (!isAuthorized) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                padding: '2rem'
            }}>
                <Placeholder
                    header="Truy cập bị từ chối"
                    description="Bạn không có quyền truy cập vào ứng dụng này. Vui lòng liên hệ quản trị viên để được cấp quyền."
                    action={
                        <Button size="l" onClick={login}>
                            Thử lại
                        </Button>
                    }
                >
                    <img
                        alt="Access denied"
                        src="https://telegram.org/img/t_logo.png"
                        style={{ display: 'block', width: '144px', height: '144px' }}
                    />
                </Placeholder>
            </div>
        );
    }

    // Nếu được authorize, render children
    return <>{children}</>;
};
