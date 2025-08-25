import { Snackbar as TelegramSnackbar } from '@telegram-apps/telegram-ui';
import { useState, useEffect, type FC } from 'react';

import './Snackbar.css';

export interface SnackbarProps {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    onClose?: () => void;
}

export interface SnackbarContextType {
    showSnackbar: (props: SnackbarProps) => void;
    hideSnackbar: () => void;
}

export const Snackbar: FC<SnackbarProps> = ({
    message,
    type = 'info',
    duration = 30000,
    onClose
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose?.();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        onClose?.();
    };

    if (!isVisible) return null;

    return (
        <TelegramSnackbar
            onClose={handleClose}
            className={`snackbar snackbar--${type}`}
        >
            <div className="snackbar__content">
                <span className={`snackbar__icon snackbar__icon--${type}`}>
                    {type === 'success' && '✅'}
                    {type === 'error' && '❌'}
                    {type === 'warning' && '⚠️'}
                    {type === 'info' && 'ℹ️'}
                </span>
                <span className="snackbar__message">{message}</span>
            </div>
        </TelegramSnackbar>
    );
};
