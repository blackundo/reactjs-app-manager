export interface StatisticsData {
    clone_fb: string;
    clone_cm: string;
    status: string;
    order: string;
}

export interface BalanceResult {
    id: string;
    name: string;
    version: string;
    balance: number;
    status: string;
    message: string;
}

export interface BalanceResponse {
    status: string;
    message: string;
    success_count: number;
    error_count: number;
    results: BalanceResult[];
}

export const getStatistics = async (): Promise<StatisticsData> => {
    try {
        // Sử dụng proxy trong development mode, URL trực tiếp trong production
        const apiUrl = import.meta.env.DEV
            ? '/api/check-tai-nguyen.php'  // Proxy trong dev mode
            : 'https://spin.modundo.com/api/check-tai-nguyen.php'; // Direct URL trong production

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Fallback với no-cors nếu cần
            mode: 'cors',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: StatisticsData = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching statistics:', error);

        // Fallback với no-cors mode nếu CORS vẫn fail
        if (error instanceof TypeError && error.message.includes('CORS')) {
            try {
                const fallbackUrl = import.meta.env.DEV
                    ? '/api/check-tai-nguyen.php'
                    : 'https://spin.modundo.com/api/check-tai-nguyen.php';

                await fetch(fallbackUrl, {
                    method: 'GET',
                    mode: 'no-cors',
                });

                // Với no-cors, chúng ta không thể đọc response content
                // Nên trả về dữ liệu mock hoặc throw error
                throw new Error('CORS issue - unable to fetch data');
            } catch (fallbackError) {
                console.error('Fallback request also failed:', fallbackError);
            }
        }

        throw error;
    }
};

export const getAllBalances = async (): Promise<BalanceResponse> => {
    try {
        const { apiBase, headers } = await import('@/config/api.ts').then(m => m.headersBuilder());
        const { API_ENDPOINTS } = await import('@/config/api.ts');

        const response = await fetch(`${apiBase}${API_ENDPOINTS.CHECK_ALL_BALANCES}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: BalanceResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching all balances:', error);
        throw error;
    }
};
