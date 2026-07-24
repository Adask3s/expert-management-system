// Service dla pobierania domen oraz leveli
// Użytkownik będzie rozwijał domeny i levele filtrując
// Formularz przypisywania domen i leveli również będzie z tego korzystał
// Widok zarządzania domenami również itp.

import {axiosClient} from '../api/axiosClient';
import type {Domain, ExpertiseLevel} from '../types/users';

export const dictionaryService = {
    /* Pobiera listę wszystkich domen kompetencyjnych dla selektorów */
    getDomains: async (): Promise<Domain[]> => {
        const response = await axiosClient.get<Domain[]>('/domains');
        return response.data;
    },

    /* Pobiera listę wszystkich poziomów zaawansowania (Awareness, Functional, itd.) */
    getExpertiseLevels: async (): Promise<ExpertiseLevel[]> => {
        const response = await axiosClient.get<ExpertiseLevel[]>('/expertise-levels');
        return response.data;
    },
};