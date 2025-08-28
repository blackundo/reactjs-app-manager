import { useSignal, initDataRaw, initDataState } from '@telegram-apps/sdk-react';

export const useInitData = () => {
    // Sử dụng useSignal để lấy init data reactive như trong InitDataPage mẫu
    const initData = useSignal(initDataRaw);
    const initState = useSignal(initDataState);

    return {
        initData,
        initState,
        hasInitData: !!initData,
        user: initState?.user
    };
};
