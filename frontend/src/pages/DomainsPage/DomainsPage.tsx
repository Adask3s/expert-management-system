import {useState} from 'react';
import type {Domain} from '../../types/users.ts';
import {DomainTable} from '../../components/domains/DomainTable/DomainTable';
import {TablePagination} from '../../components/common/Table/TablePagination';
import {TablePageLayout} from '../../components/layout/TablePageLayout/TablePageLayout';
import {useDeleteDomain, useDomainsList} from '../../hooks/useDomainsList';
import {useAuth} from '../../hooks/useAuth'
import {DomainTableSkeleton} from "../../components/domains/DomainTable/DomainTableSkeleton";
import {ConfirmModal} from '../../components/common/Modal/ConfirmModal.tsx';
import {PAGE_SIZE} from '../../constants/paginations';
import {Modal} from "../../components/common/Modal/Modal";
import {AddDomainForm} from "../../components/domains/AddDomainForm/AddDomainForm";
import styles from './DomainsPage.module.css';

export const DomainsPage = () => {
    const [page, setPage] = useState<number>(0);
    const {isAdmin} = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [domainToDelete, setDomainToDelete] = useState<Domain | null>(null);

    const {mutate: deleteDomain, isPending: isDeleting} = useDeleteDomain();
    const {data, isPending, isFetching, isError} = useDomainsList(page);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Obsługa potwierdzenia usunięcia domeny
    const handleConfirmDelete = () => {
        if (!domainToDelete) return;

        deleteDomain(domainToDelete.id, {
            onSuccess: () => {
                setDomainToDelete(null);
            },
        });
    };

    const pageHeader = (
        <div className={styles.headerContainer}>
            <div className={styles.headerTitles}>
                <h1 className={styles.pageTitle}>All Domains</h1>
            </div>
            {isAdmin &&
                (<button className={styles.primaryButton} onClick={openModal}>
                    + Add New Domain
                </button>)}
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
                                onDelete={(domain) => setDomainToDelete(domain)}
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

            <ConfirmModal
                isOpen={!!domainToDelete}
                onClose={() => setDomainToDelete(null)}
                onConfirm={handleConfirmDelete}
                title={`Delete domain "${domainToDelete?.name}"?`}
                description="This action cannot be undone. The domain and its associations will be permanently removed."
                confirmText="Delete"
                variant="danger"
                isLoading={isDeleting}
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