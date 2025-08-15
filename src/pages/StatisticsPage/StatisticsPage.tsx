import { Section, Cell, List, Title, Text } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { Page } from '@/components/Page.tsx';
import { bem } from '@/css/bem.ts';

import './StatisticsPage.css';

const [b, e] = bem('statistics-page');

export const StatisticsPage: FC = () => {
    return (
        <Page back={false}>
            <List>
                <Section header="Chỉ số hoạt động">
                    <Cell className={e('stat-item')}>
                        <div className={e('stat-content')}>
                            <div className={e('stat-info')}>
                                <Title level="3">Clone Facebook</Title>
                                <Text className={e('stat-value')}>1,234</Text>
                            </div>
                            <div className={e('stat-icon')}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
                                </svg>
                            </div>
                        </div>
                    </Cell>

                    <Cell className={e('stat-item')}>
                        <div className={e('stat-content')}>
                            <div className={e('stat-info')}>
                                <Title level="3">Clone Coin Master</Title>
                                <Text className={e('stat-value')}>2,567</Text>
                            </div>
                            <div className={e('stat-icon')}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" fill="#FFD700" />
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#FF6B35" />
                                </svg>
                            </div>
                        </div>
                    </Cell>

                    <Cell className={e('stat-item')}>
                        <div className={e('stat-content')}>
                            <div className={e('stat-info')}>
                                <Title level="3">Order - Xún</Title>
                                <Text className={e('stat-value')}>3,891</Text>
                            </div>
                            <div className={e('stat-icon')}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="#4CAF50" />
                                </svg>
                            </div>
                        </div>
                    </Cell>
                </Section>

                <Section header="Tổng Balance API">
                    <Cell className={e('balance-item')}>
                        <div className={e('balance-content')}>
                            <div className={e('balance-info')}>
                                <Title level="3">Facebook API</Title>
                                <Text className={e('balance-amount')}>$12,450.00</Text>
                            </div>
                            <div className={e('balance-status')}>
                                <span className={e('status-indicator', 'active')}></span>
                            </div>
                        </div>
                    </Cell>

                    <Cell className={e('balance-item')}>
                        <div className={e('balance-content')}>
                            <div className={e('balance-info')}>
                                <Title level="3">Coin Master API</Title>
                                <Text className={e('balance-amount')}>$8,920.00</Text>
                            </div>
                            <div className={e('balance-status')}>
                                <span className={e('status-indicator', 'active')}></span>
                            </div>
                        </div>
                    </Cell>

                    <Cell className={e('balance-item')}>
                        <div className={e('balance-content')}>
                            <div className={e('balance-info')}>
                                <Title level="3">Xún API</Title>
                                <Text className={e('balance-amount')}>$15,680.00</Text>
                            </div>
                            <div className={e('balance-status')}>
                                <span className={e('status-indicator', 'active')}></span>
                            </div>
                        </div>
                    </Cell>

                    <Cell className={e('balance-item', 'total')}>
                        <div className={e('balance-content')}>
                            <div className={e('balance-info')}>
                                <Title level="2">Tổng cộng</Title>
                                <Text className={e('balance-amount', 'total')}>$37,050.00</Text>
                            </div>
                        </div>
                    </Cell>
                </Section>
            </List>
        </Page>
    );
};
