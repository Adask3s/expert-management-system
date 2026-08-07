import {useQuery} from '@tanstack/react-query';
import {userService} from '../services/userService';

export const useUserSkills = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['user-skills', userId],
        queryFn: () => userService.getUserSkills(userId!),
        enabled: !!userId,
    });
};