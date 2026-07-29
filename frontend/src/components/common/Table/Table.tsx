import type {ReactNode} from "react"
import styles from './Table.module.css';

export interface ColumnDefinition<T> {
    header: string // tytuł kolumny wyświetlany w nagłówku tabeli <thead>
    accessor: (row: T) => ReactNode // funkcja wyciągająca i formatująca dane do komórki
    width?: string // opcjonalna szerokość kolumny
}

export interface TableProps<T> {
    columns: ColumnDefinition<T>[] // definicje kolumn tabeli
    data: T[] // dane do wyświetlenia w tabeli
    pagination?: ReactNode; // slot na TablePagination, opcjonalny, bo np. może być zbyt wało rekordów do paginacji
    emptyMessage?: string; // opcjonalna wiadomość wyświetlana, gdy tabela jest pusta
}

export function Table<T>({columns, data, pagination, emptyMessage = 'No data available.'}: TableProps<T>) {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.tableElement}>
                <thead>
                <tr>
                    {columns.map((col, index) => (
                        <th key={index} style={{width: col.width}}>
                            {col.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.length === 0 ? (
                    <tr>
                        <td colSpan={columns.length} className={styles.tableEmptyState}>
                            {emptyMessage}
                        </td>
                    </tr>
                ) : (
                    data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((col, colIndex) => (
                                <td key={colIndex}>
                                    {col.accessor(row)}
                                </td>
                            ))}
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            {/* Renderowanie paginacji, jeśli została przekazana i są dane */}
            {pagination && data.length > 0 && (
                <div className={styles.tablePaginationSlot}>
                    {pagination}
                </div>
            )}
        </div>
    );
}