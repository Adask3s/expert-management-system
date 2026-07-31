import {useState} from 'react';
import {UserTable} from "../components/users/UserTable/UserTable.tsx";
import {UserTableSkeleton} from "../components/users/UserTable/UserTableSkeleton.tsx";
import {TablePagination} from "../components/common/Table/TablePagination.tsx";
import {TablePageLayout} from "../components/layout/TablePageLayout/TablePageLayout";
import {useUsersList} from "../hooks/useUsers.ts";
import styles from './DashboardPage.module.css';

export const DashboardPage = () => {
    const [page, setPage] = useState(0);
    const {data, isLoading, isError} = useUsersList(page, 10);

    if (isError) {
        // Zgodnie z design systemem używamy var(--color-error)
        return <div className={styles.errorMessage}>Error retrieving data. Check if the Spring Boot server is
            running.</div>;
    }

    const pageHeader = (
        <div className={styles.headerContainer}>
            <div className={styles.headerTitles}>
                <h1 className={styles.pageTitle}>All employees</h1>
            </div>
            <button className={styles.primaryButton}>+ Add Employee</button>
        </div>
    );

    // Placeholder pod statystyki (Total Employees, Active, Masters, Skill Domains) z makiety Dashboard.jpg
    const statsTopContent = (
        <div className={styles.statsPlaceholder}>
            {/* Tutaj trafi komponent <DashboardStats /> */}
        </div>
    );

    // Placeholder pod filtry z operatorem logicznym (AND/OR) i wyszukiwarkę (search)
    const searchAndFilters = (
        <div className={styles.filtersPlaceholder}>
            {/* Tutaj trafi zaawansowany <ExpertFilterPanel /> zintegrowany z POST /search */}
        </div>
    );

    return (
        <TablePageLayout
            header={pageHeader}
            topContent={statsTopContent}
            filters={searchAndFilters}
            table={
                isLoading ? (
                    <UserTableSkeleton rows={10}/>
                ) : (
                    <UserTable
                        data={data?.content || []}
                        onEdit={(user) => console.log(`Open the edit user modal for ID: ${user.id}`)}
                        onDelete={(user) => console.log(`Start the deletion process for ID: ${user.id}`)}
                    />
                )
            }
            pagination={
                data && (data.totalPages ?? 0) > 1 ? (
                    <TablePagination
                        number={data.number ?? 0}
                        size={data.size ?? 10}
                        totalElements={data.totalElements ?? 0}
                        totalPages={data.totalPages ?? 0}
                        onPageChange={setPage}
                    />
                ) : <></>
            }
        />
    );
};