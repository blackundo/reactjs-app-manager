import { Section, Cell, List, Button, Text, Input, Select } from '@telegram-apps/telegram-ui';
import { useState, useEffect } from 'react';
import type { FC } from 'react';

import { Page } from '@/components/Page.tsx';
import { bem } from '@/css/bem.ts';
import { fetchApiConfigsList } from '@/services/apiConfigService';
import { refreshJobs, startAutoJob, stopAutoJob } from '@/services/autoService';

import './AutoPage.css';

const [, e] = bem('auto-page');

interface Job {
    id: string;
    next_run?: string;
    name?: string;
    interval?: number;
}

interface ApiConfig {
    id: number;
    name: string;
    version: 'version_1' | 'version_2';
    domain: string;
    enabled: boolean;
}

export const AutoPage: FC = () => {
    const [autoApi, setAutoApi] = useState('');
    const [autoId, setAutoId] = useState('');
    const [apiConfigs, setApiConfigs] = useState<ApiConfig[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchApiConfigs();
        loadJobs();
    }, []);

    const fetchApiConfigs = async () => {
        try {
            const data = await fetchApiConfigsList();
            // Chỉ lấy các config đã enabled
            const enabledConfigs = data.filter(config => config.enabled);
            setApiConfigs(enabledConfigs);

            // Set default API nếu chưa có
            if (enabledConfigs.length > 0 && !autoApi) {
                setAutoApi(enabledConfigs[0].id.toString());
            }
        } catch (err) {
            console.error('Error fetching API configs:', err);
            setError('Không thể tải danh sách API configs');
        }
    };

    const loadJobs = async () => {
        try {
            const response = await refreshJobs();
            const allJobs = response.jobs || [];
            // Tách Smart Auto jobs và regular jobs
            const regularJobs = allJobs.filter((job: Job) => !job.id.startsWith('smart-auto-'));
            setJobs(regularJobs);
        } catch (err) {
            console.error('Error refreshing jobs:', err);
            setError('Không thể tải danh sách jobs');
        }
    };

    const startAuto = async () => {
        if (!autoApi) {
            alert('Vui lòng chọn API');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const config = apiConfigs.find(c => c.id.toString() === autoApi);
            if (!config) {
                alert('API không hợp lệ');
                return;
            }

            // Kiểm tra xem API có cần Product ID không
            // Version 2 thường cần Product ID
            const needsId = config.version === 'version_2';
            if (needsId && !autoId.trim()) {
                alert('API này cần Product ID');
                return;
            }

            const payload = {
                api_config_id: parseInt(autoApi),
                product_id: autoId.trim() || null
            };

            const response = await startAutoJob(payload);
            alert(`Đã tạo job auto thành công! Job ID: ${response.job_id || 'N/A'}`);

            // Reset form
            setAutoId('');

            // Refresh jobs list
            await loadJobs();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi start auto';
            alert(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const stopJob = async (jobId: string) => {
        if (!window.confirm('Bạn có chắc muốn dừng job này?')) {
            return;
        }

        try {
            setError(null);
            await stopAutoJob(jobId);
            alert('Job đã được dừng thành công');
            await loadJobs();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi khi dừng job';
            alert(errorMessage);
            setError(errorMessage);
        }
    };

    const handleApiChange = (apiId: string) => {
        setAutoApi(apiId);
        setAutoId(''); // Reset Product ID khi đổi API
    };

    return (
        <Page>
            <List>
                <Section header="Auto Configuration">
                    <Cell className={e('config-section')}>
                        <div className={e('config-content')}>
                            <Text className={e('config-label')}>Chọn API</Text>
                            <Select
                                value={autoApi}
                                onChange={(e) => handleApiChange(e.target.value)}
                                className={e('config-select')}
                            >
                                <option value="">-- Chọn API --</option>
                                {apiConfigs.map((config) => (
                                    <option key={config.id} value={config.id.toString()}>
                                        {config.name} ({config.version === 'version_1' ? 'V1' : 'V2'}) - {config.domain}
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
                                placeholder="Nhập Product ID (nếu cần)"
                                className={e('config-input')}
                            />
                            <Text className={e('config-help')}>
                                {(() => {
                                    const config = apiConfigs.find(c => c.id.toString() === autoApi);
                                    if (!config) return "Chọn API trước";
                                    return config.version === 'version_2' ? "Bắt buộc cho Version 2" : "Tùy chọn cho Version 1";
                                })()}
                            </Text>
                        </div>
                    </Cell>

                    {error && (
                        <Cell className={e('error-section')}>
                            <Text className={e('error-text')}>{error}</Text>
                        </Cell>
                    )}

                    <Cell className={e('action-section')}>
                        <Button
                            mode="filled"
                            size="l"
                            onClick={startAuto}
                            disabled={loading || !autoApi}
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
                            onClick={loadJobs}
                            className={e('refresh-btn')}
                        >
                            🔄 Refresh Jobs
                        </Button>
                    </Cell>

                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <Cell key={job.id} className={e('job-item')}>
                                <div className={e('job-content')}>
                                    <div className={e('job-info')}>
                                        <Text className={e('job-id')}>{job.id}</Text>
                                        {job.name && (
                                            <Text className={e('job-name')}>{job.name}</Text>
                                        )}
                                        <Text className={e('job-next')}>
                                            Next run: {job.next_run ? new Date(job.next_run).toLocaleString('vi-VN') : 'N/A'}
                                        </Text>
                                        {job.interval && (
                                            <Text className={e('job-interval')}>
                                                Interval: {job.interval}s
                                            </Text>
                                        )}
                                    </div>
                                    <Button
                                        mode="outline"
                                        size="s"
                                        onClick={() => stopJob(job.id)}
                                        className={e('stop-btn')}
                                    >
                                        Dừng
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
