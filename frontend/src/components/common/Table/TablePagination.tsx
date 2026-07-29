import styles from './TablePagination.module.css';

// Zmienne zgodne z kontraktem - number to current page, size to page size, 
export interface TablePaginationProps {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function TablePagination({
    number,
    size,
    totalElements,
    totalPages,
    onPageChange,
}: TablePaginationProps) {

    // Zabezpieczenie przed pustą listą wyników lub jedną stroną, w której paginacja nie jest potrzebna
    if (totalPages <= 1 || totalElements === 0) {
        return null; // Nie renderujemy paginacji, jeśli jest tylko jedna strona
    }

    const isFirstPage = number === 0;
    const isLastPage = number === totalPages - 1;

    // Logika do wyświetlania zakresu rekordów (np. "1-10 of 245")

    // Jesteśmy na stronie 0 (pierwsza), size to 10. 0 * 10 + 1 = 1
    const startRow = number * size + 1;
    // Strona 0, rozmiar 10. (0 + 1) * 10 = 10. Funkcja Math.min(10, totalElements) wybiera mniejszą wartość
    const endRow = Math.min((number + 1) * size, totalElements);

    return (
        <div className={styles.container}>

            {/* Wyświetlamy informację o zakresie rekordów */}
            <span className={styles.info}>
                {startRow}-{endRow} of {totalElements}

            </span>

            {/* dodatkowy konterner dla przycisków nawigacyjnych, aby kontrolować odstęp */}
            <div className={styles.controls}>
                <button
                    className={styles.button}
                    onClick={() => onPageChange(number - 1)}
                    disabled={isFirstPage}
                    aria-label="Previous page"
                >
                    &lt; {/* Znak "<" reprezentujący strzałkę w lewo */}
                </button>

                {/* Wyświetlamy aktualną stronę i całkowitą liczbę stron */}
                <span className={styles.pages}>
                    {number + 1} / {totalPages}
                </span>

                <button
                    className={styles.button}
                    onClick={() => onPageChange(number + 1)}
                    disabled={isLastPage}
                    aria-label="Next page"
                >
                    &gt; {/* Znak ">" reprezentujący strzałkę w prawo */}
                </button>
            </div>
        </div>
    );
}