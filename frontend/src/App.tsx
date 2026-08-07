import {Navigate, Route, Routes} from 'react-router-dom';
import {AppLayout} from './components/layout/AppLayout';
import {DashboardPage} from './pages/DashboardPage/DashboardPage';
import {DomainsPage} from './pages/DomainsPage/DomainsPage';
import {LoginPage} from './pages/LoginPage/LoginPage';
import {ProtectedRoute} from './routes/ProtectedRoute';
import {UserPropertiesPage} from './pages/UserPropertiesPage/UserPropertiesPage';

export function App() {
    return (
        <Routes>
            {/* Tutaj jest ścieżka publiczna, czyli widok lodowania - wyciągnięta poza AppLayout */}
            <Route path="/login" element={<LoginPage/>}/>

            {/* Tutaj jest ścieżka chroniona naszym ProtectedRoute - obejmujemy widoki po zalogowaniu */}
            <Route path="/" element={<ProtectedRoute/>}>
                <Route path="/" element={<AppLayout/>}>
                    <Route index element={<Navigate to="/dashboard" replace/>}/>
                    <Route path="dashboard" element={<DashboardPage/>}/>
                    <Route path="domains" element={<DomainsPage/>}/>
                    {/* Ścieżka do szczegółów użytkownika */}
                    <Route path="users/:id" element={<UserPropertiesPage/>}/>
                </Route>
            </Route>

            {/* Przechwytywanie nieistniejących ścieżek - oddelegowujemy do dashboard'u */}
            <Route path="*" element={<Navigate to="/dashboard" replace/>}/>

            {/* Ścieżka do szczegółów użytkownika */}

        </Routes>
    );
}

export default App;