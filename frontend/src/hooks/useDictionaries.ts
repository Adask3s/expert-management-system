import {useQuery} from '@tanstack/react-query';
import {dictionaryService} from '../services/dictionaryService';

export const useDomains = () => {
    return useQuery({
        queryKey: ['domains'],
        // strzelamy do metody z dictionaryService.ts
        queryFn: dictionaryService.getDomains,
    });
};

export const useExpertiseLevels = () => {
    return useQuery({
        queryKey: ['expertiseLevels'],
        // strzelamy do metody z dictionaryService.ts
        queryFn: dictionaryService.getExpertiseLevels,
    });
};