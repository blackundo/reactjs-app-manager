import { Section, Cell, List, Button, Text, Input, Pagination } from '@telegram-apps/telegram-ui';
import { useState, useMemo, useEffect } from 'react';
import type { FC, ChangeEvent } from 'react';

import { Page } from '@/components/Page.tsx';
import { bem } from '@/css/bem.ts';
import { fetchAccounts, deleteAccount, type Account } from '@/services/accountService';

import './AccountPage.css';

const [, e] = bem('account-page');

const ITEMS_PER_PAGE = 9;

export const AccountPage: FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Load accounts on component mount
    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchAccounts();
            setAccounts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
            console.error('Error loading accounts:', err);
        } finally {
            setLoading(false);
        }
    };

    // Helper functions
    const truncateText = (text: string, maxLength: number = 80) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const getStatusColor = (status: Account['status']) => {
        switch (status) {
            case 'active': return '#4CAF50';
            case 'running': return '#2196F3';
            case 'inactive': return '#FF9800';
            default: return '#9E9E9E';
        }
    };

    const getStatusText = (status: Account['status']) => {
        switch (status) {
            case 'active': return 'Hoạt động';
            case 'running': return 'Đang chạy';
            case 'inactive': return 'Tạm dừng';
            default: return 'Không xác định';
        }
    };

    // Filter accounts based on search query
    const filteredAccounts = useMemo(() => {
        if (!searchQuery.trim()) return accounts;

        return accounts.filter(account =>
            account.info.toLowerCase().includes(searchQuery.toLowerCase()) ||
            account.id.toString().includes(searchQuery) ||
            getStatusText(account.status).toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [accounts, searchQuery]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredAccounts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentAccounts = filteredAccounts.slice(startIndex, endIndex);

    const handleDelete = async (id: number) => {
        try {
            await deleteAccount(id);
            setAccounts(prev => prev.filter(account => account.id !== id));
            // Reset to first page if current page becomes empty
            if (currentAccounts.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            }
        } catch (err) {
            alert('Có lỗi xảy ra khi xóa tài khoản');
            console.error('Error deleting account:', err);
        }
    };

    const handleRestart = (id: number) => {
        setAccounts(prev => prev.map(account =>
            account.id === id
                ? { ...account, status: 'running' as const }
                : account
        ));
    };

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchQuery(value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handlePageChange = (_event: any, page: number) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <Page>
                <div className={e('loading-container')}>
                    <Text>Đang tải dữ liệu...</Text>
                </div>
            </Page>
        );
    }

    if (error) {
        return (
            <Page>
                <div className={e('error-container')}>
                    <Text className={e('error-text')}>{error}</Text>
                    <Button mode="outline" onClick={loadAccounts} className={e('retry-btn')}>
                        Thử lại
                    </Button>
                </div>
            </Page>
        );
    }

    return (
        <Page>
            <div className={e('search-container')}>
                <Input
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Tìm kiếm theo ID, thông tin hoặc trạng thái..."
                />
            </div>

            <List>
                <Section header={`Danh sách tài khoản (${filteredAccounts.length} kết quả)`}>
                    {currentAccounts.length > 0 ? (
                        currentAccounts.map((account) => (
                            <Cell
                                key={account.id}
                                className={e('account-item')}
                                before={
                                    <div className={e('account-id')}>
                                        <Text weight="2">#{account.id}</Text>
                                    </div>
                                }
                                after={
                                    <div className={e('account-actions')}>
                                        <div className={e('status-indicator')}>
                                            <span
                                                className={e('status-dot')}
                                                style={{ backgroundColor: getStatusColor(account.status) }}
                                            />
                                            <Text size={1} className={e('status-text')}>
                                                {getStatusText(account.status)}
                                            </Text>
                                        </div>
                                        <div className={e('action-buttons')}>
                                            <Button
                                                size="s"
                                                mode="outline"
                                                onClick={() => handleRestart(account.id)}
                                                className={e('restart-btn')}
                                            >
                                                Chạy lại
                                            </Button>
                                            <Button
                                                size="s"
                                                mode="plain"
                                                onClick={() => handleDelete(account.id)}
                                                className={e('delete-btn')}
                                            >
                                                Xóa
                                            </Button>
                                        </div>
                                    </div>
                                }
                            >
                                <div className={e('account-info')}>
                                    <Text className={e('info-text')}>
                                        {truncateText(account.info)}
                                    </Text>
                                </div>
                            </Cell>
                        ))
                    ) : (
                        <Cell className={e('no-results')}>
                            <Text>Không tìm thấy kết quả nào</Text>
                        </Cell>
                    )}
                </Section>
            </List>

            {totalPages > 1 && (
                <div className={e('pagination-container')}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        boundaryCount={1}
                        siblingCount={1}
                    />
                </div>
            )}
        </Page>
    );
};
