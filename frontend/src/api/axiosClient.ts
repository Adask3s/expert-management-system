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

    // Jeśli backend zwraca błąd 401/403 (token wygasł, jest nieprawidłowy lub brak dostępu)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // To czyścimy stary token
        localStorage.removeItem('accessToken');

        // I resetujemy stan Reacta (czyścimy cache) i przekierowujemy na stronę logowania
        // Używamy window.location, ponieważ instancja axiosa żyje poza drzewem Reacta
        window.location.href = '/login';
    }
    return Promise.reject(error);
});