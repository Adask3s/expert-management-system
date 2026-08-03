import {useState} from 'react';
import {UserTable} from "../../components/users/UserTable/UserTable";
import {UserTableSkeleton} from "../../components/users/UserTable/UserTableSkeleton";
import {TablePagination} from "../../components/common/Table/TablePagination";
import {PAGE_SIZE, useUsersList} from "../../hooks/useUsers";
import styles from './DashboardPage.module.css';

export const DashboardPage = () => {
    const [page, setPage] = useState(0);

    // Wyciągamy PAGE_SIZE z hooka
    // Używamy isPending do pierwszego ładowania i isFetching do przejść między stronami
    const {data, isPending, isFetching, isError} = useUsersList(page, PAGE_SIZE);

    if (isError) {
        return (
            <div className={styles.errorMessage}>
                Error retrieving data. Check if the Spring Boot server is running.
            </div>
        );
    }

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.mainContent}>
                {isPending ? (
                    // Skeleton ładuje się TYLKO raz, po odświeżeniu strony
                    <UserTableSkeleton rows={PAGE_SIZE}/>
                ) : (
                    // Kontener z tabelą i paginacją, który płynnie przygasa na czas pobierania nowej strony
                    <div className={`${styles.tableWrapper} ${isFetching ? styles.isFetching : ''}`}>
                        <UserTable
                            data={data?.content || []}
                            onEdit={(user) => console.log(`Open the edit user modal for ID: ${user.id}`)}
                            onDelete={(user) => console.log(`Start the deletion process for ID: ${user.id}`)}
                        />

                        {data && (
                            <TablePagination
                                number={data.number ?? 0}
                                size={data.size ?? PAGE_SIZE}
                                totalElements={data.totalElements ?? 0}
                                totalPages={data.totalPages ?? 0}
                                onPageChange={setPage}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};