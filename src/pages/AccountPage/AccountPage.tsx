import { Section, Cell, List, Button, Title, Text, Input, Pagination } from '@telegram-apps/telegram-ui';
import { useState, useMemo } from 'react';
import type { FC, ChangeEvent } from 'react';

import { Page } from '@/components/Page.tsx';
import { bem } from '@/css/bem.ts';

import './AccountPage.css';

const [b, e] = bem('account-page');

interface Account {
    id: number;
    info: string;
    status: 'active' | 'inactive' | 'running';
}

const ITEMS_PER_PAGE = 3;

export const AccountPage: FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([
        {
            id: 1,
            info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            status: 'active'
        },
        {
            id: 2,
            info: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            status: 'running'
        },
        {
            id: 3,
            info: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
            status: 'inactive'
        },
        {
            id: 4,
            info: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
            status: 'active'
        },
        {
            id: 5,
            info: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
            status: 'running'
        },
        {
            id: 6,
            info: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
            status: 'active'
        },
        {
            id: 7,
            info: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
            status: 'inactive'
        },
        {
            id: 8,
            info: "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.",
            status: 'running'
        }
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

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

    const handleDelete = (id: number) => {
        setAccounts(prev => prev.filter(account => account.id !== id));
        // Reset to first page if current page becomes empty
        if (currentAccounts.length === 1 && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
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

    const handlePageChange = (event: any, page: number) => {
        setCurrentPage(page);
    };

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
