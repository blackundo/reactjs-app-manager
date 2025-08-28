import { Section, Cell, List } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { Link } from '@/components/Link/Link.tsx';
import { Page } from '@/components/Page.tsx';


export const ManagementPage: FC = () => {
    return (
        <Page back={false}>
            <List>
                {/* <Section header="Features">
                    <Link to="/ton-connect">
                        <Cell
                            before={<Image src={tonSvg} />}
                            subtitle="Connect your TON wallet"
                        >
                            TON Connect
                        </Cell>
                    </Link>
                </Section> */}
                <Section header="Quản lý tài khoản">
                    <Link to="/account">
                        <Cell subtitle="Tài khoản đã chạy">Account</Cell>
                    </Link>
                    <Link to="/upload">
                        <Cell subtitle="Upload file txt/xml">Upload Files</Cell>
                    </Link>
                </Section>
                <Section header="Quản lý API">
                    <Link to="/admin">
                        <Cell subtitle="Quản lý danh sách admin">Admin</Cell>
                    </Link>
                    <Link to="/api-config">
                        <Cell subtitle="Quản lý cấu hình API">API Config</Cell>
                    </Link>
                    <Link to="/auto">
                        <Cell subtitle="Quản lý auto jobs">Auto Jobs</Cell>
                    </Link>
                    <Link to="/smart-auto">
                        <Cell subtitle="Smart Auto - Mua clone thông minh">Smart Auto</Cell>
                    </Link>
                </Section>
                <Section header="Lịch sử">
                    <Link to="/runs">
                        <Cell subtitle="Xem lịch sử runs">Run History</Cell>
                    </Link>
                </Section>
                <Section header="Development">
                    <Link to="/debug">
                        <Cell subtitle="Debug init data và authentication">🔍 Debug Page</Cell>
                    </Link>
                    <Link to="/init-data">
                        <Cell subtitle="Telegram init data details">Init Data</Cell>
                    </Link>
                    <Link to="/theme-params">
                        <Cell subtitle="Telegram theme parameters">Theme Params</Cell>
                    </Link>
                </Section>
            </List>
        </Page>
    );
};
