import {type ReactNode, useEffect} from 'react';
import {createPortal} from 'react-dom';
import styles from './Modal.module.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export const Modal = ({isOpen, onClose, title, children}: ModalProps) => {

    // Zarządzanie cyklem życia modala: nasłuchiwanie klawiszy i blokada scrolla
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);

            // Blokujemy przewijanie strony pod spodem, gdy modal jest otwarty
            document.body.style.overflow = 'hidden';
        }

        // Cleanup zapobiegający wyciekom pamięci
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className={styles.modalOverlay}>

            {/* e.stopPropagation() zapobiega zamknięciu modala przy kliknięciu w samą kartę */}
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{title}</h2>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>

                <div className={styles.modalBody}>
                    {children}
                </div>

            </div>
        </div>,
        document.body
    );
};