import { Section, Cell, List, Button, Input, Text, Badge } from '@telegram-apps/telegram-ui';
import { useEffect, useMemo, useState } from 'react';
import type { FC, ChangeEvent } from 'react';

import { Page } from '@/components/Page.tsx';
import { fetchAdmins, addAdmin, deactivateAdmin, activateAdmin, type Admin } from '@/services/adminService';

// Simple inline styles to avoid unused BEM helper warning

export const AdminPage: FC = () => {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');

    // Form state
    const [form, setForm] = useState<{ telegram_id: string; username: string; first_name: string; last_name: string }>({
        telegram_id: '',
        username: '',
        first_name: '',
        last_name: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadAdmins();
    }, []);

    const loadAdmins = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchAdmins();
            setAdmins(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể tải danh sách admin');
        } finally {
            setLoading(false);
        }
    };

    const filtered = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return admins;
        return admins.filter(a => (
            a.telegram_id.includes(q) ||
            (a.username || '').toLowerCase().includes(q) ||
            (a.first_name || '').toLowerCase().includes(q) ||
            (a.last_name || '').toLowerCase().includes(q)
        ));
    }, [admins, searchQuery]);

    const handleChange = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [key]: e.target.value }));
    };

    const handleAdd = async () => {
        if (!form.telegram_id.trim()) {
            alert('Vui lòng nhập Telegram ID');
            return;
        }
        try {
            setSubmitting(true);
            await addAdmin({
                telegram_id: form.telegram_id.trim(),
                username: form.username.trim() || undefined,
                first_name: form.first_name.trim() || undefined,
                last_name: form.last_name.trim() || undefined,
            });
            setForm({ telegram_id: '', username: '', first_name: '', last_name: '' });
            await loadAdmins();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Không thể thêm admin');
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleActive = async (a: Admin) => {
        try {
            if (a.is_active) {
                await deactivateAdmin(a.telegram_id);
            } else {
                await activateAdmin(a.telegram_id);
            }
            await loadAdmins();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Không thể cập nhật trạng thái');
        }
    };

    if (loading) {
        return (
            <Page>
                <List>
                    <Section header="Quản lý Admin">
                        <Cell>
                            <Text>Đang tải...</Text>
                        </Cell>
                    </Section>
                </List>
            </Page>
        );
    }

    if (error) {
        return (
            <Page>
                <List>
                    <Section header="Quản lý Admin">
                        <Cell>
                            <Text style={{ color: 'red' }}>{error}</Text>
                        </Cell>
                    </Section>
                </List>
            </Page>
        );
    }

    return (
        <Page>
            <List>
                <Section header="Thêm admin">
                    <Cell>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr auto', gap: 8, width: '100%' }}>
                            <Input placeholder="Telegram ID *" value={form.telegram_id} onChange={handleChange('telegram_id')} />
                            <Input placeholder="Username" value={form.username} onChange={handleChange('username')} />
                            <Input placeholder="First name" value={form.first_name} onChange={handleChange('first_name')} />
                            <Input placeholder="Last name" value={form.last_name} onChange={handleChange('last_name')} />
                            <Button mode="filled" disabled={submitting} onClick={handleAdd}>Thêm</Button>
                        </div>
                    </Cell>
                </Section>

                <Section header="Tìm kiếm">
                    <Cell>
                        <Input placeholder="Tìm theo ID, username, tên..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </Cell>
                </Section>

                <Section header={`Danh sách Admin (${filtered.length})`}>
                    {filtered.length === 0 && (
                        <Cell>
                            <Text>Không có admin nào</Text>
                        </Cell>
                    )}
                    {filtered.map((a) => (
                        <Cell
                            key={a.telegram_id}
                            subtitle={a.username ? `@${a.username}` : undefined}
                            after={
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <Badge type="dot" mode={a.is_active ? 'primary' : 'critical'}>{a.is_active ? 'Active' : 'Inactive'}</Badge>
                                    <Button size="s" mode="outline" onClick={() => handleToggleActive(a)}>
                                        {a.is_active ? 'Vô hiệu' : 'Kích hoạt'}
                                    </Button>
                                </div>
                            }
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Text weight="2">{a.first_name || a.last_name ? `${a.first_name || ''} ${a.last_name || ''}`.trim() : `ID: ${a.telegram_id}`}</Text>
                                {!a.username && <Text style={{ fontSize: 12, opacity: 0.7 }}>ID: {a.telegram_id}</Text>}
                            </div>
                        </Cell>
                    ))}
                </Section>
            </List>
        </Page>
    );
};


