import {Navigate, Route, Routes} from 'react-router-dom';
import {AppLayout} from './components/layout/AppLayout';
import {DashboardPage} from './pages/DashboardPage/DashboardPage';
import {DomainsPage} from './pages/DomainsPage/DomainsPage';

export function App() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout/>}>
                <Route index element={<Navigate to="/dashboard" replace/>}/>
                <Route path="dashboard" element={<DashboardPage/>}/>
                <Route path="domains" element={<DomainsPage/>}/>
            </Route>
        </Routes>
    );
}

export default App;