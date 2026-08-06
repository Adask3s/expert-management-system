import {Outlet} from 'react-router-dom';
import styles from './AppLayout.module.css';
import {Sidebar} from './Sidebar/Sidebar';

export const AppLayout = () => {
    return (
        <div className={styles.layout}>
            {/* Panel nawigacyjny boczny */}
            <Sidebar/>

            <main className={styles.mainContent}>
                {/* Tutaj React Router wstrzykuje zawartość stron (np. DashboardPage) */}
                <Outlet/>
            </main>
        </div>
    );
}