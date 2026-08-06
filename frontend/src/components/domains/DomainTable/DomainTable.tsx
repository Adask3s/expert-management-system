import type {Domain, DomainRequest} from '../../../types/users';
import {type ColumnDefinition, Table} from '../../common/Table/Table';
import {ActionIconButton} from '../../common/IconButton/ActionIconButton';
import {DomainAvatar} from '../../common/DomainAvatar/DomainAvatar';
import styles from './DomainTable.module.css';
import {useState} from 'react';
import {useUpdateDomain} from '../../../hooks/useUpdateDomain';
import {Button} from '../../common/Button/Button';

import editIcon from '../../../assets/icons/Edit.svg';
import deleteIcon from '../../../assets/icons/Delete.svg';

interface DomainTableProps {
    data: Domain[];
    pagination?: React.ReactNode;
    onEdit?: (domain: Domain) => void;
    onDelete?: (domain: Domain) => void;
}

export function DomainTable({data, pagination, onEdit, onDelete}: DomainTableProps) {
    // Przechowuje id wiersza, który jest obecnie w trakcie edycji
    const [editingId, setEditingId] = useState<number | null>(null);

    // Przechowuje wartości pól obecnie edytowanej domeny
    const [editForm, setEditForm] = useState<DomainRequest>({
        name: '',
        description: '',
    });

    const updateDomainMutation = useUpdateDomain();

    // start edit
    const handleStartEdit = (domain: Domain) => {
        if (domain.id !== undefined) {
            setEditingId(domain.id);
            setEditForm({
                name: domain.name ?? '',
                description: domain.description ?? '',
            });
        }
    };

    // cancel edit
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({name: '', description: ''});
    };

    // save edit
    const handleSaveEdit = (id: number) => {
        updateDomainMutation.mutate(
            {id, payload: editForm},
            {
                onSuccess: () => {
                    handleCancelEdit();
                },
            }
        );
    };

    const columns: ColumnDefinition<Domain>[] = [
        {
            header: 'ID',
            accessor: (domain) => <span className={styles.cellId}>{domain.id}</span>,
            width: '60px',
        },
        {
            header: 'DOMAIN NAME',
            accessor: (domain) => {
                const isEditing = domain.id === editingId;

                return (
                    <div className={styles.cellDomain}>
                        <DomainAvatar/>
                        {isEditing ? (
                            <input
                                type="text"
                                className={styles.tableInput}
                                value={editForm.name}
                                onChange={(e) =>
                                    setEditForm((prev) => ({...prev, name: e.target.value}))
                                }
                                placeholder="Domain name"
                            />
                        ) : (
                            <span className={styles.domainName}>{domain.name}</span>
                        )}
                    </div>
                );
            },
            width: '250px',
        },
        {
            header: 'DESCRIPTION',
            accessor: (domain) => {
                const isEditing = domain.id === editingId;

                return isEditing ? (
                    <input
                        type="text"
                        className={styles.tableInput}
                        value={editForm.description}
                        onChange={(e) =>
                            setEditForm((prev) => ({...prev, description: e.target.value}))
                        }
                        placeholder="Description"
                    />
                ) : (
                    <span className={styles.cellDescription}>{domain.description}</span>
                );
            },
        },
        {
            header: 'ACTIONS',
            accessor: (domain) => {
                const isEditing = domain.id === editingId;

                // wiersz jest edytowany -> pokazujemy save i cancel
                if (isEditing && domain.id !== undefined) {
                    return (
                        <div className={styles.cellActions}>
                            <Button
                                variant="primary"
                                onClick={() => handleSaveEdit(domain.id!)}
                                disabled={updateDomainMutation.isPending || !editForm.name.trim()}
                            >
                                {updateDomainMutation.isPending ? 'Saving...' : 'Save'}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={handleCancelEdit}
                                disabled={updateDomainMutation.isPending}
                            >
                                Cancel
                            </Button>
                        </div>
                    );
                }

                // wiersz nie jest edytowany
                return (
                    <div className={styles.cellActions}>
                        <ActionIconButton
                            iconSource={editIcon}
                            altText={`Edit domain ${domain.name}`}
                            title="Edit Domain"
                            onClick={() => handleStartEdit(domain)}
                        />
                        <ActionIconButton
                            iconSource={deleteIcon}
                            variant="danger"
                            altText={`Delete domain ${domain.name}`}
                            title="Delete Domain"
                            onClick={() => onDelete?.(domain)}
                        />
                    </div>
                );
            },
            width: '300px',
            align: 'right',
        },
    ];

    return (
        <div className={styles.tableWrapper}>
            <Table
                data={data}
                columns={columns}
                pagination={pagination}
                emptyMessage="No domains available."
            />
        </div>
    );
}