import {useMutation, useQueryClient} from '@tanstack/react-query';
import {dictionaryService} from '../services/dictionaryService';
import type {DomainRequest} from '../types/users';

interface UpdateDomainParams {
    id: number;
    payload: DomainRequest;
}

export const useUpdateDomain = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, payload}: UpdateDomainParams) =>
            dictionaryService.updateDomain(id, payload),
        onSuccess: () => {
            // Po pomyślnej edycji odświeżamy zapytania z domenami
            queryClient.invalidateQueries({queryKey: ['domains']});
        },
    });
};