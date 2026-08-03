import {useState} from 'react';
import {DomainTable} from '../../components/domains/DomainTable/DomainTable';
// TODO: Import DomainTableSkeleton, gdy zostanie utworzony
import {TablePagination} from '../../components/common/Table/TablePagination';
import {TablePageLayout} from '../../components/layout/TablePageLayout/TablePageLayout';
import {PAGE_SIZE, useDomainsList} from '../../hooks/useDomainsList';
import styles from './DomainsPage.module.css';

export const DomainsPage = () => {
    const [page, setPage] = useState<number>(0);

    // Pełna kontrola nad cyklem życia zapytania sieciowego
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
                    // TODO: Skeleton blokuje układ (zapobiega skakaniu Layoutu)
                    <div className={styles.skeletonPlaceholder}>Loading domains...</div>
                ) : (
                    // Background refetch -> obniżamy opacity obecnej tabeli
                    <div
                        className={styles.tableTransitionWrapper}
                        style={{opacity: isFetching ? 0.6 : 1}}
                    >
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