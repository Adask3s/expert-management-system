import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {type UserRequestFormData, userRequestSchema} from '../../../validations/userSchema';
import {useAddUser} from '../../../hooks/useUsers';
import {Button} from '../../common/Button/Button';
import styles from './AddUserForm.module.css';

interface AddUserFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export const AddUserForm = ({onSuccess, onCancel}: AddUserFormProps) => {
    const {mutate, isPending, isError} = useAddUser();

    // Inicjalizujemy react-hook-form z resolverem Zod
    // Deklarujemy funkcje z react-hook-form do obsługi formularza: register (rejestracja pól),
    // handleSubmit (obsługa submit), formState (stan formularza, w tym błędy walidacji)
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<UserRequestFormData>({
        // Podpinamy naszą zaimportowaną walidację Zod do react-hook-form
        resolver: zodResolver(userRequestSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            active: true // Domyślnie active
        }
    });

    const onSubmit = (data: UserRequestFormData) => {
        // Wywołujemy mutację (POST /users)
        mutate(data, {
            onSuccess: () => {
                onSuccess(); // Zamknięcie modala
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
            {/* First name */}
            <div className={styles.fieldGroup}>
                <label htmlFor="firstName" className={styles.label}>First Name</label>
                <input
                    id="firstName"
                    type="text"
                    placeholder="e.g. John"
                    className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                    // Podłączamy pole do stanu formularza
                    // Rejestrujemy nazwę pola
                    // Pozwalamy react-hook-form zarządzać jego wartością i walidacją
                    {...register('firstName')}
                />
                {errors.firstName && <span className={styles.errorMessage}>{errors.firstName.message}</span>}
            </div>

            {/* Last name */}
            <div className={styles.fieldGroup}>
                <label htmlFor="lastName" className={styles.label}>Last Name</label>
                <input
                    id="lastName"
                    type="text"
                    placeholder="e.g. Smith"
                    className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                    {...register('lastName')}
                />
                {errors.lastName && <span className={styles.errorMessage}>{errors.lastName.message}</span>}
            </div>

            {/* Email */}
            <div className={styles.fieldGroup}>
                <label htmlFor="email" className={styles.label}>Email Address</label>
                <input
                    id="email"
                    type="email"
                    placeholder="e.g. john.smith@corp.com"
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    {...register('email')}
                />
                {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
            </div>

            {/* Active Status (Toggle) */}
            <div className={styles.statusRow}>
                <div className={styles.statusText}>
                    <label className={styles.label}>Account Status</label>
                    <span className={styles.statusDescription}>Active - set by administrator</span>
                </div>

                <label className={styles.toggleLabel}>
                    <input
                        type="checkbox"
                        className={styles.toggleInput}
                        {...register('active')}
                    />
                    <span className={styles.toggleSlider}></span>
                </label>
            </div>

            {/* Global error */}
            {isError && (
                <div className={styles.errorMessage}>
                    Failed to add user. Please try again.
                </div>
            )}

            {/* Actions */}
            <div className={styles.formActions}>
                <Button
                    variant="ghost"
                    type="button"
                    onClick={onCancel}
                    disabled={isPending}
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? 'Adding...' : 'Add Employee'}
                </Button>
            </div>
        </form>
    );
};