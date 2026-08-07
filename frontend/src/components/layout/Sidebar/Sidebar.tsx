import {NavLink} from 'react-router-dom';
import styles from './Sidebar.module.css';
import Dashboard from '../../../assets/icons/Dashboard.svg';
import DefaultStack from '../../../assets/icons/DefaultStack.svg';
import Logout from '../../../assets/icons/Logout.svg';
import Star from '../../../assets/icons/Star.svg';
import {UserAvatar} from '../../common/UserAvatar/UserAvatar';
import {useLogout} from '../../../hooks/useLogout';
import {useAuth} from '../../../hooks/useAuth'

const navItems = [
    {to: '/dashboard', label: 'Dashboard', icon: Dashboard},
    {to: '/domains', label: 'Domains', icon: DefaultStack},
];

export const Sidebar = () => {
    // Podpinamy gotową logikę czyszczenia sesji i przekierowania
    const logout = useLogout();

    const {user, isLoading} = useAuth();
    const fullName = user ? `${user.firstName} ${user.lastName}` : 'Guest';
    const email = user?.email ?? 'Not logged in';

    return (
        <aside className={styles.sidebarContainer}>
            {/* Logo */}
            <div className={styles.brandSection}>
                <div className={styles.brandIconWrapper}>
                    <img src={Star} alt="Star logo" width={24} height={24}/>
                </div>
                <div className={styles.brandText}>
                    <span className={styles.appName}>Expert Management System</span>
                </div>
            </div>

            {/* Nawigacja */}
            <nav className={styles.navSection}>
                <h2 className={styles.menuLabel}>Menu</h2>

                {navItems.map(({to, label, icon}) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({isActive}) =>
                            [styles.navLink, isActive ? styles.navLinkActive : null]
                                .filter(Boolean)
                                .join(' ')
                        }
                    >
                        <img src={icon} alt={`${label} icon`} width={20} height={20}/>
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* Profil użytkownika */}
            <div className={styles.userSection}>
                <div className={styles.userInfo}>
                    <UserAvatar altText={fullName}/>
                    <div className={styles.userDetails}>
                        <span className={styles.userName}>
                            {isLoading ? 'Loading...' : fullName}
                        </span>
                        <span className={styles.userEmail}>
                            {isLoading ? '...' : email}
                        </span>
                    </div>
                </div>

                {/* Przycisk wylogowywania */}
                <button
                    type="button"
                    className={styles.logoutButton}
                    onClick={logout}
                    aria-label="Logout"
                    title="Logout"
                >
                    <img src={Logout} alt="Logout icon" width={20} height={20}/>
                </button>
            </div>
        </aside>
    );
};