// src/components/layout/TablePageLayout/TablePageLayout.tsx
import type {ReactNode} from 'react';
import React from 'react';
import styles from './TablePageLayout.module.css';

interface TablePageLayoutProps {
    header: ReactNode;
    topContent?: ReactNode; // Opcjonalne - dla statystyk na Dashboardzie
    filters?: ReactNode;    // Opcjonalne - dla inputów i reguł wyszukiwania
    table: ReactNode;
    pagination: ReactNode;
}

export const TablePageLayout: React.FC<TablePageLayoutProps> = ({
                                                                    header,
                                                                    topContent,
                                                                    filters,
                                                                    table,
                                                                    pagination
                                                                }) => {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.headerSection}>
                {header}
            </div>

            {/* Warunkowe renderowanie opcjonalnych sekcji układu */}
            {topContent && (
                <div className={styles.topContentSection}>
                    {topContent}
                </div>
            )}

            {filters && (
                <div className={styles.filtersSection}>
                    {filters}
                </div>
            )}

            <div className={styles.tableContainer}>
                {table}
            </div>

            <div className={styles.paginationContainer}>
                {pagination}
            </div>
        </div>
    );
};