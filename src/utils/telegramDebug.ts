import { retrieveLaunchParams, initDataRaw } from '@telegram-apps/sdk-react';

export const debugTelegramInitData = () => {
    console.log('🔍 === TELEGRAM INIT DATA DEBUG ===');

    // Method 1: retrieveLaunchParams
    try {
        const { initDataRaw: launchParamsInitData } = retrieveLaunchParams();
        console.log('✅ Method 1 - retrieveLaunchParams:', launchParamsInitData);
        console.log('   Type:', typeof launchParamsInitData);
        console.log('   Length:', typeof launchParamsInitData === 'string' ? launchParamsInitData.length : 0);
    } catch (err) {
        console.log('❌ Method 1 - retrieveLaunchParams failed:', err);
    }

    // Method 2: initDataRaw signal
    try {
        const signalInitData = initDataRaw();
        console.log('✅ Method 2 - initDataRaw signal:', signalInitData);
        console.log('   Type:', typeof signalInitData);
        console.log('   Length:', typeof signalInitData === 'string' ? signalInitData.length : 0);
    } catch (err) {
        console.log('❌ Method 2 - initDataRaw signal failed:', err);
    }

    // Method 3: Direct Telegram WebApp API
    try {
        const tg = (window as any).Telegram?.WebApp;
        console.log('✅ Method 3 - Telegram WebApp object exists:', !!tg);
        console.log('   initData:', tg?.initData);
        console.log('   initDataUnsafe:', tg?.initDataUnsafe);
        console.log('   version:', tg?.version);
        console.log('   platform:', tg?.platform);
        console.log('   isExpanded:', tg?.isExpanded);
    } catch (err) {
        console.log('❌ Method 3 - Telegram WebApp failed:', err);
    }

    // Method 4: URL parameters
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const tgWebAppData = urlParams.get('tgWebAppData');
        console.log('✅ Method 4 - URL tgWebAppData:', tgWebAppData);
    } catch (err) {
        console.log('❌ Method 4 - URL parameters failed:', err);
    }

    // Environment info
    console.log('🌍 Environment info:');
    console.log('   DEV mode:', import.meta.env.DEV);
    console.log('   Hostname:', window.location.hostname);
    console.log('   URL:', window.location.href);
    console.log('   User Agent:', navigator.userAgent);

    console.log('🔍 === END DEBUG ===');
};

export const parseInitData = (initData: string) => {
    try {
        const parsed = new URLSearchParams(initData);
        const userStr = parsed.get('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            return {
                user,
                auth_date: parsed.get('auth_date'),
                hash: parsed.get('hash'),
                query_id: parsed.get('query_id')
            };
        }
        return null;
    } catch (err) {
        console.error('Failed to parse initData:', err);
        return null;
    }
};
