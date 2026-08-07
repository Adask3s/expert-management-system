import {useRef, useState} from 'react';
import {Button} from '../../../common/Button/Button';
import {UserAvatar} from '../../../common/UserAvatar/UserAvatar';
import {useUpdateUser} from '../../../../hooks/useUsers';
import type {User} from '../../../../types/users';
import editIcon from '../../../../assets/icons/Edit.svg';
import styles from './UserProfileForm.module.css';

interface UserProfileFormProps {
    initialData: User;
}

export const UserProfileForm = ({initialData}: UserProfileFormProps) => {
    const [formData, setFormData] = useState({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        active: initialData.active
    });

    const [activeField, setActiveField] = useState<'firstName' | 'lastName' | 'email' | null>(null);

    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    // Wstrzyknięcie dedykowanego hooka
    const updateUserMutation = useUpdateUser();

    const handleRestore = () => {
        setFormData({
            firstName: initialData.firstName,
            lastName: initialData.lastName,
            email: initialData.email,
            active: initialData.active
        });
        setActiveField(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Bezpiecznik dla TypeScripta i integralności biznesowej
        if (!initialData.id) {
            console.error("System Error: Cannot update user without an ID.");
            return;
        }

        // Delegacja logiki do hooka
        updateUserMutation.mutate({
            id: initialData.id.toString(),
            userData: formData
        });

        setActiveField(null);
    };

    const activateField = (field: 'firstName' | 'lastName' | 'email', ref: React.MutableRefObject<HTMLInputElement | null>) => {
        setActiveField(field);
        setTimeout(() => ref.current?.focus(), 0);
    };

    return (
        <form className={styles.card} onSubmit={handleSubmit}>
            <div className={styles.profileHeader}>
                <div className={styles.avatarLarge}>
                    <UserAvatar/>
                </div>
                <div className={styles.profileInfo}>
                    <span className={styles.fullName}>{initialData.firstName} {initialData.lastName}</span>
                    <span className={styles.emailAddress}>{initialData.email}</span>
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>FIRST NAME</label>
                <div className={styles.inputWrapper}>
                    <input
                        ref={firstNameRef}
                        className={`${styles.input} ${activeField !== 'firstName' ? styles.inputLocked : ''}`}
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        readOnly={activeField !== 'firstName'}
                        onBlur={() => setActiveField(null)}
                        required
                    />
                    {activeField !== 'firstName' && (
                        <img
                            src={editIcon}
                            alt="Edit"
                            className={styles.editIcon}
                            onClick={() => activateField('firstName', firstNameRef)}
                            width={16}
                            height={16}
                        />
                    )}
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>LAST NAME</label>
                <div className={styles.inputWrapper}>
                    <input
                        ref={lastNameRef}
                        className={`${styles.input} ${activeField !== 'lastName' ? styles.inputLocked : ''}`}
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        readOnly={activeField !== 'lastName'}
                        onBlur={() => setActiveField(null)}
                        required
                    />
                    {activeField !== 'lastName' && (
                        <img
                            src={editIcon}
                            alt="Edit"
                            className={styles.editIcon}
                            onClick={() => activateField('lastName', lastNameRef)}
                            width={16}
                            height={16}
                        />
                    )}
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>EMAIL</label>
                <div className={styles.inputWrapper}>
                    <input
                        ref={emailRef}
                        className={`${styles.input} ${activeField !== 'email' ? styles.inputLocked : ''}`}
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        readOnly={activeField !== 'email'}
                        onBlur={() => setActiveField(null)}
                        required
                    />
                    {activeField !== 'email' && (
                        <img
                            src={editIcon}
                            alt="Edit"
                            className={styles.editIcon}
                            onClick={() => activateField('email', emailRef)}
                            width={16}
                            height={16}
                        />
                    )}
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>EMPLOYEE ID</label>
                <div className={styles.inputWrapper}>
                    <input
                        className={`${styles.input} ${styles.inputReadOnly}`}
                        type="text"
                        value={`#${initialData.id ?? 'UNKNOWN'}`}
                        readOnly
                    />
                </div>
            </div>

            <div className={styles.actions}>
                <Button type="submit" variant="primary" disabled={updateUserMutation.isPending}>
                    {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>

                <Button type="button" variant="danger" onClick={handleRestore} disabled={updateUserMutation.isPending}>
                    Restore default
                </Button>
            </div>
        </form>
    );
};