import {useQuery} from '@tanstack/react-query';
import {dictionaryService} from '../services/dictionaryService';

export const useExpertiseLevels = () => {
    return useQuery({
        queryKey: ['expertiseLevels'],
        queryFn: dictionaryService.getExpertiseLevels,
    });
};