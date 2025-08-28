import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

export interface UserInfo {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    language_code: string;
    photo_url?: string;
    is_admin: boolean;
}

export interface AuthResponse {
    status: string;
    data: UserInfo;
}

class AuthService {
    private baseUrl = import.meta.env.DEV
        ? 'http://localhost:8888'
        : 'https://miniapp.modundo.com';

    private getHeaders(): HeadersInit {
        try {
            const { initDataRaw } = retrieveLaunchParams();
            console.log('🔍 AuthService - initDataRaw:', initDataRaw);
            console.log('🔍 AuthService - initDataRaw type:', typeof initDataRaw);
            console.log('🔍 AuthService - Is DEV mode:', import.meta.env.DEV);

            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };

            // Check if we have valid initData
            if (initDataRaw && typeof initDataRaw === 'string' && initDataRaw.trim() !== '') {
                console.log('✅ AuthService - Using Telegram initData');
                headers['x-telegram-init-data'] = initDataRaw;
            } else if (import.meta.env.DEV ||
                window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1' ||
                new URLSearchParams(window.location.search).has('debug_mode')) {
                // Sử dụng dev headers trong development mode, localhost, hoặc với ?debug_mode parameter
                console.log('🔧 AuthService - DEV/Local/Debug mode: Using dev headers');
                headers['x-dev-admin-id'] = '5168993511';
                headers['x-dev-secret'] = '123456';
            } else {
                // Production mode thật sự - yêu cầu initData
                console.error('❌ AuthService - PRODUCTION mode but no initData available!');
                console.error('Current hostname:', window.location.hostname);
                console.error('Please open this app from Telegram or use localhost for testing');
                throw new Error('Không có dữ liệu xác thực từ Telegram. Vui lòng mở ứng dụng từ Telegram.');
            }

            return headers;
        } catch (error) {
            console.warn('❌ AuthService - Failed to get Telegram launch params:', error);

            // Fallback về dev headers trong development, localhost, hoặc debug mode
            if (import.meta.env.DEV ||
                window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1' ||
                new URLSearchParams(window.location.search).has('debug_mode')) {
                console.log('🔧 AuthService - DEV/Local/Debug fallback: Using dev headers');
                return {
                    'Content-Type': 'application/json',
                    'x-dev-admin-id': '5168993511',
                    'x-dev-secret': '123456',
                };
            } else {
                // Production thật sự: throw error
                console.error('Production error - hostname:', window.location.hostname);
                throw new Error('Lỗi xác thực. Vui lòng mở ứng dụng từ Telegram.');
            }
        }
    }

    async getCurrentUser(): Promise<UserInfo> {
        try {
            const response = await fetch(`${this.baseUrl}/api/user/current`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const data: AuthResponse = await response.json();
            return data.data;
        } catch (error) {
            console.error('Failed to get current user:', error);
            throw error;
        }
    }

    async checkAdminAccess(): Promise<boolean> {
        try {
            await this.getCurrentUser();
            return true;
        } catch (error) {
            console.error('Admin access check failed:', error);
            return false;
        }
    }
}

export const authService = new AuthService();
export default authService;
