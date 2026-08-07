import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {userService} from '../services/userService';

export const useUserRoles = (userId: string | number) => {
    // Normalizacja do stringa jest kluczowa: mutacje (assignRole/removeRole)
    // invalidują cache pod kluczem ['user-roles', string], więc jeśli tutaj
    // trafiłby 'number', TanStack Query potraktuje to jako DWA różne wpisy
    // w cache (5 !== '5' przy strukturalnym porównaniu queryKey) i inwalidacja
    // nigdy nie trafi w ten odczyt.
    const normalizedUserId = userId.toString();

    return useQuery({
        queryKey: ['user-roles', normalizedUserId],
        queryFn: () => userService.getUserRoles(normalizedUserId),
        enabled: !!userId,
    });
};

interface RoleMutationArgs {
    userId: string;
    roleName: string;
}

export const useAssignRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({userId, roleName}: RoleMutationArgs) =>
            userService.addRole(userId, roleName),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({queryKey: ['user-roles', variables.userId]});
            queryClient.invalidateQueries({queryKey: ['users']});
        }
    });
};

export const useRemoveRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({userId, roleName}: RoleMutationArgs) =>
            userService.removeRole(userId, roleName),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({queryKey: ['user-roles', variables.userId]});
            queryClient.invalidateQueries({queryKey: ['users']});
        }
    });
};