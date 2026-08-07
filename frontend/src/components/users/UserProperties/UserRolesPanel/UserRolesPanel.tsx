// frontend/src/components/users/UserProperties/UserRolesPanel/UserRolesPanel.tsx
import {useState} from 'react';
import {ConfirmModal} from '../../../common/Modal/ConfirmModal';
import {useAssignRole, useRemoveRole, useUserRoles} from '../../../../hooks/useRoles';
import type {User} from '../../../../types/users';
import styles from './UserRolesPanel.module.css';
import Protected from '../../../../assets/icons/Protected.svg';

interface UserRolesPanelProps {
    user: User;
}

type RoleType = 'ROLE_USER' | 'ROLE_ADMIN';

export const UserRolesPanel = ({user}: UserRolesPanelProps) => {
    // Pobieramy role bezpośrednio z nowego endpointu za pomocą dedykowanego hooka query
    const {data: roles = [], isLoading: isRolesLoading} = useUserRoles(user.id!);

    const isAdmin = roles.includes('ROLE_ADMIN');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingRole, setPendingRole] = useState<RoleType | null>(null);

    const assignRole = useAssignRole();
    const removeRole = useRemoveRole();

    const isPending = assignRole.isPending || removeRole.isPending || isRolesLoading;

    const handleRoleSelect = (selectedRole: RoleType) => {
        if ((selectedRole === 'ROLE_ADMIN' && isAdmin) || (selectedRole === 'ROLE_USER' && !isAdmin)) {
            return;
        }
        setPendingRole(selectedRole);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setPendingRole(null);
    };

    const confirmRoleChange = () => {
        const userIdStr = user.id!.toString();

        if (pendingRole === 'ROLE_ADMIN') {
            assignRole.mutate({userId: userIdStr, roleName: 'ROLE_ADMIN'}, {
                onSuccess: closeModal
            });
        } else if (pendingRole === 'ROLE_USER') {
            removeRole.mutate({userId: userIdStr, roleName: 'ROLE_ADMIN'}, {
                onSuccess: closeModal
            });
        }
    };

    const getModalDescription = () => {
        if (pendingRole === 'ROLE_ADMIN') {
            return "Are you sure you want to change this employee's system role to Administrator? Administrators have full access to manage users, domains, and expertise levels.";
        }
        return "Are you sure you want to change this employee's system role to User? They will lose access to administrative functions.";
    };

    return (
        <>
            <section className={styles.card}>
                <div className={styles.header}>
                    <img src={Protected} alt="System Role" width={16} height={16} className={styles.icon}/>
                    <h3 className={styles.title}>System Role</h3>
                </div>

                <div className={styles.segmentedControl}>
                    <button
                        type="button"
                        className={`${styles.segmentButton} ${!isAdmin ? styles.active : ''}`}
                        onClick={() => handleRoleSelect('ROLE_USER')}
                        disabled={isPending}
                    >
                        USER
                    </button>
                    <button
                        type="button"
                        className={`${styles.segmentButton} ${isAdmin ? styles.active : ''}`}
                        onClick={() => handleRoleSelect('ROLE_ADMIN')}
                        disabled={isPending}
                    >
                        ADMIN
                    </button>
                </div>
            </section>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={confirmRoleChange}
                title="Confirm Role Change"
                description={getModalDescription()}
                confirmText={isPending ? 'Processing...' : 'Confirm Change'}
                cancelText="Cancel"
                variant="danger"
                isLoading={isPending}
            />
        </>
    );
};