import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    Chip,
    Typography,
    IconButton,
    Tooltip
} from '@mui/material';
import { Modal, Input, Switch, Button as TGButton, Text, Title, Section, Cell, List } from '@telegram-apps/telegram-ui';
import { useState } from 'react';
import type { FC } from 'react';

import { Page } from '@/components/Page.tsx';
import { bem } from '@/css/bem.ts';

import './ApiConfigPage.css';

const [b, e] = bem('api-config-page');

interface ApiConfig {
    id: number;
    name: string;
    version: 'version_1' | 'version_2';
    domain: string;
    endpoint?: string;
    username?: string;
    password?: string;
    api_key?: string;
    coupon?: string;
    product_id: string;
    amount: number;
    chat_id?: string;
    price_range_min?: number;
    price_range_max?: number;
    excluded_category_ids?: string;
    enabled: boolean;
}

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
    const [apiConfigsList, setApiConfigsList] = useState<ApiConfig[]>([
        {
            id: 1,
            name: 'Facebook Clone API',
            version: 'version_1',
            domain: 'facebook.com',
            endpoint: '/api/BResource.php',
            username: 'user123',
            password: 'pass123',
            product_id: 'fb_clone_001',
            amount: 1000,
            chat_id: '-1001234567890',
            price_range_min: 10,
            price_range_max: 100,
            excluded_category_ids: '1,2,3',
            enabled: true
        },
        {
            id: 2,
            name: 'Coin Master API',
            version: 'version_2',
            domain: 'coinmaster.com',
            endpoint: '/api/v2/orders',
            api_key: 'cm_api_key_123',
            coupon: 'WELCOME10',
            product_id: 'cm_api_002',
            amount: 500,
            price_range_min: 5,
            price_range_max: 50,
            enabled: true
        },
        {
            id: 3,
            name: 'Xún Order API',
            version: 'version_1',
            domain: 'xun.com',
            endpoint: '/api/orders',
            username: 'xun_user',
            password: 'xun_pass',
            product_id: 'xun_order_003',
            amount: 2000,
            excluded_category_ids: '5,6',
            enabled: false
        },
        {
            id: 4,
            name: 'TikTok Clone API',
            version: 'version_2',
            domain: 'tiktok.com',
            endpoint: '/api/tiktok/orders',
            api_key: 'tt_api_key_456',
            product_id: 'tt_clone_004',
            amount: 800,
            price_range_min: 1,
            price_range_max: 200,
            enabled: true
        },
        {
            id: 5,
            name: 'Instagram API',
            version: 'version_1',
            domain: 'instagram.com',
            endpoint: '/api/ig/orders',
            username: 'ig_user',
            password: 'ig_pass',
            product_id: 'ig_api_005',
            amount: 1500,
            enabled: true
        }
    ]);

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

    const handleSubmit = () => {
        if (!formData.name || !formData.domain || !formData.product_id) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        const newConfig: Omit<ApiConfig, 'id'> = {
            name: formData.name,
            version: formData.version,
            domain: formData.domain,
            endpoint: formData.endpoint || undefined,
            username: formData.username || undefined,
            password: formData.password || undefined,
            api_key: formData.api_key || undefined,
            coupon: formData.coupon || undefined,
            product_id: formData.product_id,
            amount: formData.amount,
            chat_id: formData.chat_id || undefined,
            price_range_min: formData.price_range_min ? parseInt(formData.price_range_min) : undefined,
            price_range_max: formData.price_range_max ? parseInt(formData.price_range_max) : undefined,
            excluded_category_ids: formData.excluded_category_ids || undefined,
            enabled: formData.enabled
        };

        if (isEditing && editingId) {
            setApiConfigsList(prev => prev.map(config =>
                config.id === editingId
                    ? { ...newConfig, id: editingId }
                    : config
            ));
        } else {
            const newId = Math.max(...apiConfigsList.map(c => c.id)) + 1;
            setApiConfigsList(prev => [...prev, { ...newConfig, id: newId }]);
        }

        setIsModalOpen(false);
        resetForm();
    };

    const handleEditConfig = (config: ApiConfig) => {
        openEditModal(config);
    };

    const handleTestPurchase = (configId: number) => {
        console.log('Test purchase for config:', configId);
        alert(`Test mua hàng cho config ID: ${configId}`);
    };

    const handleDeleteConfig = (configId: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa cấu hình này?')) {
            setApiConfigsList(prev => prev.filter(config => config.id !== configId));
        }
    };

    const handleToggleStatus = (configId: number) => {
        setApiConfigsList(prev => prev.map(config =>
            config.id === configId
                ? { ...config, enabled: !config.enabled }
                : config
        ));
    };

    const getVersionText = (version: string) => {
        return version === 'version_1' ? 'V1 (User/Pass)' : 'V2 (API Key)';
    };

    const getStatusColor = (enabled: boolean) => {
        return enabled ? 'success' : 'error';
    };

    const getStatusText = (enabled: boolean) => {
        return enabled ? 'Hoạt động' : 'Tắt';
    };

    return (
        <Page>
            <div className={e('header')}>
                <Typography variant="h5" component="h1" className={e('title')}>
                    Quản lý Cấu hình API
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    className={e('add-button')}
                    onClick={openCreateModal}
                >
                    + Thêm Cấu hình
                </Button>
            </div>

            <div className={e('table-container')}>
                <TableContainer component={Paper} className={e('table')}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên</TableCell>
                                <TableCell>Version</TableCell>
                                <TableCell>Domain</TableCell>
                                <TableCell>Product ID</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Bộ lọc</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {apiConfigsList.length > 0 ? (
                                apiConfigsList.map((config) => (
                                    <TableRow key={config.id}>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">
                                                {config.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getVersionText(config.version)}
                                                size="small"
                                                variant="outlined"
                                                color={config.version === 'version_1' ? 'primary' : 'secondary'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="textSecondary">
                                                {config.domain}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontFamily="monospace">
                                                {config.product_id}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">
                                                {config.amount.toLocaleString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ fontSize: '0.75rem' }}>
                                                {config.price_range_min || config.price_range_max ? (
                                                    <Chip
                                                        label={`💰 ${config.price_range_min || 0}-${config.price_range_max || '∞'}`}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ mr: 0.5, mb: 0.5 }}
                                                    />
                                                ) : null}
                                                {config.excluded_category_ids ? (
                                                    <Chip
                                                        label={`🚫 Loại trừ: ${config.excluded_category_ids}`}
                                                        size="small"
                                                        color="warning"
                                                        variant="outlined"
                                                        sx={{ mr: 0.5, mb: 0.5 }}
                                                    />
                                                ) : null}
                                                {!config.price_range_min && !config.price_range_max && !config.excluded_category_ids ? (
                                                    <Typography variant="caption" color="textSecondary">
                                                        Không có bộ lọc
                                                    </Typography>
                                                ) : null}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getStatusText(config.enabled)}
                                                color={getStatusColor(config.enabled)}
                                                size="small"
                                                variant="filled"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                <Tooltip title="Sửa cấu hình">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleEditConfig(config)}
                                                    >
                                                        ✏️
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Test mua hàng">
                                                    <IconButton
                                                        size="small"
                                                        color="success"
                                                        onClick={() => handleTestPurchase(config.id)}
                                                    >
                                                        🧪
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Bật/Tắt">
                                                    <IconButton
                                                        size="small"
                                                        color={config.enabled ? 'warning' : 'success'}
                                                        onClick={() => handleToggleStatus(config.id)}
                                                    >
                                                        {config.enabled ? '⏸️' : '▶️'}
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Xóa cấu hình">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDeleteConfig(config.id)}
                                                    >
                                                        🗑️
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        <Typography variant="body2" color="textSecondary">
                                            Chưa có cấu hình API nào. Hãy tạo cấu hình mới.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

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
                        <TGButton
                            mode="filled"
                            onClick={handleSubmit}
                            disabled={!formData.name || !formData.domain || !formData.product_id}
                        >
                            {isEditing ? 'Cập nhật' : 'Tạo'}
                        </TGButton>
                        <TGButton
                            mode="outline"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Hủy
                        </TGButton>
                    </div>
                </div>
            </Modal>
        </Page>
    );
};
