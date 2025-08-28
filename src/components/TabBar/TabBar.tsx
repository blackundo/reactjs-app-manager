import { Tabbar } from '@telegram-apps/telegram-ui';
import { useState, useRef, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import type { FC } from 'react';

import { StatisticsPage } from '@/pages/StatisticsPage/StatisticsPage';
import { ManagementPage } from '@/pages/ManagementPage/ManagementPage';
import { InitDataPage } from '@/pages/InitDataPage';
import { LaunchParamsPage } from '@/pages/LaunchParamsPage';
import { ThemeParamsPage } from '@/pages/ThemeParamsPage';
import { AccountPage } from '@/pages/AccountPage/AccountPage';
import { ApiConfigPage } from '@/pages/ApiConfigPage/ApiConfigPage';
import { UploadPage } from '@/pages/UploadPage/UploadPage';
import { AutoPage } from '@/pages/AutoPage/AutoPage';
import { SmartAutoPage } from '@/pages/SmartAutoPage/SmartAutoPage';
import { RunsPage } from '@/pages/RunsPage/RunsPage';

import './TabBar.css';

const TabBarContent: FC = () => {
    const navigate = useNavigate();
    const tabbarRef = useRef<HTMLDivElement>(null);

    const tabs = [
        {
            id: 0,
            label: 'Thống kê',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" fill="currentColor" />
                </svg>
            ),
            path: '/'
        },
        {
            id: 1,
            label: 'Quản lý',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />
                </svg>
            ),
            path: '/management'
        }
    ];

    const [currentTab, setCurrentTab] = useState(tabs[0].id);

    // Navigate when tab changes
    const handleTabChange = (tabId: number) => {
        setCurrentTab(tabId);
        navigate(tabs[tabId].path);
    };

    useEffect(() => {
        const tabbar = tabbarRef.current;
        if (!tabbar) return;

        const handleClick = (e: Event) => {
            const target = e.target as HTMLElement;
            const tabItem = target.closest('[data-tab-id]');
            if (tabItem) {
                const tabId = parseInt(tabItem.getAttribute('data-tab-id') || '0');
                handleTabChange(tabId);
            }
        };

        tabbar.addEventListener('click', handleClick);
        return () => tabbar.removeEventListener('click', handleClick);
    }, [navigate]);

    return (
        <div className="tabbar-container">
            <div className="tabbar-content">
                <Routes>
                    <Route path="/" element={<StatisticsPage />} />
                    <Route path="/management" element={<ManagementPage />} />
                    <Route path="/init-data" element={<InitDataPage />} />
                    <Route path="/launch-params" element={<LaunchParamsPage />} />
                    <Route path="/theme-params" element={<ThemeParamsPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/api-config" element={<ApiConfigPage />} />
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/auto" element={<AutoPage />} />
                    <Route path="/smart-auto" element={<SmartAutoPage />} />
                    <Route path="/runs" element={<RunsPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
            <div ref={tabbarRef}>
                <Tabbar>
                    {tabs.map(({
                        id,
                        label,
                        icon
                    }) => (
                        <Tabbar.Item
                            key={id}
                            text={label}
                            selected={id === currentTab}
                            data-tab-id={id}
                        >
                            {icon}
                        </Tabbar.Item>
                    ))}
                </Tabbar>
            </div>
        </div>
    );
};

export const TabBar: FC = () => {
    return (
        <HashRouter>
            <TabBarContent />
        </HashRouter>
    );
};
