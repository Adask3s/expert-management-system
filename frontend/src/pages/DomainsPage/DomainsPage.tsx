import React, {useMemo, useState} from 'react';
import {DomainTable} from '../../components/domains/DomainTable/DomainTable.tsx';
import {TablePagination} from '../../components/common/Table/TablePagination';
import {TablePageLayout} from '../../components/layout/TablePageLayout/TablePageLayout';
import type {Domain, DomainPageDto} from '../../types/users';
import styles from './DomainsPage.module.css';


const ALL_MOCK_DOMAINS: Domain[] = [
    {id: 1, name: 'Java', description: 'Core Java development'},
    {id: 2, name: 'React', description: 'Frontend UI development'},
    {id: 3, name: 'TypeScript', description: 'Strongly typed JavaScript'},
    {id: 4, name: 'Node.js', description: 'Server-side JavaScript'},
    {id: 5, name: 'SQL', description: 'Database querying'},
    {id: 6, name: 'Spring Boot', description: 'Enterprise Java applications'},
    {id: 7, name: 'AWS', description: 'Cloud infrastructure'},
    {id: 8, name: 'Docker', description: 'Containerization'},
    {id: 9, name: 'Kubernetes', description: 'Container orchestration'},
    {id: 10, name: 'Python', description: 'General-purpose programming'},
    {id: 11, name: 'GraphQL', description: 'API query language'},
];

export const DomainsPage: React.FC = () => {
    const [page, setPage] = useState<number>(0);
    const pageSize = 10;

    const paginatedData: DomainPageDto = useMemo(() => {
        const startIndex = page * pageSize;
        const endIndex = startIndex + pageSize;
        const content = ALL_MOCK_DOMAINS.slice(startIndex, endIndex);

        return {
            content,
            totalElements: ALL_MOCK_DOMAINS.length,
            totalPages: Math.ceil(ALL_MOCK_DOMAINS.length / pageSize),
            number: page,
            size: pageSize,
        };
    }, [page, pageSize]);

    // TODO: Implement actual edit and delete handlers that interact with the backend API
    // const handleEdit = (domain: Domain) => { /* ... */ };
    // const handleDelete = (domain: Domain) => { /* ... */ };

    // Elementy przygotowane do wstrzyknięcia w Layout
    const pageHeader = (
        <div className={styles.headerContainer}>
            <div className={styles.headerTitles}>
                <h1 className={styles.pageTitle}>All Domains</h1>
            </div>
            <button className={styles.primaryButton}>+ Add New Domain</button>
        </div>
    );

    const searchFilter = (
        <div className={styles.searchContainer}>
            {/* W przyszłości podepniemy tu input zgodny z endpointem GET /domains?name=... */}
            <input type="text" placeholder="Filter domains by name..." className={styles.searchInput}/>
        </div>
    );

    return (
        <TablePageLayout
            header={pageHeader}
            filters={searchFilter}
            table={
                <DomainTable
                    data={paginatedData.content || []}
                    onEdit={undefined}
                    onDelete={undefined}
                />
            }
            pagination={
                <TablePagination
                    number={paginatedData.number ?? 0}
                    size={paginatedData.size ?? pageSize}
                    totalElements={paginatedData.totalElements ?? 0}
                    totalPages={paginatedData.totalPages ?? 1}
                    onPageChange={setPage}
                />
            }
        />
    );
};