import type {ReactNode} from 'react';
import {Modal} from '../Modal/Modal';
import {Button} from '../Button/Button';
import styles from './ConfirmModal.module.css';

export interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description?: ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary';
    isLoading?: boolean;
}

export const ConfirmModal = ({
                                 isOpen,
                                 onClose,
                                 onConfirm,
                                 title,
                                 description = 'This action cannot be undone. The record will be permanently removed from the directory.',
                                 confirmText = 'Delete',
                                 cancelText = 'Cancel',
                                 variant = 'danger',
                                 isLoading = false,
                             }: ConfirmModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={isLoading ? () => {
            } : onClose}
            title={title}
        >
            <div className={styles.container}>
                {description && (
                    <p className={styles.description}>
                        {description}
                    </p>
                )}

                <div className={styles.actions}>
                    <Button
                        variant="ghost"
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant}
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Deleting...' : confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};