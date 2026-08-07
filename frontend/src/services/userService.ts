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

    /* Pobieranie pojedynczego użytkownika po ID */
    getUserById: async (id: string): Promise<User> => {
        const response = await axiosClient.get<User>(`/users/${id}`);
        return response.data;
    },

    /* Aktualizacja danych profilowych użytkownika */
    updateUser: async (id: string, userData: UserRequestFormData): Promise<User> => {
        const response = await axiosClient.put<User>(`/users/${id}`, userData);
        return response.data;
    },

    /* Nadawanie roli użytkownikowi */
    addRole: async (userId: string, roleName: string): Promise<void> => {
        // Kontrakt wymaga obiektu RoleRequest { roleName: string } w ciele POST
        await axiosClient.post(`/users/${userId}/roles`, {roleName});
    },

    /* Odbieranie roli użytkownikowi */
    removeRole: async (userId: string, roleName: string): Promise<void> => {
        // DELETE przyjmuje parametr roleName w ścieżce
        await axiosClient.delete(`/users/${userId}/roles/${roleName}`);
    },

    /* Pobieranie ról przypisanych do konkretnego użytkownika */
    getUserRoles: async (userId: string): Promise<string[]> => {
        const response = await axiosClient.get<string[]>(`/users/${userId}/roles`);
        return response.data;
    },
};