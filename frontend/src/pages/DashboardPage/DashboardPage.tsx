import {useState} from 'react';
import {UserTable} from "../../components/users/UserTable/UserTable";
import {UserTableSkeleton} from "../../components/users/UserTable/UserTableSkeleton";
import {TablePagination} from "../../components/common/Table/TablePagination";
import {TablePageLayout} from "../../components/layout/TablePageLayout/TablePageLayout";
import {useUsersList} from "../../hooks/useUsers";
import {PAGE_SIZE} from '../../constants/paginations';
import {Modal} from "../../components/common/Modal/Modal";
import {Button} from "../../components/common/Button/Button";
import styles from './DashboardPage.module.css';

export const DashboardPage = () => {
    const [page, setPage] = useState(0);

    // Stan kontrolujący widoczność okna modalnego
    const [isModalOpen, setIsModalOpen] = useState(false);

    // isPending - stan inicjalny, np. przy wejściu na stronę nie mamy żadnych danych w cashe'u,
    // to faza "twardego ładowania", isPending używamy chwilowego zablokowania rednerowania tabeli
    // i wstrzyknięcia w te miejsce Skeletona

    // isFetching - stan odświeżania, żądanie sieciowe jest w toku, ale mamy dane w cache
    // nie pokazujemy tu znowu Skeletona, bo użytkownik widziałby ciągle agresywne migotanie tabeli
    // isFetching używamy do obniżenia opacity tabeli i zablokowania kliknięć w trakcie przełączania stron
    // (pointer-events: none)
    const {data, isPending, isFetching, isError} = useUsersList(page, PAGE_SIZE);

    if (isError) {
        return (
            <div className={styles.errorMessage}>
                Error retrieving data. Check if the Spring Boot server is running.
            </div>
        );
    }

    const pageHeader = (
        <div className={styles.headerContainer}>
            <div className={styles.headerTitles}>
                <h1 className={styles.pageTitle}>All employees</h1>
            </div>
            <Button
                variant="primary"
                onClick={() => setIsModalOpen(true)}
            >
                + Add Employee
            </Button>
        </div>
    );

    // TODO: Sekcja statystyk Dashboardu i wyszukiwania oraz filtry 
    // const statsTopContent = (
    //     <div className={styles.statsPlaceholder}>
    //         {/* Tutaj kiedyś trafi komponent <DashboardStats /> */}
    //     </div>
    // );

    // const searchAndFilters = (
    //     <div className={styles.filtersPlaceholder}>
    //         {/* Tutaj trafi <ExpertFilterPanel /> zintegrowany z POST /search */}
    //     </div>
    // );

    return (
        <>
            <TablePageLayout
                header={pageHeader}
                // Sekcja statystyk Dashboardu i wyszukiwania oraz filtrów
                // topContent={statsTopContent}
                // filters={searchAndFilters}
                table={
                    isPending ? (
                        // Skeleton ładuje się tylko raz (pierwsze wejście)
                        <UserTableSkeleton rows={PAGE_SIZE}/>
                    ) : (
                        // Wrapper obsługuje przezroczystość podczas przełączania stron
                        <div className={`${styles.tableWrapper} ${isFetching ? styles.isFetching : ''}`}>
                            <UserTable
                                data={data?.content || []}
                                onEdit={(user) => console.log(`Open the edit user modal for ID: ${user.id}`)}
                                onDelete={(user) => console.log(`Start the deletion process for ID: ${user.id}`)}
                            />
                        </div>
                    )
                }
                pagination={
                    // Usunięto redundantny warunek (data.totalPages > 1), komponent paginacji robi to sam
                    data ? (
                        <TablePagination
                            number={data.number ?? 0}
                            size={data.size ?? PAGE_SIZE}
                            totalElements={data.totalElements ?? 0}
                            totalPages={data.totalPages ?? 0}
                            onPageChange={setPage}
                        />
                    ) : null
                }
            />

            <Modal
                title="Add Employee"
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                {/* Tymczasowy kontener oparty ściśle na tokenach z tokens.css */}
                <div style={{
                    padding: 'var(--space-4)',
                    backgroundColor: 'var(--color-bg-surface-hover)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-family-sans)',
                    textAlign: 'center'
                }}>
                    <p>System Diagnostics: Modal Portal Rendered Successfully.</p>
                    <p style={{color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)'}}>
                        Place for the form to add a new employee. This is a placeholder for future implementation.
                    </p>
                </div>
            </Modal>
        </>
    );
};