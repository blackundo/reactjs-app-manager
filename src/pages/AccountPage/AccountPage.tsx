import { Section, Cell, List, Button, Text, Input, Pagination, Modal, Textarea } from '@telegram-apps/telegram-ui';
import { useState, useMemo, useEffect } from 'react';
import { useSignal, isMiniAppDark } from '@telegram-apps/sdk-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
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
    const isDark = useSignal(isMiniAppDark);

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

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

    const handleCellClick = (account: Account) => {
        setSelectedAccount(account);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAccount(null);
    };

    const handleCopyAccountInfo = async () => {
        if (selectedAccount?.info) {
            try {
                await navigator.clipboard.writeText(selectedAccount.info);
                alert('Đã copy thông tin tài khoản!');
            } catch (err) {
                console.error('Lỗi khi copy:', err);
                alert('Không thể copy. Hãy copy thủ công.');
            }
        }
    };

    const AccountSkeleton = () => (
        <SkeletonTheme
            baseColor={isDark ? "#2a2f3a" : "#e9edf3"}
            highlightColor={isDark ? "#3a4050" : "#f7f9fc"}
        >
            <div className={e('search-container')}>
                <div style={{
                    width: '100%',
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: isDark ? '#2a2f3a' : '#e9edf3',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px'
                }}>
                    <Skeleton width="40%" height={16} />
                </div>
            </div>

            <List>
                <Section header={<Skeleton width={180} height={20} />}>
                    {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
                        <Cell
                            key={index}
                            className={e('account-item')}
                            after={
                                <div className={e('account-actions')}>
                                    <div className={e('status-indicator')}>
                                        <Skeleton circle width={8} height={8} style={{ marginRight: 8 }} />
                                        <Skeleton width={70} height={14} />
                                    </div>
                                    <div className={e('action-buttons')}>
                                        <div style={{
                                            width: 70,
                                            height: 32,
                                            borderRadius: 8,
                                            backgroundColor: isDark ? '#3a4050' : '#f7f9fc',
                                            marginRight: 8
                                        }}>
                                            <Skeleton width="100%" height="100%" />
                                        </div>
                                        <div style={{
                                            width: 50,
                                            height: 32,
                                            borderRadius: 8,
                                            backgroundColor: isDark ? '#3a4050' : '#f7f9fc'
                                        }}>
                                            <Skeleton width="100%" height="100%" />
                                        </div>
                                    </div>
                                </div>
                            }
                        >
                            <div className={e('account-id')}>
                                <Skeleton width={60} height={18} />
                            </div>
                        </Cell>
                    ))}
                </Section>
            </List>

            <div className={e('pagination-container')}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '16px 0'
                }}>
                    {[...Array(5)].map((_, index) => (
                        <Skeleton
                            key={index}
                            circle
                            width={32}
                            height={32}
                        />
                    ))}
                </div>
            </div>
        </SkeletonTheme>
    );

    if (loading) {
        return (
            <Page>
                <AccountSkeleton />
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
                                onClick={() => handleCellClick(account)}
                                style={{ cursor: 'pointer' }}
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRestart(account.id);
                                                }}
                                                className={e('restart-btn')}
                                            >
                                                Chạy lại
                                            </Button>
                                            <Button
                                                size="s"
                                                mode="plain"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(account.id);
                                                }}
                                                className={e('delete-btn')}
                                            >
                                                Xóa
                                            </Button>
                                        </div>
                                    </div>
                                }
                            >
                                {/* Không hiển thị account.info ở đây nữa */}
                                <div className={e('account-id')}>
                                    <Text weight="2">#{account.id}</Text>
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

            {/* Modal hiển thị thông tin tài khoản */}
            <Modal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                dismissible={true}
            >
                <div className={e('modal-content')}>
                    <div className={e('modal-header')}>
                        <Text weight="2" style={{ fontSize: '18px' }}>
                            Thông tin tài khoản #{selectedAccount?.id}
                        </Text>
                        <Button
                            size="s"
                            mode="outline"
                            onClick={handleCloseModal}
                            style={{ marginLeft: 'auto' }}
                        >
                            Đóng
                        </Button>
                    </div>

                    <div className={e('modal-body')}>
                        <div className={e('account-status')}>
                            <Text>Trạng thái: </Text>
                            <span
                                className={e('status-dot')}
                                style={{ backgroundColor: getStatusColor(selectedAccount?.status || 'inactive') }}
                            />
                            <Text>{getStatusText(selectedAccount?.status || 'inactive')}</Text>
                        </div>

                        <div className={e('textarea-container')}>
                            <Textarea
                                header="Thông tin tài khoản"
                                value={selectedAccount?.info || ''}
                                readOnly
                                rows={8}
                                placeholder="Không có thông tin"
                            />
                        </div>

                        <div className={e('modal-actions')}>
                            <Button
                                size="s"
                                mode="filled"
                                onClick={handleCopyAccountInfo}
                                disabled={!selectedAccount?.info}
                            >
                                📋 Copy thông tin
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </Page>
    );
};
