import {useState} from 'react';
import {UserTable} from "../components/users/UserTable/UserTable.tsx";
import {UserTableSkeleton} from "../components/users/UserTable/UserTableSkeleton.tsx";
import {TablePagination} from "../components/common/Table/TablePagination.tsx";
import {useUsersList} from "../hooks/useUsers.ts";

export const DashboardPage = () => {
    // Stan lokalny paginacji
    // Zgodnie ze specyfikacją OpenAPI, Spring domyślnie startuje od strony 0
    const [page, setPage] = useState(0);

    // Asynchroniczne pobieranie danych za pomocą przygotowanego hooka
    // Rozmiar strony (size) ustawiamy na 10, zgodnie z domyślnym parametrem API
    const {data, isLoading, isError} = useUsersList(page, 10);

    // Obsługa błędu - fallback UI przy użyciu odpowiednich tokenów
    if (isError) {
        return (
            <div style={{color: 'var(--color-error)', padding: 'var(--space-4)'}}>
                Error retrieving data. Check if the Spring Boot server is running.
            </div>
        );
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-6)'}}>
            <main style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
                {/* Warunkowe renderowanie: Skeleton vs Właściwa Tabela */}
                {isLoading ? (
                    <UserTableSkeleton rows={10}/>
                ) : (
                    <>
                        <UserTable
                            // Pobieramy wygenerowaną przez OpenAPI tablicę 'content'
                            data={data?.content || []}
                            onEdit={(user) => console.log(`Open the edit user modal for ID: ${user.id}`)}
                            onDelete={(user) => console.log(`Start the deletion process for ID: ${user.id}`)}
                        />

                        {/* Paginacja bazująca na prawdziwych metadanych ze Spring Data JPA */}
                        {data && (data.totalPages ?? 0) > 1 && (
                            <TablePagination
                                number={data.number ?? 0}
                                size={data.size ?? 10}
                                totalElements={data.totalElements ?? 0}
                                totalPages={data.totalPages ?? 0}
                                onPageChange={(newPage) => setPage(newPage)}
                            />
                        )}
                    </>
                )}
            </main>
        </div>
    );
};