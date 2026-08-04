import {useMutation} from '@tanstack/react-query';
import {authService, type LoginRequest, type TokenResponse} from '../services/authService';

// Do operacji modyfikujących stan (a taką jest nasz POST generujący nową sesję) używamy useMutation.
// Hook ten zahermetyzuje logikę wysyłania żądania.
export const useLogin = () => {
    return useMutation<TokenResponse, Error, LoginRequest>({
        mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    });
};