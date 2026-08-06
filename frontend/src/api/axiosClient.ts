import axios from 'axios';

// Tworzymy globalną instancję klienta
export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor żądań - dodaje token JWT do każdego wysyłanego zapytania
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axiosClient.interceptors.response.use((response) => {
    return response;
}, (error) => {

    // Jeśli backend zwraca błąd 401 (Unauthorized) - token jest nieprawidłowy lub wygasł
    if (error.response && (error.response.status === 401)) {
        // To czyścimy stary token
        localStorage.removeItem('accessToken');

        // I resetujemy stan Reacta (czyścimy cache) i przekierowujemy na stronę logowania
        // Używamy window.location, ponieważ instancja axiosa żyje poza drzewem Reacta
        window.location.href = '/login';
    } else if (error.response.status === 403) {
        // 403 Forbidden - Brak uprawnień do zasobu
        // Nie wylogowujemy, przekazujemy błąd dalej, aby warstwa UI (np. formularz) mogła go wyświetlić
        console.error("System Diagnostics: Access Denied (403). Insufficient privileges.");

        // TODO: Podpiąć tutaj globalny system powiadomień (Toast),
        // aby wyświetlić użytkownikowi komunikat np. "Brak uprawnień do wykonania tej operacji"
    }
    return Promise.reject(error);
});