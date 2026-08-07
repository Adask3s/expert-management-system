import {useQuery} from '@tanstack/react-query';
import {axiosClient} from '../api/axiosClient'; // Import Twojej instancji
import type {UserListItem} from '../types/users';

export function useCurrentUser() {
    return useQuery<UserListItem>({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const {data} = await axiosClient.get<UserListItem>('/users/me');
            return data;
        },
    });
}