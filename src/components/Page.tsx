import { useNavigate } from 'react-router-dom';
import { hideBackButton, onBackButtonClick, showBackButton } from '@telegram-apps/sdk-react';
import { type PropsWithChildren, useEffect } from 'react';

export function Page({ children, back = true }: PropsWithChildren<{
  /**
   * True if it is allowed to go back from this page.
   */
  back?: boolean
}>) {
  let navigate: ((delta: number) => void) | null = null;

  try {
    navigate = useNavigate();
  } catch (error) {
    // Router context not available, navigation will be disabled
    console.warn('Router context not available for Page component');
  }

  useEffect(() => {
    if (back && navigate) {
      showBackButton();
      return onBackButtonClick(() => {
        navigate(-1);
      });
    }
    hideBackButton();
  }, [back, navigate]);

  return <>{children}</>;
}