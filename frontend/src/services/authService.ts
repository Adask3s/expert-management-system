import {axiosClient} from '../api/axiosClient';

// Typy odwzorowujące kontrakt OpenAPI
export interface LoginRequest {
    email: string;
    password: string;
}

export interface TokenResponse {
    accessToken: string;
}

export const authService = {
    login: async (credentials: LoginRequest): Promise<TokenResponse> => {
        const response = await axiosClient.post<TokenResponse>('/auth/login', credentials);
        return response.data;
    },
};