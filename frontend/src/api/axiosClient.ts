import axios from 'axios';

// tworzymy globalną instancję klienta
export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// interceptor żądań dodaje token JWT do każdego wysyłanego zapytania
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

    // Jeśli backend zwraca błąd 401 (token wygasł lub jest nieprawidłowy)
    if (error.response && error.response.status === 401) {
        // To czyścimy stary token
        localStorage.removeItem('accessToken');

        // I przekierowujemy na stronę logowania
        // Używamy window.location, ponieważ instancja axiosa żyje poza drzewem Reacta
        window.location.href = '/login';
    }
    return Promise.reject(error);
});