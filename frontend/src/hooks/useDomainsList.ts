import {keepPreviousData, useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {dictionaryService} from '../services/dictionaryService';
import {PAGE_SIZE} from '../constants/paginations';
import type {Domain} from '../types/users';
import type {DomainRequestFormData} from '../validations/domainSchema';

// Parametr name zaimplementujemy dopiero w następnym tasku, gdy będziemy zajmować się wyszukiwaniem domen.
export const useDomainsList = (page: number = 0) => {
    return useQuery({
        queryKey: ['domains', {page, size: PAGE_SIZE}],
        // strzelamy do metody z dictionaryService.ts
        queryFn: () => dictionaryService.getDomains(page, PAGE_SIZE),
        placeholderData: keepPreviousData,
    });
};

// Hook do dodawania domen, operujący na globalnym cache'u
export const useAddDomain = () => {
    const queryClient = useQueryClient();

    return useMutation<Domain, Error, DomainRequestFormData>({
        mutationFn: (domainData) => dictionaryService.addDomain(domainData),
        onSuccess: () => {
            // Czyścimy cache dla domen, wymuszając ponownego GET-a
            queryClient.invalidateQueries({queryKey: ['domains']});
        },
        onError: (error) => {
            console.error('Error adding domain:', error);
        }
    });
};
