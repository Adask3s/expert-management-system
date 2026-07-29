/**
 * Scenariusze testowe pokrywają:
 *
 * 1) Edge case braku danych: Komponent nie powinien renderować żadnego markupu (pusty DOM),
 *    gdy tabela jest pusta (totalElements === 0). Zabezpiecza to przed błędnym widokiem "0 - 0 of 0".
 *
 * 2) Obliczenia środkowe (Happy Path): Poprawne wyliczanie widocznego zakresu rekordów
 *    (np. "11 - 20 of 25") oraz numeru strony dla użytkownika (np. "2 / 3") na podstawie
 *    wewnętrznego indeksowania (indeksowanie stron od 0).
 *
 * 3) Edge case końca listy: Bezpieczne ucięcie górnej granicy zakresu na ostatniej stronie,
 *    aby uniknąć logicznego błędu wyświetlania np. "21 - 30 of 25" (zamiast prawidłowego "21 - 25 of 25").
 *
 * 4) Logikę blokowania interakcji (Disabled states): Przycisk "Previous" musi być zablokowany
 *    na pierwszej stronie, a przycisk "Next" na ostatniej, zapobiegając wyjściu poza zakres stron.
 *
 * 5) Kontrakt komunikacyjny (Callback): Weryfikacja, czy kliknięcie w aktywne przyciski poprawnie
 *    wywołuje przekazaną funkcję (onPageChange) z poprawnie zaktualizowanym argumentem.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TablePagination } from './TablePagination';

describe('TablePagination Component', () => {
    // Definiujemy mock funkcji do nasłuchiwania interakcji
    const mockOnPageChange = vi.fn();

    // Czyścimy stan mocka przed każdym testem, aby testy były od siebie niezależne
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('nie powinien renderować komponentu gdy totalElements wynosi 0', () => {
        // Arrange
        const { container } = render(
            <TablePagination
                number={0}
                size={10}
                totalElements={0}
                totalPages={1}
                onPageChange={mockOnPageChange}
            />
        );

        // Assert
        expect(container).toBeEmptyDOMElement();
    });

    it('powinien poprawnie wyliczyć i wyświetlić zakres rekordów w środku listy', () => {
        // Arrange
        render(
            <TablePagination
                number={1} // Druga strona (indeksowana od 0)
                size={10}
                totalElements={25}
                totalPages={3}
                onPageChange={mockOnPageChange}
            />
        );

        // Assert - Oczekujemy tekstu "11 - 20 of 25"
        expect(screen.getByText(/11\s*-\s*20\s*of\s*25/i)).toBeInTheDocument();
        expect(screen.getByText(/2\s*\/\s*3/i)).toBeInTheDocument(); // Strony dla użytkownika liczymy od 1
    });

    it('powinien poprawnie uciąć zakres rekordów na ostatniej stronie', () => {
        // Arrange
        render(
            <TablePagination
                number={2} // Trzecia (ostatnia) strona
                size={10}
                totalElements={25}
                totalPages={3}
                onPageChange={mockOnPageChange}
            />
        );

        // Assert - Zakres nie może przekroczyć totalElements
        expect(screen.getByText(/21\s*-\s*25\s*of\s*25/i)).toBeInTheDocument();
    });

    it('powinien zablokować przycisk "Previous" na pierwszej stronie i "Next" na ostatniej', () => {
        // Arrange - Pierwsza strona
        const { rerender } = render(
            <TablePagination
                number={0}
                size={10}
                totalElements={25}
                totalPages={3}
                onPageChange={mockOnPageChange}
            />
        );

        // Assert - Pierwsza strona
        expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /next page/i })).not.toBeDisabled();

        // Arrange - Rerender na ostatnią stronę
        rerender(
            <TablePagination
                number={2}
                size={10}
                totalElements={25}
                totalPages={3}
                onPageChange={mockOnPageChange}
            />
        );

        // Assert - Ostatnia strona
        expect(screen.getByRole('button', { name: /previous page/i })).not.toBeDisabled();
        expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();
    });

    it('powinien wywołać funkcję onPageChange z poprawnym argumentem po kliknięciu', async () => {
        // Arrange
        const user = userEvent.setup();
        render(
            <TablePagination
                number={1}
                size={10}
                totalElements={25}
                totalPages={3}
                onPageChange={mockOnPageChange}
            />
        );

        const prevButton = screen.getByRole('button', { name: /previous page/i });
        const nextButton = screen.getByRole('button', { name: /next page/i });

        // Act - Kliknięcie wstecz
        await user.click(prevButton);
        // Assert
        expect(mockOnPageChange).toHaveBeenCalledTimes(1);
        expect(mockOnPageChange).toHaveBeenCalledWith(0); // Przejście z currentPage: 1 na 0

        // Act - Kliknięcie do przodu
        await user.click(nextButton);
        // Assert
        expect(mockOnPageChange).toHaveBeenCalledTimes(2);
        expect(mockOnPageChange).toHaveBeenCalledWith(2); // Przejście z currentPage: 1 na 2
    });
});