import {Link, Outlet} from 'react-router-dom';
import styles from './AppLayout.module.css';

export const AppLayout = () => {
    return (
        <div className={styles.layout}>
            {/* Panel boczny */}
            {/* Używamy tago <aside> do oznaczania sekcji, które są tylko pośrednio powiązane z główną treścią dokumentu. */}
            <aside className={styles.sidebar}>
                {/* Umieszczamy <nav> wewnątrz <aside>, logicznie określamy, że nasz pasek boczny
                jest głównym menu nawigacyjnym systemu */}
                <nav>
                    <ul>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/domains">Domains</Link></li>
                    </ul>
                </nav>
            </aside>

            <main className={styles.mainContent}>
                {/* Tutaj React Router wstrzykuje zawartość stron (np. DashboardPage) */}
                <Outlet/>
            </main>
        </div>
    );
}