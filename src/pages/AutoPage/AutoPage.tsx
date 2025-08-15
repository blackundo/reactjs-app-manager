import { Section, Cell, List, Button, Text, Input, Select } from '@telegram-apps/telegram-ui';
import { useState, useEffect } from 'react';
import type { FC } from 'react';

import { Page } from '@/components/Page.tsx';
import { bem } from '@/css/bem.ts';

import './AutoPage.css';

const [, e] = bem('auto-page');

interface Job {
    id: string;
    next_run?: string;
}

interface ApiConfig {
    name: string;
    interval: number;
    needs_id?: boolean;
}

export const AutoPage: FC = () => {
    const [autoApi, setAutoApi] = useState('mmo');
    const [autoId, setAutoId] = useState('');
    const [apiConfigs] = useState<Record<string, ApiConfig>>({});
    const [jobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchApiConfigs();
        refreshJobs();
    }, []);

    const fetchApiConfigs = async () => {
        try {
            // TODO: Implement API call
            // const response = await getApiConfigs();
            // setApiConfigs(response.data.configs || {});
        } catch (err) {
            console.error('Error fetching API configs:', err);
        }
    };

    const refreshJobs = async () => {
        try {
            // TODO: Implement API call
            // const response = await getJobs();
            // const allJobs = response.data.jobs || [];
            // const regularJobs = allJobs.filter(job => !job.id.startsWith('smart-auto-'));
            // setJobs(regularJobs);
        } catch (err) {
            console.error('Error refreshing jobs:', err);
        }
    };

    const startAuto = async () => {
        try {
            setLoading(true);
            const config = apiConfigs[autoApi];
            if (!config) {
                alert('API không hợp lệ');
                return;
            }

            if (config.needs_id && !autoId) {
                alert('API này cần Product ID');
                return;
            }

            // TODO: Implement API call with payload
            // const payload = {
            //     api: autoApi,
            //     id: autoId || null
            // };

            // TODO: Implement API call
            // const response = await startAutoJob(payload);
            alert(`Đã tạo job auto: ${autoApi} (${config.interval}s)`);
            await refreshJobs();
        } catch (err) {
            alert('Lỗi start auto');
        } finally {
            setLoading(false);
        }
    };

    const stopJob = async (_jobId: string) => {
        try {
            // TODO: Implement API call
            // await stopJobById(jobId);
            await refreshJobs();
        } catch (err) {
            alert('Lỗi stop job');
        }
    };

    return (
        <Page>
            <List>
                <Section header="Auto Configuration">
                    <Cell className={e('config-section')}>
                        <div className={e('config-content')}>
                            <Text className={e('config-label')}>API</Text>
                            <Select
                                value={autoApi}
                                onChange={(e) => setAutoApi(e.target.value)}
                                className={e('config-select')}
                            >
                                {Object.entries(apiConfigs).map(([key, config]) => (
                                    <option key={key} value={key}>
                                        {config.name} ({config.interval}s)
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </Cell>

                    <Cell className={e('config-section')}>
                        <div className={e('config-content')}>
                            <Text className={e('config-label')}>Product ID</Text>
                            <Input
                                value={autoId}
                                onChange={(e) => setAutoId(e.target.value)}
                                placeholder="Nhập Product ID"
                                disabled={!apiConfigs[autoApi]?.needs_id}
                                className={e('config-input')}
                            />
                            <Text className={e('config-help')}>
                                {apiConfigs[autoApi]?.needs_id ? "Bắt buộc" : "Không cần"}
                            </Text>
                        </div>
                    </Cell>

                    <Cell className={e('action-section')}>
                        <Button
                            mode="filled"
                            size="l"
                            onClick={startAuto}
                            disabled={loading}
                            className={e('start-btn')}
                        >
                            {loading ? 'Đang xử lý...' : 'Start Auto'}
                        </Button>
                    </Cell>
                </Section>

                <Section header="Jobs Management">
                    <Cell className={e('refresh-section')}>
                        <Button
                            mode="outline"
                            size="m"
                            onClick={refreshJobs}
                            className={e('refresh-btn')}
                        >
                            Refresh Jobs
                        </Button>
                    </Cell>

                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <Cell key={job.id} className={e('job-item')}>
                                <div className={e('job-content')}>
                                    <div className={e('job-info')}>
                                        <Text className={e('job-id')}>{job.id}</Text>
                                        <Text className={e('job-next')}>
                                            Next: {job.next_run || 'N/A'}
                                        </Text>
                                    </div>
                                    <Button
                                        mode="outline"
                                        size="s"
                                        onClick={() => stopJob(job.id)}
                                        className={e('stop-btn')}
                                    >
                                        Stop
                                    </Button>
                                </div>
                            </Cell>
                        ))
                    ) : (
                        <Cell className={e('no-jobs')}>
                            <Text>Không có jobs nào đang chạy</Text>
                        </Cell>
                    )}
                </Section>
            </List>
        </Page>
    );
};
