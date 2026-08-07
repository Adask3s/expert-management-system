import {Navigate, useParams} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {userService} from '../../services/userService';
import {UserProfileForm} from '../../components/users/UserProperties/UserProfileForm/UserProfileForm';
import styles from './UserPropertiesPage.module.css';
import {UserRolesPanel} from '../../components/users/UserProperties/UserRolesPanel/UserRolesPanel';

export const UserPropertiesPage = () => {
    const {id} = useParams<{ id: string }>();

    // Pobieranie danych z backendu
    const {data: user, isLoading, isError} = useQuery({
        queryKey: ['user', id],
        queryFn: () => userService.getUserById(id!),
        enabled: !!id, // Uruchom tylko gdy mamy ID
    });

    if (isError || (!user && !isLoading)) {
        return <Navigate to="/dashboard" replace/>;
    }

    return (
        <div className={styles.pageContainer}>
            {/* Nagłówek strony (zgodnie z makietą) */}
            <header className={styles.pageHeader}>
                <h1 className={styles.title}>
                    <span className={styles.backLink}>Users / </span>
                    {isLoading ? 'Loading...' : `${user?.firstName} ${user?.lastName}`}
                </h1>

                {/* Status konta - wartość pobierana z backendu */}
                {user && (
                    <div className={user.active ? styles.statusActive : styles.statusInactive}>
                        <span className={styles.statusDot}></span>
                        {user.active ? 'Active' : 'Inactive'}
                    </div>
                )}
            </header>

            {isLoading ? (
                <div className={styles.loader}>Loading user data...</div>
            ) : (
                <div className={styles.contentGrid}>
                    <aside className={styles.leftColumn}>
                        {/* Wstrzykujemy pobrane dane do formularza */}
                        <UserProfileForm initialData={user!}/>
                        <UserRolesPanel user={user!}/>

                        {/* TODO: Tutaj wyląduje UserRolesPanel.tsx */}
                    </aside>

                    <main className={styles.rightColumn}>
                        {/* TODO: Tutaj wyląduje UserSkillsManager.tsx */}
                    </main>
                </div>
            )}
        </div>
    );
};