import { Section, Cell, List, Image } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { Link } from '@/components/Link/Link.tsx';
import { Page } from '@/components/Page.tsx';

import tonSvg from '../IndexPage/ton.svg';

export const ManagementPage: FC = () => {
    return (
        <Page back={false}>
            <List>
                <Section header="Features">
                    <Link to="/ton-connect">
                        <Cell
                            before={<Image src={tonSvg} />}
                            subtitle="Connect your TON wallet"
                        >
                            TON Connect
                        </Cell>
                    </Link>
                </Section>
                <Section header="Application Launch Data">
                    <Link to="/account">
                        <Cell subtitle="Tài khoản đã chạy">Account</Cell>
                    </Link>
                    <Link to="/api-config">
                        <Cell subtitle="Quản lý cấu hình API">API Config</Cell>
                    </Link>
                    <Link to="/launch-params">
                        <Cell subtitle="Platform identifier, Mini Apps version, etc.">Launch Parameters</Cell>
                    </Link>
                    <Link to="/theme-params">
                        <Cell subtitle="Telegram application palette information">Theme Parameters</Cell>
                    </Link>
                </Section>
            </List>
        </Page>
    );
};
