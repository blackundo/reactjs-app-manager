import { headersBuilder, API_ENDPOINTS } from '@/config/api';

export interface Account {
    id: number;
    info: string;
    status: 'active' | 'inactive' | 'running';
}

export interface AccountsResponse {
    data: Account[];
}

// Fetch accounts from backend
export const fetchAccounts = async (): Promise<Account[]> => {
    try {
        const { apiBase, headers } = headersBuilder();
        const response = await fetch(`${apiBase}${API_ENDPOINTS.ACCOUNTS}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: AccountsResponse = await response.json();
        return result.data || [];
    } catch (error) {
        console.error('Error fetching accounts:', error);
        throw error;
    }
};

// Delete account huy
export const deleteAccount = async (id: number): Promise<void> => {
    try {
        const { apiBase, headers } = headersBuilder();
        const response = await fetch(`${apiBase}${API_ENDPOINTS.ACCOUNTS}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
};
