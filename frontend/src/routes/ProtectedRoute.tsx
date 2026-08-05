import {Navigate, Outlet} from 'react-router-dom';

// Komponent ochronny dla routingu React Router
// Sprawdza obecność tokena JWT w localStorage
// Jeśli token nie istnieje, natychmiast przekierowuje na stronę logowania

export const ProtectedRoute = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        // Flaga 'replace' podmienia historię przeglądarki, zapobiegając cofaniu się przyciskiem 'Back'
        return <Navigate to="/login" replace/>;
    }

    // Renderuje komponenty podrzędne (np. AppLayout -> DashboardPage)
    return <Outlet/>;
};