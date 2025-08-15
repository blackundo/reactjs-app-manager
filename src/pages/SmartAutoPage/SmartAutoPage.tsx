import { Section, Cell, List, Button, Text, Input, Checkbox } from '@telegram-apps/telegram-ui';
import { useState, useEffect } from 'react';
import type { FC } from 'react';

import { Page } from '@/components/Page.tsx';
import { bem } from '@/css/bem.ts';
import {
    fetchApiConfigsList
} from '@/services/apiConfigService';
import {
    fetchProducts,
    refreshJobs,
    startSmartAutoScheduled,
    runSmartAutoOnce,
    stopSmartAutoJob,
    type Product,
    type Category,
    type SmartAutoResponse,
    type Job
} from '@/services/smartAutoService';

import './SmartAutoPage.css';

const [, e] = bem('smart-auto-page');

interface ApiConfig {
    id: number;
    name: string;
    version: 'version_1' | 'version_2';
    domain: string;
    price_range_min?: number;
    price_range_max?: number;
    excluded_category_ids?: string;
    enabled: boolean;
}

export const SmartAutoPage: FC = () => {
    const [apiConfigsList, setApiConfigsList] = useState<ApiConfig[]>([]);
    const [selectedApiIds, setSelectedApiIds] = useState<number[]>([]);
    const [intervalSeconds, setIntervalSeconds] = useState('300');
    const [smartAutoJobs, setSmartAutoJobs] = useState<Job[]>([]);
    const [schedulerMode, setSchedulerMode] = useState(false);
    const [autoRunning, setAutoRunning] = useState(false);
    const [autoResults, setAutoResults] = useState<SmartAutoResponse | null>(null);
    const [availableProducts, setAvailableProducts] = useState<Record<number, Product[]>>({});
    const [, setAvailableCategories] = useState<Record<number, Category[]>>({});
    const [previewApiId, setPreviewApiId] = useState<number | null>(null);
    const [loadingProducts, setLoadingProducts] = useState<Record<number, boolean>>({});

    useEffect(() => {
        loadApiConfigsList();
        loadJobs();
    }, []);

    const loadApiConfigsList = async () => {
        try {
            const data = await fetchApiConfigsList();
            setApiConfigsList(data);
        } catch (err) {
            console.error('Error fetching API configs list:', err);
            setApiConfigsList([]);
        }
    };

    const loadJobs = async () => {
        try {
            const response = await refreshJobs();
            const allJobs = response.jobs || [];
            const smartJobs = allJobs.filter(job => job.id.startsWith('smart-auto-'));
            setSmartAutoJobs(smartJobs);
        } catch (err) {
            console.error('Error refreshing jobs:', err);
        }
    };

    const loadProducts = async (configId: number) => {
        try {
            setLoadingProducts(prev => ({ ...prev, [configId]: true }));
            const response = await fetchProducts(configId);
            setAvailableProducts(prev => ({
                ...prev,
                [configId]: response.products || []
            }));
            setAvailableCategories(prev => ({
                ...prev,
                [configId]: response.categories || []
            }));
        } catch (err) {
            console.error('Error fetching products:', err);
            alert(`Lỗi khi tải sản phẩm: ${err}`);
        } finally {
            setLoadingProducts(prev => ({ ...prev, [configId]: false }));
        }
    };

    const handlePreviewProducts = async (configId: number) => {
        const config = apiConfigsList.find(c => c.id === configId);
        if (!config) return;

        if (!availableProducts[configId]) {
            await loadProducts(configId);
        }
        setPreviewApiId(previewApiId === configId ? null : configId);
    };

    const handleRunSmartAuto = async () => {
        if (selectedApiIds.length === 0) {
            alert('Vui lòng chọn ít nhất một API để chạy');
            return;
        }

        setAutoRunning(true);
        setAutoResults(null);

        try {
            const payload = {
                enabled_api_ids: selectedApiIds,
                check_interval_minutes: 5,
                interval_seconds: schedulerMode ? parseInt(intervalSeconds) : undefined,
                is_miniapp: true
            };

            if (schedulerMode) {
                const response = await startSmartAutoScheduled(payload);
                setAutoResults(response);
                await loadJobs(); // Refresh để hiển thị job mới
                alert(`Smart Auto đã được lên lịch! Job ID: ${response.job_id}`);
            } else {
                const response = await runSmartAutoOnce(payload);
                setAutoResults(response);

                if (response.status === 'completed') {
                    alert('Smart Auto đã hoàn thành! Kiểm tra kết quả bên dưới.');
                } else {
                    alert(`Smart Auto: ${response.message}`);
                }
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi chạy Smart Auto';
            alert(errorMessage);
            setAutoResults({
                status: 'error',
                message: errorMessage
            });
        } finally {
            setAutoRunning(false);
        }
    };

    const handleStopSmartAutoJob = async (jobId: string) => {
        try {
            await stopSmartAutoJob(jobId);
            alert('Smart Auto job đã được dừng');
            await loadJobs();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi khi dừng Smart Auto job';
            alert(errorMessage);
            console.error('Error stopping Smart Auto job:', err);
        }
    };

    const handleApiSelection = (apiId: number, checked: boolean) => {
        if (checked) {
            setSelectedApiIds(prev => [...prev, apiId]);
            const config = apiConfigsList.find(c => c.id === apiId);
            if (config && config.version === 'version_2') {
                loadProducts(apiId);
            }
        } else {
            setSelectedApiIds(prev => prev.filter(id => id !== apiId));
        }
    };

    return (
        <Page>
            <List>
                <Section header="Smart Auto - Mua Clone Thông Minh">
                    <Cell className={e('description')}>
                        <Text>
                            Hệ thống tự động kiểm tra tài nguyên, lọc sản phẩm theo điều kiện và chọn sản phẩm tốt nhất để mua.
                        </Text>
                    </Cell>
                </Section>

                <Section header="1. Chọn APIs để chạy">
                    {apiConfigsList.map((config) => (
                        <Cell key={config.id} className={e('api-item')}>
                            <div className={e('api-content')}>
                                <div className={e('api-info')}>
                                    <Checkbox
                                        checked={selectedApiIds.includes(config.id)}
                                        onChange={(e) => handleApiSelection(config.id, e.target.checked)}
                                    />
                                    <div className={e('api-details')}>
                                        <Text className={e('api-name')}>{config.name}</Text>
                                        <Text className={e('api-version')}>
                                            {config.version === 'version_1' ? 'V1' : 'V2'} - {config.domain}
                                        </Text>
                                    </div>
                                </div>
                                <Button
                                    mode="outline"
                                    size="s"
                                    onClick={() => handlePreviewProducts(config.id)}
                                    disabled={loadingProducts[config.id]}
                                    className={e('preview-btn')}
                                >
                                    {loadingProducts[config.id] ? 'Loading...' : 'Xem SP'}
                                </Button>
                            </div>

                            {availableProducts[config.id] && (
                                <div className={e('product-stats')}>
                                    <Text className={e('stats-text')}>
                                        📦 {availableProducts[config.id].length} sản phẩm,
                                        {availableProducts[config.id].filter(p => p.amount > 0).length} còn hàng
                                    </Text>
                                </div>
                            )}
                        </Cell>
                    ))}
                </Section>

                {/* Product Preview Section */}
                {previewApiId && availableProducts[previewApiId] && (
                    <Section header={`📦 Preview: ${apiConfigsList.find(c => c.id === previewApiId)?.name}`}>
                        <Cell className={e('preview-section')}>
                            <div className={e('preview-content')}>
                                {/* Summary Stats */}
                                <div className={e('summary-stats')}>
                                    <Text className={e('summary-text')}>
                                        <strong>Tổng quan:</strong> {availableProducts[previewApiId].length} sản phẩm, {availableProducts[previewApiId].filter(p => p.amount > 0).length} còn hàng
                                    </Text>
                                    <Text className={e('summary-text')}>
                                        <strong>Bộ lọc của API:</strong>
                                        {(() => {
                                            const config = apiConfigsList.find(c => c.id === previewApiId);
                                            if (!config) return ' Không có thông tin';

                                            let filterText = '';
                                            if (config.price_range_min || config.price_range_max) {
                                                filterText += ` Giá ${config.price_range_min || 0}-${config.price_range_max || '∞'}đ`;
                                            } else {
                                                filterText += ' Không giới hạn giá';
                                            }

                                            if (config.excluded_category_ids) {
                                                filterText += `, Loại trừ categories: ${config.excluded_category_ids}`;
                                            } else {
                                                filterText += ', Không loại trừ category nào';
                                            }

                                            return filterText;
                                        })()}
                                    </Text>
                                </div>

                                {/* Products List */}
                                <div className={e('products-list')}>
                                    <Text className={e('products-title')}>Danh sách sản phẩm:</Text>
                                    {availableProducts[previewApiId].map((product) => {
                                        const config = apiConfigsList.find(c => c.id === previewApiId);
                                        const isOutOfStock = product.amount <= 0;
                                        const isPriceFiltered = config && (
                                            (config.price_range_min && product.price < config.price_range_min) ||
                                            (config.price_range_max && product.price > config.price_range_max)
                                        );
                                        const isCategoryExcluded = config?.excluded_category_ids &&
                                            config.excluded_category_ids.split(',').map(s => s.trim()).includes(product.category_id);

                                        return (
                                            <div key={product.id} className={e('product-item')}>
                                                <div className={e('product-header')}>
                                                    <Text className={e('product-id')}>ID: {product.id}</Text>
                                                    <Text className={e('product-price')}>
                                                        {product.price}đ
                                                    </Text>
                                                </div>
                                                <Text className={e('product-name')}>
                                                    {product.name.substring(0, 60)}...
                                                </Text>
                                                <div className={e('product-details')}>
                                                    <Text className={e('product-category')}>
                                                        Category: {product.category_id} - {product.category_name}
                                                    </Text>
                                                    <Text className={e('product-stock')}>
                                                        Còn hàng: {product.amount}
                                                    </Text>
                                                </div>
                                                <div className={e('product-status')}>
                                                    {isOutOfStock ? (
                                                        <span className={e('status-badge', 'out-of-stock')}>Hết hàng</span>
                                                    ) : isPriceFiltered ? (
                                                        <span className={e('status-badge', 'price-filtered')}>Giá không phù hợp</span>
                                                    ) : isCategoryExcluded ? (
                                                        <span className={e('status-badge', 'category-excluded')}>Category bị loại trừ</span>
                                                    ) : (
                                                        <span className={e('status-badge', 'available')}>✓ Phù hợp</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Cell>
                    </Section>
                )}

                <Section header="2. Cấu hình chạy">
                    <Cell className={e('config-section')}>
                        <div className={e('info-box')}>
                            <Text>
                                📝 Bộ lọc riêng biệt: Mỗi API đã có bộ lọc riêng (giá, categories) được cấu hình trong phần "API Configs".
                                Smart Auto sẽ sử dụng bộ lọc riêng của từng API để tìm sản phẩm phù hợp.
                            </Text>
                        </div>
                    </Cell>

                    <Cell className={e('config-section')}>
                        <div className={e('scheduler-config')}>
                            <Checkbox
                                checked={schedulerMode}
                                onChange={(e) => setSchedulerMode(e.target.checked)}
                            />
                            <Text>Chế độ lên lịch tự động</Text>
                        </div>
                    </Cell>

                    {schedulerMode && (
                        <Cell className={e('config-section')}>
                            <div className={e('interval-config')}>
                                <Text className={e('config-label')}>Khoảng thời gian (giây)</Text>
                                <Input
                                    value={intervalSeconds}
                                    onChange={(e) => setIntervalSeconds(e.target.value)}
                                    placeholder="300"
                                    type="number"
                                    min="60"
                                />
                                <Text className={e('config-help')}>
                                    Tối thiểu 60 giây (khuyến nghị: 300s = 5 phút)
                                </Text>
                            </div>
                        </Cell>
                    )}

                    <Cell className={e('action-section')}>
                        <Button
                            mode="filled"
                            size="l"
                            onClick={handleRunSmartAuto}
                            disabled={autoRunning || selectedApiIds.length === 0}
                            className={e('run-btn')}
                        >
                            {autoRunning ? 'Đang xử lý...' :
                                schedulerMode ? 'Lên lịch Smart Auto' : 'Chạy Smart Auto ngay'}
                        </Button>
                    </Cell>
                </Section>

                {smartAutoJobs.length > 0 && (
                    <Section header="📅 Smart Auto Jobs đang chạy">
                        {smartAutoJobs.map((job) => (
                            <Cell key={job.id} className={e('job-item')}>
                                <div className={e('job-content')}>
                                    <div className={e('job-info')}>
                                        <Text className={e('job-id')}>{job.id}</Text>
                                        <Text className={e('job-next')}>
                                            Next run: {job.next_run ? new Date(job.next_run).toLocaleString('vi-VN') : 'N/A'}
                                        </Text>
                                    </div>
                                    <Button
                                        mode="outline"
                                        size="s"
                                        onClick={() => handleStopSmartAutoJob(job.id)}
                                        className={e('stop-btn')}
                                    >
                                        Dừng
                                    </Button>
                                </div>
                            </Cell>
                        ))}
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
                    </Section>
                )}

                {autoResults && (
                    <Section header="Kết quả Smart Auto">
                        <Cell className={e('results-section')}>
                            <div className={e('result-box', autoResults.status)}>
                                <Text>{autoResults.message}</Text>
                                {autoResults.job_id && (
                                    <Text className={e('job-id-text')}>
                                        Job ID: {autoResults.job_id}
                                    </Text>
                                )}
                            </div>
                        </Cell>
                    </Section>
                )}
            </List>
        </Page>
    );
};
