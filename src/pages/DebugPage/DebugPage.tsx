import { Section, Cell, List, Text, Button } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useState } from 'react';
import { useSignal, initDataRaw, initDataState } from '@telegram-apps/sdk-react';

import { Page } from '@/components/Page.tsx';
import { verifyUser } from '@/services/authService';

export const DebugPage: FC = () => {
    const [authResult, setAuthResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Get init data signals
    const initData = useSignal(initDataRaw);
    const initState = useSignal(initDataState);

    const handleTestAuth = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await verifyUser();
            setAuthResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            setAuthResult(null);
        } finally {
            setLoading(false);
        }
    };

    const getUserInfo = () => {
        if (initState?.user) {
            return {
                id: initState.user.id,
                username: initState.user.username,
                first_name: initState.user.first_name,
                last_name: initState.user.last_name,
                photo_url: initState.user.photo_url
            };
        }
        return null;
    };

    const userInfo = getUserInfo();

    return (
        <Page>
            <List>
                <Section header="🔍 Debug Information">
                    <Cell subtitle="Raw init data từ Telegram SDK">
                        Init Data Raw
                        <div style={{
                            marginTop: '8px',
                            padding: '8px',
                            background: 'var(--tg-theme-secondary-bg-color)',
                            borderRadius: '8px',
                            wordBreak: 'break-all',
                            fontSize: '12px'
                        }}>
                            {initData || 'No init data'}
                        </div>
                    </Cell>

                    <Cell subtitle="Parsed user information từ Telegram SDK">
                        User Info
                        <div style={{
                            marginTop: '8px',
                            padding: '8px',
                            background: 'var(--tg-theme-secondary-bg-color)',
                            borderRadius: '8px',
                            fontSize: '12px'
                        }}>
                            {userInfo ? (
                                <pre>{JSON.stringify(userInfo, null, 2)}</pre>
                            ) : (
                                'No user info available'
                            )}
                        </div>
                    </Cell>

                    <Cell subtitle="Environment variables">
                        Env Vars
                        <div style={{
                            marginTop: '8px',
                            padding: '8px',
                            background: 'var(--tg-theme-secondary-bg-color)',
                            borderRadius: '8px',
                            fontSize: '12px'
                        }}>
                            <div>API_BASE_URL: {import.meta.env.VITE_API_BASE_URL}</div>
                            <div>DEV_ADMIN_ID: {import.meta.env.VITE_DEV_ADMIN_ID}</div>
                            <div>DEV_SECRET: {import.meta.env.VITE_DEV_SECRET ? '***' : 'Not set'}</div>
                        </div>
                    </Cell>
                </Section>

                <Section header="🧪 Test Authentication">
                    <Cell>
                        <Button
                            mode="filled"
                            size="l"
                            onClick={handleTestAuth}
                            disabled={loading}
                            style={{ width: '100%', marginBottom: '16px' }}
                        >
                            {loading ? 'Testing...' : 'Test Auth API'}
                        </Button>

                        {authResult && (
                            <div style={{
                                marginTop: '16px',
                                padding: '12px',
                                background: 'var(--tg-theme-secondary-bg-color)',
                                borderRadius: '8px'
                            }}>
                                <Text style={{ color: 'green', fontWeight: 'bold', marginBottom: '8px' }}>
                                    ✅ Authentication Successful
                                </Text>
                                <pre style={{ fontSize: '12px', margin: 0 }}>
                                    {JSON.stringify(authResult, null, 2)}
                                </pre>
                            </div>
                        )}

                        {error && (
                            <div style={{
                                marginTop: '16px',
                                padding: '12px',
                                background: '#fee',
                                borderRadius: '8px',
                                border: '1px solid #fcc'
                            }}>
                                <Text style={{ color: 'red', fontWeight: 'bold', marginBottom: '8px' }}>
                                    ❌ Authentication Failed
                                </Text>
                                <Text style={{ fontSize: '12px' }}>
                                    {error}
                                </Text>
                            </div>
                        )}
                    </Cell>
                </Section>

                <Section header="ℹ️ Instructions">
                    <Cell>
                        <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                            <p><strong>Trong Telegram:</strong></p>
                            <ul>
                                <li>Init data sẽ tự động được gửi từ Telegram</li>
                                <li>User info sẽ chứa thông tin thật từ tài khoản Telegram</li>
                            </ul>

                            <p><strong>Ngoài Telegram (Development):</strong></p>
                            <ul>
                                <li>Sẽ sử dụng dev bypass với DEV_SECRET</li>
                                <li>Hoặc sử dụng DEV_ADMIN_ID</li>
                            </ul>
                        </div>
                    </Cell>
                </Section>
            </List>
        </Page>
    );
};
