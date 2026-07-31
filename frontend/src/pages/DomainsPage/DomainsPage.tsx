import React, {useMemo, useState} from 'react';
import {DomainTable} from '../components/domains/DomainTable/DomainTable.tsx';
import {TablePagination} from '../components/common/Table/TablePagination';
import type {Domain, DomainPageDto} from '../types/users';

const ALL_MOCK_DOMAINS: Domain[] = [
    {id: 1, name: 'Java', description: 'General-purpose object-oriented language for enterprise backend systems'},
    {id: 2, name: 'Spring', description: 'Java framework for building production-ready microservices'},
    {id: 3, name: 'React', description: 'Declarative component-based UI library for building interactive interfaces'},
    {id: 4, name: 'SQL', description: 'Structured query language for relational database management and analytics'},
    {id: 5, name: 'Docker', description: 'Containerisation platform for packaging and running isolated applications'},
    {id: 6, name: 'Kubernetes', description: 'Container orchestration system for automating deployment and scaling'},
    {id: 7, name: 'Python', description: 'Interpreted high-level language used for scripting, data, and automation'},
    {id: 8, name: 'AWS', description: 'Amazon cloud platform providing compute, storage, and managed services'},
    {id: 9, name: 'TypeScript', description: 'Strongly-typed superset of JavaScript for scalable web application code'},
    {id: 10, name: 'PostgreSQL', description: 'Advanced open-source relational database with rich SQL compliance'},
    {id: 11, name: 'Angular', description: 'Component-based framework for building scalable web applications'},
    {id: 12, name: 'C#', description: 'Modern, object-oriented, and type-safe programming language'}
];

export const DomainsPage: React.FC = () => {
    // Numeracja stron od 0 - zgadza się ze specyfikacją Spring Boota i OpenAPI[cite: 6].
    const [page, setPage] = useState<number>(0);
    const pageSize = 10;

    const paginatedData: DomainPageDto = useMemo(() => {
        const totalElements = ALL_MOCK_DOMAINS.length;
        const totalPages = Math.ceil(totalElements / pageSize);

        const content = ALL_MOCK_DOMAINS.slice(page * pageSize, (page + 1) * pageSize);

        return {
            content,
            totalElements,
            totalPages,
            number: page,
            size: pageSize
        };
    }, [page]);

    // ZMIANA: Przechwytujemy cały obiekt Domain wysyłany przez DomainTable
    const handleEdit = (domain: Domain) => {
        console.log(`Akcja: Edytuj domenę o ID: ${domain.id}`);
    };

    // ZMIANA: Przechwytujemy cały obiekt Domain wysyłany przez DomainTable
    const handleDelete = (domain: Domain) => {
        console.log(`Akcja: Usuń domenę o ID: ${domain.id}`);
    };

    return (
        <div>

            <DomainTable
                data={paginatedData.content || []}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <TablePagination
                number={paginatedData.number ?? 0}
                size={paginatedData.size ?? 10}
                totalElements={paginatedData.totalElements ?? 0}
                totalPages={paginatedData.totalPages ?? 1}
                onPageChange={setPage}
            />
        </div>
    );
};