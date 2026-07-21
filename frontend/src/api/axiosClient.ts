import axios from 'axios';

// tworzymy globalną instancję klienta
export const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// interceptor żądań - będzie dodawał token JWT do każdego wysyłanego zapytania
axiosClient.interceptors.request.use((config) => {
    // tutaj w przyszłości będziemy pobierali token np. z localStorage
    const token = localStorage.getItem('jwt_token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});