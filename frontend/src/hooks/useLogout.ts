import {useNavigate} from 'react-router-dom';

export const useLogout = () => {
    const navigate = useNavigate();

    const logout = () => {
        // Twarde usunięcie tokena JWT z pamięci przeglądarki
        localStorage.removeItem('accessToken');

        // Przekierowanie na login z flagą replace, by wyczyścić historię nawigacji
        navigate('/login', {replace: true});
    };

    return logout;
};