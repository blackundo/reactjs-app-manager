import { Modal, Input, Switch, Button, Text, Title, Section, Cell, List } from '@telegram-apps/telegram-ui';
import { useState, useEffect } from 'react';
import type { FC } from 'react';

import { Page } from '@/components/Page.tsx';
import { bem } from '@/css/bem.ts';
import {
    fetchApiConfigsList,
    createApiConfig,
    updateApiConfig,
    deleteApiConfig,
    testPurchase,
    type ApiConfig
} from '@/services/apiConfigService';

import './ApiConfigPage.css';

const [, e] = bem('api-config-page');

interface FormData {
    name: string;
    version: 'version_1' | 'version_2';
    domain: string;
    endpoint: string;
    username: string;
    password: string;
    api_key: string;
    coupon: string;
    product_id: string;
    amount: number;
    chat_id: string;
    price_range_min: string;
    price_range_max: string;
    excluded_category_ids: string;
    enabled: boolean;
}

export const ApiConfigPage: FC = () => {
    const [apiConfigsList, setApiConfigsList] = useState<ApiConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        version: 'version_1',
        domain: '',
        endpoint: '',
        username: '',
        password: '',
        api_key: '',
        coupon: '',
        product_id: '',
        amount: 1,
        chat_id: '',
        price_range_min: '',
        price_range_max: '',
        excluded_category_ids: '',
        enabled: true
    });

    // Load API configs on component mount
    useEffect(() => {
        loadApiConfigs();
    }, []);

    const loadApiConfigs = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchApiConfigsList();
            setApiConfigsList(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
            console.error('Error loading API configs:', err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            version: 'version_1',
            domain: '',
            endpoint: '',
            username: '',
            password: '',
            api_key: '',
            coupon: '',
            product_id: '',
            amount: 1,
            chat_id: '',
            price_range_min: '',
            price_range_max: '',
            excluded_category_ids: '',
            enabled: true
        });
        setIsEditing(false);
        setEditingId(null);
    };

    const openCreateModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (config: ApiConfig) => {
        setFormData({
            name: config.name,
            version: config.version,
            domain: config.domain,
            endpoint: config.endpoint || '',
            username: config.username || '',
            password: config.password || '',
            api_key: config.api_key || '',
            coupon: config.coupon || '',
            product_id: config.product_id,
            amount: config.amount,
            chat_id: config.chat_id || '',
            price_range_min: config.price_range_min?.toString() || '',
            price_range_max: config.price_range_max?.toString() || '',
            excluded_category_ids: config.excluded_category_ids || '',
            enabled: config.enabled
        });
        setIsEditing(true);
        setEditingId(config.id);
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.domain || !formData.product_id) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        if (formData.version === 'version_1') {
            if (!formData.username || !formData.password) {
                alert('Version 1 cần username và password');
                return;
            }
        } else if (formData.version === 'version_2') {
            if (!formData.api_key) {
                alert('Version 2 cần API key');
                return;
            }
        }

        try {
            if (isEditing && editingId) {
                await updateApiConfig({ ...formData, id: editingId });
                alert('Đã cập nhật cấu hình API thành công');
            } else {
                await createApiConfig(formData);
                alert('Đã tạo cấu hình API thành công');
            }

            await loadApiConfigs(); // Refresh data
            setIsModalOpen(false);
            resetForm();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
            alert(errorMessage);
            console.error('Error saving API config:', err);
        }
    };

    const handleEditConfig = (config: ApiConfig) => {
        openEditModal(config);
    };

    const handleTestPurchase = async (configId: number) => {
        if (!confirm('Bạn có muốn test mua với cấu hình này?')) return;

        try {
            const response = await testPurchase({
                api_config_id: configId,
                custom_amount: 1
            });
            alert(`Kết quả: ${response.message}\nSố lần thành công: ${response.success_count}`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi test mua';
            alert(errorMessage);
            console.error('Error testing purchase:', err);
        }
    };

    const handleDeleteConfig = async (configId: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa cấu hình này?')) return;

        try {
            await deleteApiConfig(configId);
            alert('Đã xóa cấu hình API thành công');
            await loadApiConfigs(); // Refresh data
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa';
            alert(errorMessage);
            console.error('Error deleting API config:', err);
        }
    };

    const handleToggleStatus = async (configId: number) => {
        try {
            const config = apiConfigsList.find(c => c.id === configId);
            if (!config) return;

            const updatedConfig = { ...config, enabled: !config.enabled };
            await updateApiConfig({
                ...updatedConfig,
                product_id: updatedConfig.product_id.toString(),
                price_range_min: updatedConfig.price_range_min?.toString() || '',
                price_range_max: updatedConfig.price_range_max?.toString() || '',
                excluded_category_ids: updatedConfig.excluded_category_ids || '',
                username: updatedConfig.username || '',
                password: updatedConfig.password || '',
                api_key: updatedConfig.api_key || '',
                coupon: updatedConfig.coupon || '',
                endpoint: updatedConfig.endpoint || '',
                chat_id: updatedConfig.chat_id || ''
            });

            await loadApiConfigs(); // Refresh data
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật trạng thái';
            alert(errorMessage);
            console.error('Error toggling status:', err);
        }
    };

    const getVersionText = (version: string) => {
        return version === 'version_1' ? 'V1 (User/Pass)' : 'V2 (API Key)';
    };

    // const getStatusColor = (enabled: boolean) => {
    //     return enabled ? 'success' : 'error';
    // };

    const getStatusText = (enabled: boolean) => {
        return enabled ? 'Hoạt động' : 'Tắt';
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
                    <Button mode="outline" onClick={loadApiConfigs} className={e('retry-btn')}>
                        Thử lại
                    </Button>
                </div>
            </Page>
        );
    }

    return (
        <Page>
            <div className={e('header')}>
                <Title level="2" className={e('title')}>
                    Quản lý Cấu hình API
                </Title>
                <Button
                    mode="filled"
                    size="m"
                    className={e('add-button')}
                    onClick={openCreateModal}
                >
                    + Thêm Cấu hình
                </Button>
            </div>

            <List>
                {apiConfigsList.length > 0 ? (
                    apiConfigsList.map((config) => (
                        <Section key={config.id} header={config.name}>
                            <Cell className={e('config-item')}>
                                <div className={e('config-content')}>
                                    <div className={e('config-info')}>
                                        <div className={e('config-row')}>
                                            <Text className={e('config-label')}>Version:</Text>
                                            <Text className={e('config-value')}>
                                                {getVersionText(config.version)}
                                            </Text>
                                        </div>
                                        <div className={e('config-row')}>
                                            <Text className={e('config-label')}>Domain:</Text>
                                            <Text className={e('config-value')}>{config.domain}</Text>
                                        </div>
                                        <div className={e('config-row')}>
                                            <Text className={e('config-label')}>Product ID:</Text>
                                            <Text className={e('config-value')}>{config.product_id}</Text>
                                        </div>
                                        <div className={e('config-row')}>
                                            <Text className={e('config-label')}>Amount:</Text>
                                            <Text className={e('config-value')}>{config.amount.toLocaleString()}</Text>
                                        </div>

                                        {/* Filter info */}
                                        {(config.price_range_min || config.price_range_max || config.excluded_category_ids) && (
                                            <div className={e('filter-info')}>
                                                <Text className={e('filter-title')}>Bộ lọc:</Text>
                                                {config.price_range_min || config.price_range_max ? (
                                                    <Text className={e('filter-item')}>
                                                        💰 Giá: {config.price_range_min || 0}-{config.price_range_max || '∞'}
                                                    </Text>
                                                ) : null}
                                                {config.excluded_category_ids ? (
                                                    <Text className={e('filter-item')}>
                                                        🚫 Loại trừ: {config.excluded_category_ids}
                                                    </Text>
                                                ) : null}
                                            </div>
                                        )}
                                    </div>

                                    <div className={e('config-actions')}>
                                        <div className={e('status-indicator')}>
                                            <span
                                                className={e('status-dot', config.enabled ? 'enabled' : 'disabled')}
                                            />
                                            <Text className={e('status-text')}>
                                                {getStatusText(config.enabled)}
                                            </Text>
                                        </div>

                                        <div className={e('action-buttons')}>
                                            <Button
                                                size="s"
                                                mode="outline"
                                                onClick={() => handleEditConfig(config)}
                                                className={e('edit-btn')}
                                            >
                                                ✏️ Sửa
                                            </Button>
                                            <Button
                                                size="s"
                                                mode="outline"
                                                onClick={() => handleTestPurchase(config.id)}
                                                className={e('test-btn')}
                                            >
                                                🧪 Test
                                            </Button>
                                            <Button
                                                size="s"
                                                mode="outline"
                                                onClick={() => handleToggleStatus(config.id)}
                                                className={e('toggle-btn')}
                                            >
                                                {config.enabled ? '⏸️ Tắt' : '▶️ Bật'}
                                            </Button>
                                            <Button
                                                size="s"
                                                mode="outline"
                                                onClick={() => handleDeleteConfig(config.id)}
                                                className={e('delete-btn')}
                                            >
                                                🗑️ Xóa
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Cell>
                        </Section>
                    ))
                ) : (
                    <Section header="Danh sách cấu hình">
                        <Cell className={e('no-configs')}>
                            <Text>Chưa có cấu hình API nào. Hãy tạo cấu hình mới.</Text>
                        </Cell>
                    </Section>
                )}
            </List>

            {/* Telegram UI Modal */}
            <Modal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                // snapPoints={[0.1, 0.9]}
                dismissible={true}
                modal={true}
            >
                <div className={e('modal-content')}>
                    <Title level="2" className={e('modal-title')}>
                        {isEditing ? 'Chỉnh sửa cấu hình' : 'Tạo cấu hình mới'}
                    </Title>

                    <List>
                        <Section header="Thông tin cơ bản">
                            <Cell>
                                <Text weight="2">Tên cấu hình *</Text>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="VD: Facebook Clone API"
                                />
                            </Cell>

                            <Cell>
                                <Text weight="2">Version API *</Text>
                                <select
                                    value={formData.version}
                                    onChange={(e) => setFormData({ ...formData, version: e.target.value as 'version_1' | 'version_2' })}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--tg-theme-hint-color)',
                                        background: 'var(--tg-theme-bg-color)',
                                        color: 'var(--tg-theme-text-color)'
                                    }}
                                >
                                    <option value="version_1">Version 1 (Domain/Username/Password)</option>
                                    <option value="version_2">Version 2 (API Key)</option>
                                </select>
                            </Cell>

                            <Cell>
                                <Text weight="2">Domain *</Text>
                                <Input
                                    value={formData.domain}
                                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                    placeholder="VD: clone24h.com"
                                />
                            </Cell>

                            <Cell>
                                <Text weight="2">Endpoint</Text>
                                <Input
                                    value={formData.endpoint}
                                    onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                                    placeholder="VD: /api/BResource.php"
                                />
                            </Cell>
                        </Section>

                        {formData.version === 'version_1' && (
                            <Section header="Thông tin đăng nhập (Version 1)">
                                <Cell>
                                    <Text weight="2">Username</Text>
                                    <Input
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        placeholder="Tên đăng nhập"
                                    />
                                </Cell>

                                <Cell>
                                    <Text weight="2">Password</Text>
                                    <Input
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Mật khẩu"
                                        type="password"
                                    />
                                </Cell>
                            </Section>
                        )}

                        {formData.version === 'version_2' && (
                            <Section header="Thông tin API (Version 2)">
                                <Cell>
                                    <Text weight="2">API Key</Text>
                                    <Input
                                        value={formData.api_key}
                                        onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                                        placeholder="API Key"
                                    />
                                </Cell>

                                <Cell>
                                    <Text weight="2">Coupon (tùy chọn)</Text>
                                    <Input
                                        value={formData.coupon}
                                        onChange={(e) => setFormData({ ...formData, coupon: e.target.value })}
                                        placeholder="Mã giảm giá"
                                    />
                                </Cell>
                            </Section>
                        )}

                        <Section header="Cấu hình sản phẩm">
                            <Cell>
                                <Text weight="2">Product ID *</Text>
                                <Input
                                    value={formData.product_id}
                                    onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                                    placeholder="VD: fb_clone_001"
                                />
                            </Cell>

                            <Cell>
                                <Text weight="2">Amount</Text>
                                <Input
                                    value={formData.amount.toString()}
                                    onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 1 })}
                                    type="number"
                                    placeholder="1"
                                />
                            </Cell>

                            <Cell>
                                <Text weight="2">Chat ID Telegram</Text>
                                <Input
                                    value={formData.chat_id}
                                    onChange={(e) => setFormData({ ...formData, chat_id: e.target.value })}
                                    placeholder="VD: -1001234567890"
                                />
                            </Cell>
                        </Section>

                        <Section header="🎯 Bộ lọc riêng cho API này">
                            <Cell>
                                <Text weight="2">Giá tối thiểu</Text>
                                <Input
                                    value={formData.price_range_min}
                                    onChange={(e) => setFormData({ ...formData, price_range_min: e.target.value })}
                                    type="number"
                                    placeholder="VD: 200"
                                />
                                <Text size={1} color="secondary">Để trống = không giới hạn</Text>
                            </Cell>

                            <Cell>
                                <Text weight="2">Giá tối đa</Text>
                                <Input
                                    value={formData.price_range_max}
                                    onChange={(e) => setFormData({ ...formData, price_range_max: e.target.value })}
                                    type="number"
                                    placeholder="VD: 800"
                                />
                                <Text size={1} color="secondary">Để trống = không giới hạn</Text>
                            </Cell>

                            <Cell>
                                <Text weight="2">Loại trừ Categories (ID)</Text>
                                <Input
                                    value={formData.excluded_category_ids}
                                    onChange={(e) => setFormData({ ...formData, excluded_category_ids: e.target.value })}
                                    placeholder="VD: 2,3,5"
                                />
                                <Text size={1} color="secondary">Các category ID cách nhau bằng dấu phẩy</Text>
                            </Cell>
                        </Section>

                        <Section header="Trạng thái">
                            <Cell>
                                <Text weight="2">Kích hoạt cấu hình</Text>
                                <Switch
                                    checked={formData.enabled}
                                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                                />
                            </Cell>
                        </Section>
                    </List>

                    <div className={e('modal-actions')}>
                        <Button
                            mode="filled"
                            onClick={handleSubmit}
                            disabled={!formData.name || !formData.domain || !formData.product_id}
                        >
                            {isEditing ? 'Cập nhật' : 'Tạo'}
                        </Button>
                        <Button
                            mode="outline"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Hủy
                        </Button>
                    </div>
                </div>
            </Modal>
        </Page>
    );
};
