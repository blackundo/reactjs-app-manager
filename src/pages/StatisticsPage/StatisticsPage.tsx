import { Section, Cell, List, Text, Avatar, Badge } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useSignal, isMiniAppDark } from '@telegram-apps/sdk-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { Page } from '@/components/Page.tsx';
import { getStatistics, StatisticsData, getAllBalances, BalanceResponse } from '@/services/statisticsService.ts';



import './StatisticsPage.css';




export const StatisticsPage: FC = () => {
    const [statistics, setStatistics] = useState<StatisticsData | null>(null);
    const [balances, setBalances] = useState<BalanceResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isDark = useSignal(isMiniAppDark);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch cả statistics và balances song song
                const [statisticsData, balancesData] = await Promise.all([
                    getStatistics(),
                    getAllBalances()
                ]);

                setStatistics(statisticsData);
                setBalances(balancesData);
                setError(null);
            } catch (err) {
                setError('Không thể tải dữ liệu thống kê');
                console.error('Failed to fetch data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const StatisticsSkeleton = () => (
        <SkeletonTheme
            baseColor={isDark ? "#2a2f3a" : "#e9edf3"}
            highlightColor={isDark ? "#3a4050" : "#f7f9fc"}
        >
            <Section header="Chỉ số hoạt động">
                <Cell
                    before={<Skeleton circle height={48} width={48} />}
                    after={<Skeleton width={60} height={32} borderRadius={16} />}
                >
                    <Skeleton width={120} height={16} />
                </Cell>
                <Cell
                    before={<Skeleton circle height={48} width={48} />}
                    after={<Skeleton width={60} height={32} borderRadius={16} />}
                >
                    <Skeleton width={140} height={16} />
                </Cell>
                <Cell
                    before={<Skeleton circle height={48} width={48} />}
                    after={<Skeleton width={60} height={32} borderRadius={16} />}
                >
                    <Skeleton width={80} height={16} />
                </Cell>
            </Section>
            <Section header="Tổng Balance API">
                {[...Array(4)].map((_, index) => (
                    <Cell key={index} after={<Skeleton width={100} height={32} borderRadius={16} />}>
                        <Skeleton width={150} height={16} />
                    </Cell>
                ))}
            </Section>
        </SkeletonTheme>
    );

    if (loading) {
        return (
            <Page back={false}>
                <List>
                    <StatisticsSkeleton />
                </List>
            </Page>
        );
    }

    if (error) {
        return (
            <Page back={false}>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <Text style={{ color: 'red' }}>{error}</Text>
                </div>
            </Page>
        );
    }

    return (
        <Page back={false}>
            <List>
                <Section header="Chỉ số hoạt động">
                    <Cell
                        after={<Badge
                            type="number"
                            large
                            mode={statistics?.clone_fb == '0' ? 'critical' : 'primary'}
                        >
                            {statistics?.clone_fb || '0'}
                        </Badge>}
                        before={<Avatar size={48}><svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
                        </svg></Avatar>}
                        subtitle="Clone Facebook còn lại"
                        titleBadge={<Badge mode={statistics?.clone_fb == '0' ? 'critical' : 'primary'} type="dot" />}
                        interactiveAnimation="opacity"
                    >
                        Clone Facebook
                    </Cell>
                    <Cell
                        after={<Badge
                            type="number"
                            large
                            mode={statistics?.clone_cm == '0' ? 'critical' : 'primary'}
                        >
                            {statistics?.clone_cm || '0'}
                        </Badge>}
                        before={<Avatar size={48}><svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" fill="#FFD700" stroke="#FFA500" strokeWidth="1" />
                            <circle cx="12" cy="12" r="7" fill="#FFED4E" />
                            <text x="12" y="16" fontSize="12" fill="#B8860B" textAnchor="middle" fontWeight="bold">$</text>
                            <circle cx="8" cy="8" r="1" fill="#FFF8DC" opacity="0.7" />
                            <circle cx="16" cy="9" r="0.5" fill="#FFF8DC" opacity="0.5" />
                        </svg></Avatar>}
                        subtitle="Clone Coin Master còn lại"
                        titleBadge={<Badge mode={statistics?.clone_cm == '0' ? 'critical' : 'primary'} type="dot" />}
                        interactiveAnimation="opacity"
                    >
                        Clone Coin Master
                    </Cell>

                    <Cell
                        after={<Badge
                            type="number"
                            large
                            mode={statistics?.order == '0' ? 'critical' : 'primary'}
                        >
                            {statistics?.order || '0'}
                        </Badge>}
                        before={<Avatar size={48}><svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="#4CAF50" />
                        </svg></Avatar>}
                        subtitle="Order hiện có"
                        titleBadge={<Badge mode={statistics?.order == '0' ? 'critical' : 'primary'} type="dot" />}
                        interactiveAnimation="opacity"
                    >
                        Order
                    </Cell>

                </Section>

                <Section header="Tổng Balance API">
                    {balances?.results?.map((balance) => (
                        <Cell
                            key={balance.id}
                            after={<Badge
                                type="number"
                                large
                                mode="primary"
                            >
                                {balance.balance.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                {balance.status === 'error' && (
                                    <Text style={{ color: 'red', fontSize: '12px' }}>
                                        {balance.message}
                                    </Text>
                                )}
                            </Badge>}
                        >
                            {balance.name}
                        </Cell>
                    ))}
                    {(!balances?.results || balances.results.length === 0) && (
                        <Cell>
                            Không có cấu hình API nào được kích hoạt
                        </Cell>
                    )}
                </Section>
            </List>
        </Page>
    );
};
