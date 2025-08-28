import { headersBuilder } from '@/config/api';

export interface Admin {
    telegram_id: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface AddAdminRequest {
    telegram_id: string;
    username?: string;
    first_name?: string;
    last_name?: string;
}

export const fetchAdmins = async (): Promise<Admin[]> => {
    const { apiBase, headers } = headersBuilder();
    const res = await fetch(`${apiBase}/api/admins`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Không thể tải danh sách admin');
    }
    const data = await res.json();
    return data?.data || [];
};

export const addAdmin = async (payload: AddAdminRequest): Promise<void> => {
    const { apiBase, headers } = headersBuilder();
    const res = await fetch(`${apiBase}/api/admins`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Không thể thêm admin');
    }
};

export const deactivateAdmin = async (telegramId: string): Promise<void> => {
    const { apiBase, headers } = headersBuilder();
    const res = await fetch(`${apiBase}/api/admins/${telegramId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Không thể vô hiệu hóa admin');
    }
};

export const activateAdmin = async (telegramId: string): Promise<void> => {
    const { apiBase, headers } = headersBuilder();
    const res = await fetch(`${apiBase}/api/admins/${telegramId}/activate`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Không thể kích hoạt admin');
    }
};


