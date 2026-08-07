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
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import type {ReactElement} from 'react';
import {describe, expect, it, vi} from 'vitest';
import {UserTable} from './UserTable';
import type {UserListItem} from '../../../types/users'; // Upewnij się co do ścieżki

vi.mock('../../../hooks/useAuth', () => ({
    useAuth: () => ({
        user: {roles: ['ROLE_ADMIN']},
        isAdmin: true,
        isLoading: false,
    }),
}));

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

function renderWithQueryClient(ui: ReactElement) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>
    );
}

describe('UserTable Component', () => {

    it('should render the table with user data correctly', () => {
        renderWithQueryClient(<UserTable data={mockUsers}/>);

        // Verify rendering of text data
        expect(screen.getByText('Paweł Matujewicz')).toBeInTheDocument();
        expect(screen.getByText('pawel.matujewicz@corp.io')).toBeInTheDocument();
        expect(screen.getByText('Katarzyna Nowak')).toBeInTheDocument();

        // Verify role parsing (remove ROLE_ prefix)
        expect(screen.getByText('Admin')).toBeInTheDocument();

        // Verify domain badges
        expect(screen.getByText('Java')).toBeInTheDocument();
        expect(screen.getByText('Professional')).toBeInTheDocument();
    });

    it('should render Active/Inactive status based on boolean value', () => {
        renderWithQueryClient(<UserTable data={mockUsers}/>);

        // Badge status text is hardcoded based on the provided status prop
        expect(screen.getByText('Active')).toBeInTheDocument();
        expect(screen.getByText('Inactive')).toBeInTheDocument();
    });

    it('should render the empty state when an empty array is passed', () => {
        renderWithQueryClient(<UserTable data={[]}/>);

        // Verify fallback when the API returns no results
        expect(screen.getByText('No users found matching the criteria.')).toBeInTheDocument();
    });

    it('should correctly call onEdit and onDelete callbacks when actions are clicked', () => {
        // vi.fn() creates spies to verify whether functions were called
        const onEditMock = vi.fn();
        const onDeleteMock = vi.fn();

        renderWithQueryClient(
            <UserTable
                data={[mockUsers[0]]}
                onEdit={onEditMock}
                onDelete={onDeleteMock}
            />
        );

        // Search for buttons by their aria-label attribute defined in ActionIconButton
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