import {useState} from 'react';
import {DomainTable} from '../../components/domains/DomainTable/DomainTable';
// TODO: Import DomainTableSkeleton, gdy zostanie utworzony
import {TablePagination} from '../../components/common/Table/TablePagination';
import {TablePageLayout} from '../../components/layout/TablePageLayout/TablePageLayout';
import {useDomainsList} from '../../hooks/useDomainsList';
import {DomainTableSkeleton} from "../../components/domains/DomainTable/DomainTableSkeleton";
import {PAGE_SIZE} from '../../constants/paginations';
import styles from './DomainsPage.module.css';

export const DomainsPage = () => {
    const [page, setPage] = useState<number>(0);

    // isPending - stan inicjalny, np. przy wejściu na stronę nie mamy żadnych danych w cashe'u,
    // to faza "twardego ładowania", isPending używamy chwilowego zablokowania rednerowania tabeli
    // i wstrzyknięcia w te miejsce Skeletona

    // isFetching - stan odświeżania, żądanie sieciowe jest w toku, ale mamy dane w cache
    // nie pokazujemy tu znowu Skeletona, bo użytkownik widziałby ciągle agresywne migotanie tabeli
    // isFetching używamy do obniżenia opacity tabeli i zablokowania kliknięć w trakcie przełączania stron
    // (pointer-events: none)
    const {data, isPending, isFetching, isError} = useDomainsList(page);

    const pageHeader = (
        <div className={styles.headerContainer}>
            <div className={styles.headerTitles}>
                <h1 className={styles.pageTitle}>All Domains</h1>
            </div>
            <button className={styles.primaryButton}>+ Add New Domain</button>
        </div>
    );

    // Mapujemy strukturę DomainPageDto
    const domains = data?.content ?? [];
    const totalElements = data?.totalElements ?? 0;
    const totalPages = data?.totalPages ?? 1;

    if (isError) {
        return (
            <div className={styles.pageWrapper}>
                <h2 className={styles.errorMessage}>Failed to load domains.</h2>
            </div>
        );
    }

    return (
        <TablePageLayout
            header={pageHeader}
            table={
                isPending ? (
                    // Wstrzykujemy Skeleton, gdy dane są w trakcie ładowania (pierwsze wejście)
                    <DomainTableSkeleton/>
                ) : (
                    // Wrapper obsługuje przezroczystość i blokadę kliknięć podczas przełączania stron
                    <div className={`${styles.tableWrapper} ${isFetching ? styles.isFetching : ''}`}>
                        <DomainTable
                            data={domains}
                            onEdit={undefined}
                            onDelete={undefined}
                        />
                    </div>
                )
            }
            pagination={
                // Paginacja pojawia się dopiero, gdy mamy dane w cache
                data ? (
                    <TablePagination
                        number={page}
                        size={PAGE_SIZE}
                        totalElements={totalElements}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                ) : null
            }
        />
    );
};