import { useSignal, initDataRaw } from '@telegram-apps/sdk-react';

export const useInitData = () => {
    // Sử dụng useSignal để lấy init data reactive
    const initData = useSignal(initDataRaw);
    
    return {
        initData,
        hasInitData: !!initData
    };
};
