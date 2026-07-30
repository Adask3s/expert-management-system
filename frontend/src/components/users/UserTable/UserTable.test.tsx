/**
 * Zestaw testów jednostkowych weryfikuje następujące obszary:
 * 1) Data Mapping (Renderowanie danych)
 *    - Sprawdzenie, czy pola z kontraktu API (DTO UserListItem) są poprawnie transformowane na UI
 *      (np. formatowanie Imienia i Nazwiska, rzutowanie ról systemowych bez prefiksu, wyświetlanie odznak domen).
 * 2) Conditional Rendering (Renderowanie warunkowe)
 *    - Weryfikacja wizualnej reprezentacji flagi logicznej `active` (Active vs Inactive).
 *    - Prawidłowe zachowanie tabeli w przypadku otrzymania pustej tablicy wyników (Empty State).
 * 3) Event Delegation (Delegacja zdarzeń)
 *    - Potwierdzenie, że interakcje użytkownika z przyciskami akcji (Edycja/Usuwanie)
 *      poprawnie wywołują przekazane z zewnątrz funkcje zwrotne (callbacks) z odpowiednimi argumentami.
 */

import {fireEvent, render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {UserTable} from './UserTable';
import type {UserListItem} from '../../../types/users'; // Upewnij się co do ścieżki

// Mock danych w 100% zgodny z kontraktem OpenAPI (DTO: UserListItem)
const mockUsers: UserListItem[] = [
    {
        id: 101,
        firstName: 'Paweł',
        lastName: 'Matujewicz',
        email: 'pawel.matujewicz@corp.io',
        active: true,
        roles: ['ROLE_USER', 'ROLE_ADMIN'],
        skills: [
            {domainName: 'Java', levelName: 'Professional', rankValue: 3},
            {domainName: 'SQL', levelName: 'Master', rankValue: 4}
        ]
    },
    {
        id: 104,
        firstName: 'Katarzyna',
        lastName: 'Nowak',
        email: 'katarzyna.nowak@corp.io',
        active: false,
        roles: ['ROLE_USER'],
        skills: []
    }
];

describe('UserTable Component', () => {

    it('powinien poprawnie wyrenderować tabelę z danymi użytkowników', () => {
        render(<UserTable data={mockUsers}/>);

        // Weryfikacja renderowania danych tekstowych
        expect(screen.getByText('Paweł Matujewicz')).toBeInTheDocument();
        expect(screen.getByText('pawel.matujewicz@corp.io')).toBeInTheDocument();
        expect(screen.getByText('Katarzyna Nowak')).toBeInTheDocument();

        // Weryfikacja parsowania ról (usunięcie prefixu ROLE_)
        expect(screen.getByText('USER, ADMIN')).toBeInTheDocument();

        // Weryfikacja domen wiedzy
        expect(screen.getByText('Java')).toBeInTheDocument();
        expect(screen.getByText('Professional')).toBeInTheDocument();
    });

    it('powinien wyrenderować status Active/Inactive na podstawie wartości boolean', () => {
        render(<UserTable data={mockUsers}/>);

        // Ponieważ Badge ze statusem ma twardo wpisany tekst w zależności od propsa `status`
        expect(screen.getByText('Active')).toBeInTheDocument();
        expect(screen.getByText('Inactive')).toBeInTheDocument();
    });

    it('powinien wyrenderować empty state gdy przekazano pustą tablicę', () => {
        render(<UserTable data={[]}/>);

        // Weryfikacja fallbacku, gdy brakuje wyników z API
        expect(screen.getByText('Brak użytkowników pasujących do kryteriów.')).toBeInTheDocument();
    });

    it('powinien poprawnie wywoływać callbacki onEdit oraz onDelete po kliknięciu akcji', () => {
        // vi.fn() tworzy szpiegów (spies), którzy pozwalają sprawdzić, czy funkcje zostały wywołane
        const onEditMock = vi.fn();
        const onDeleteMock = vi.fn();

        render(
            <UserTable
                data={[mockUsers[0]]}
                onEdit={onEditMock}
                onDelete={onDeleteMock}
            />
        );

        // Szukamy przycisków po ich atrybucie aria-label, który zdefiniowaliśmy w ActionIconButton
        const editButton = screen.getByLabelText(`Edit ${mockUsers[0].firstName}`);
        const deleteButton = screen.getByLabelText(`Delete ${mockUsers[0].firstName}`);

        fireEvent.click(editButton);
        expect(onEditMock).toHaveBeenCalledTimes(1);
        expect(onEditMock).toHaveBeenCalledWith(mockUsers[0]);

        fireEvent.click(deleteButton);
        expect(onDeleteMock).toHaveBeenCalledTimes(1);
        expect(onDeleteMock).toHaveBeenCalledWith(mockUsers[0]);
    });
});