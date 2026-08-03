import {useState} from 'react';
import {UserTable} from "../../components/users/UserTable/UserTable";
import {UserTableSkeleton} from "../../components/users/UserTable/UserTableSkeleton";
import {TablePagination} from "../../components/common/Table/TablePagination";
import {TablePageLayout} from "../../components/layout/TablePageLayout/TablePageLayout";
import {PAGE_SIZE, useUsersList} from "../../hooks/useUsers";
import styles from './DashboardPage.module.css';

export const DashboardPage = () => {
    const [page, setPage] = useState(0);

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
            <button className={styles.primaryButton}>+ Add Employee</button>
        </div>
    );

    const statsTopContent = (
        <div className={styles.statsPlaceholder}>
            {/* Tutaj kiedyś trafi komponent <DashboardStats /> */}
        </div>
    );

    const searchAndFilters = (
        <div className={styles.filtersPlaceholder}>
            {/* Tutaj trafi <ExpertFilterPanel /> zintegrowany z POST /search */}
        </div>
    );

    return (
        <TablePageLayout
            header={pageHeader}
            topContent={statsTopContent}
            filters={searchAndFilters}
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
    );
};