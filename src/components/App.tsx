import { useMemo } from 'react';
import { retrieveLaunchParams, useSignal, isMiniAppDark } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { HashRouter } from 'react-router-dom';

import { TabBar } from '@/components/TabBar/TabBar';
import { AuthGuard } from '@/components/AuthGuard';

export function App() {
  const lp = useMemo(() => retrieveLaunchParams(), []);
  const isDark = useSignal(isMiniAppDark);

  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'}
    >
      <HashRouter>
        <AuthGuard>
          <TabBar />
        </AuthGuard>
      </HashRouter>
    </AppRoot>
  );
}
