import {keepPreviousData, useMutation, useQuery} from '@tanstack/react-query';
import {userService} from '../services/userService';
import type {ExpertSearchRequest} from '../types/users';
// Standardowa liczba rekordów na stronie
import {PAGE_SIZE} from '../constants/paginations';

// Hook do standardowej, paginowanej listy użytkowników
export const useUsersList = (page: number = 0, size: number = PAGE_SIZE) => {
    return useQuery({
        // queryKey jest kluczowe, gdy zmienimy `page` lub `size` w komponencie,
        // React Query automatycznie wywoła nowe żądanie
        queryKey: ['users', {page, size}],

        // strzelamy do metody z userService.ts
        queryFn: () => userService.getUsers(page, size),

        // Zatrzymujemy stare dane w cache do momentu pobrania nowych
        placeholderData: keepPreviousData, // zachowujemy poprzednie dane, gdy zmieniamy stronę
    });
};

/* Hook do zaawansowanego wyszukiwania (AND/OR) wyzwalany na żądanie */
export const useSearchExperts = () => {
    return useMutation({
        // strzelamy do metody z userService.ts
        // metoda /search to GET, używamy więc mutation zamiast query, a jest GET, ponieważ to skomplikowana lista
        // kryteriów i operator logiczny AND/OR - nie powinniśmy upychać tego w adresie URL (w metodzie GET)
        // mutation obsługuje POST i nie uruchamia się samo (w przeciwieństwie do GET, czeka aż jawnie ją wywołamy
        // (użytkownik naciśnie "Apply Filters"
        mutationFn: (request: ExpertSearchRequest) => userService.searchExperts(request),
    });
};