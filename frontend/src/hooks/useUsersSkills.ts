import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {userService} from '../services/userService';

export const useUserSkills = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['user-skills', userId],
        queryFn: () => userService.getUserSkills(userId!),
        enabled: !!userId,
    });
};

// Ścisłe dopasowanie do UserSkillRequest z kontraktu OpenAPI
interface UserSkillPayload {
    userId: number;
    domainId: number;
    expertiseLevelId: number;
}

export const useAddUserSkill = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UserSkillPayload) => userService.addUserSkill(userId, payload),
        onSuccess: () => {
            // Natychmiastowe odświeżenie danych w tabeli
            queryClient.invalidateQueries({queryKey: ['user-skills', userId]});
        }
    });
};

export const useUpdateUserSkill = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({userSkillId, payload}: { userSkillId: number; payload: UserSkillPayload }) =>
            userService.updateUserSkill(userSkillId, payload),
        onSuccess: () => {
            // Natychmiastowe odświeżenie danych w tabeli
            queryClient.invalidateQueries({queryKey: ['user-skills', userId]});
        }
    });
};

export const useDeleteUserSkill = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userSkillId: number) => userService.deleteUserSkill(userSkillId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['user-skills', userId]});
        }
    });
};