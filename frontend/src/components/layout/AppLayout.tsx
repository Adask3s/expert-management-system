import { Link, Outlet } from 'react-router-dom';
import styles from './AppLayout.module.css';

export const AppLayout = () => {
    return (
        <div className={styles.layout}>
            {/* Panel nawigacyjny boczny */}
            <nav>
                <ul>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/domains">Domains</Link></li>
                </ul>
            </nav>

            <main className={styles.mainContent}>
                {/* Tutaj React Router wstrzykuje zawartość stron (np. DashboardPage) */}
                <Outlet />
            </main>
        </div>
    );
}