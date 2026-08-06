import {useState} from 'react';
import {DomainTable} from '../../components/domains/DomainTable/DomainTable';
import {TablePagination} from '../../components/common/Table/TablePagination';
import {TablePageLayout} from '../../components/layout/TablePageLayout/TablePageLayout';
import {useDomainsList} from '../../hooks/useDomainsList';
import {DomainTableSkeleton} from "../../components/domains/DomainTable/DomainTableSkeleton";
import {PAGE_SIZE} from '../../constants/paginations';
import {Modal} from "../../components/common/Modal/Modal";
import {AddDomainForm} from "../../components/domains/AddDomainForm/AddDomainForm";
import styles from './DomainsPage.module.css';

export const DomainsPage = () => {
    const [page, setPage] = useState<number>(0);

    const [isModalOpen, setIsModalOpen] = useState(false);

    // isPending - stan inicjalny, np. przy wejściu na stronę nie mamy żadnych danych w cashe'u,
    // to faza "twardego ładowania", isPending używamy chwilowego zablokowania rednerowania tabeli
    // i wstrzyknięcia w te miejsce Skeletona

    // isFetching - stan odświeżania, żądanie sieciowe jest w toku, ale mamy dane w cache
    // nie pokazujemy tu znowu Skeletona, bo użytkownik widziałby ciągle agresywne migotanie tabeli
    // isFetching używamy do obniżenia opacity tabeli i zablokowania kliknięć w trakcie przełączania stron
    // (pointer-events: none)
    const {data, isPending, isFetching, isError} = useDomainsList(page);
    // Funkcje do otwierania i zamykania modala
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const pageHeader = (
        <div className={styles.headerContainer}>
            <div className={styles.headerTitles}>
                <h1 className={styles.pageTitle}>All Domains</h1>
            </div>
            <button className={styles.primaryButton} onClick={openModal}>
                + Add New Domain
            </button>
        </div>
    );

    // Mapujemy strukturę DomainPageDto
    const domains = data?.content ?? [];
    const totalElements = data?.totalElements ?? 0;
    const totalPages = data?.totalPages ?? 1;

    if (isError) {
        return (
            <div className={styles.errorMessage}>
                Error retrieving data. Check if the Spring Boot server is running.
            </div>
        );
    }

    return (
        <>
            <TablePageLayout
                header={pageHeader}
                table={
                    isPending ? (
                        // Wstrzykujemy Skeleton, gdy dane są w trakcie ładowania (pierwsze wejście)
                        <DomainTableSkeleton rows={PAGE_SIZE}/>
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

            <Modal
                title="Add Domain"
                isOpen={isModalOpen}
                onClose={closeModal}
            >
                <AddDomainForm
                    onSuccess={closeModal}
                    onCancel={closeModal}
                />
            </Modal>
        </>
    );
};