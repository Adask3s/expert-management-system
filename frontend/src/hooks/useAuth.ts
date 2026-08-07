import {useCurrentUser} from './useCurrentUser';

export function useAuth() {
    const {data: user, isLoading} = useCurrentUser();
    const isAdmin = user?.roles?.includes('ROLE_ADMIN') ?? false;

    return {user, isAdmin, isLoading};
}