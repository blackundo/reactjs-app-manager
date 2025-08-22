import { useState, useCallback } from 'react';
import type { SnackbarProps } from './Snackbar';

export const useSnackbar = () => {
    const [snackbar, setSnackbar] = useState<SnackbarProps | null>(null);

    const showSnackbar = useCallback((props: SnackbarProps) => {
        setSnackbar(props);
    }, []);

    const hideSnackbar = useCallback(() => {
        setSnackbar(null);
    }, []);

    const showSuccess = useCallback((message: string, duration?: number) => {
        showSnackbar({ message, type: 'success', duration });
    }, [showSnackbar]);

    const showError = useCallback((message: string, duration?: number) => {
        showSnackbar({ message, type: 'error', duration });
    }, [showSnackbar]);

    const showWarning = useCallback((message: string, duration?: number) => {
        showSnackbar({ message, type: 'warning', duration });
    }, [showSnackbar]);

    const showInfo = useCallback((message: string, duration?: number) => {
        showSnackbar({ message, type: 'info', duration });
    }, [showSnackbar]);

    return {
        snackbar,
        showSnackbar,
        hideSnackbar,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };
};
