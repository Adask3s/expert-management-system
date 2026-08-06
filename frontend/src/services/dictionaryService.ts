// Service dla pobierania domen oraz leveli
// Użytkownik będzie rozwijał domeny i levele filtrując
// Formularz przypisywania domen i leveli również będzie z tego korzystał
// Widok zarządzania domenami również itp.

import {axiosClient} from '../api/axiosClient';
import type {DomainRequestFormData} from '../validations/domainSchema';
import type {Domain, DomainPageDto, DomainRequest, ExpertiseLevel} from '../types/users';

// Przygotowujemy serwis na przyszły task o wyszukiwaniu domen.
// Dlatego metoda getDomains przyjmuje dodatkowy parametr name, który jest opcjonalny.
// W przyszłym tasku będziemy go wykorzystywać do wyszukiwania domen po nazwie.
export const dictionaryService = {
    /* Pobiera listę wszystkich domen kompetencyjnych dla selektorów */
    getDomains: async (page: number, size: number, name?: string): Promise<DomainPageDto> => {
        const response = await axiosClient.get<DomainPageDto>('/domains', {
            params: {page, size, ...(name && {name})},
        });
        return response.data;
    },

    /* Pobiera listę wszystkich poziomów zaawansowania (Awareness, Functional, itd.) */
    getExpertiseLevels: async (): Promise<ExpertiseLevel[]> => {
        const response = await axiosClient.get<ExpertiseLevel[]>('/expertise-levels');
        return response.data;
    },

    /* Aktualizuje istniejącą domenę */
    updateDomain: async (id: number, payload: DomainRequest): Promise<Domain> => {
        const response = await axiosClient.put<Domain>(`/domains/${id}`, payload);
        return response.data;
    },

    /* Dodaje nową domenę do systemu */
    addDomain: async (domainData: DomainRequestFormData): Promise<Domain> => {
        const response = await axiosClient.post<Domain>('/domains', domainData);
        return response.data;
    },
};