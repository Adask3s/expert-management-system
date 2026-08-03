import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {dictionaryService} from '../services/dictionaryService';

export const PAGE_SIZE = 10;
// Parametr name zaimplementujemy dopiero w następnym tasku, gdy będziemy zajmować się wyszukiwaniem domen.
export const useDomainsList = (page: number = 0) => {
    return useQuery({
        queryKey: ['domains', {page, size: PAGE_SIZE}],
        // strzelamy do metody z dictionaryService.ts
        queryFn: () => dictionaryService.getDomains(page, PAGE_SIZE),
        placeholderData: keepPreviousData,
    });
};