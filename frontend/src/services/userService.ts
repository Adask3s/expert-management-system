import {axiosClient} from '../api/axiosClient';
import type {ExpertSearchRequest, User, UserListPage} from '../types/users';
import type {UserRequestFormData} from '../validations/userSchema';

export const userService = {
    /* Pobiera paginowaną listę użytkowników (Domyślne ładowanie tabeli) */
    getUsers: async (page = 0, size = 10): Promise<UserListPage> => {
        const response = await axiosClient.get<UserListPage>('/users', {
            params: {page, size},
        });
        return response.data;
    },

    /* Dodawanie nowego użytkownika */
    addUser: async (userData: UserRequestFormData): Promise<User> => {
        const response = await axiosClient.post<User>('/users', userData);
        return response.data;
    },

    /* Wielokryterialne wyszukiwanie ekspertów na podstawie zdefiniowanych reguł skill rules */
    searchExperts: async (request: ExpertSearchRequest): Promise<UserListPage> => {
        const response = await axiosClient.post<UserListPage>('/search', request);
        return response.data;
    },

    /* Usuwanie użytkownika po ID */
    deleteUser: async (id: number): Promise<void> => {
        await axiosClient.delete(`/users/${id}`);
    },
};