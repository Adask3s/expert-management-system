import type {Domain} from '../../../types/users';
import {type ColumnDefinition, Table} from '../../common/Table/Table';
import {ActionIconButton} from '../../common/IconButton/ActionIconButton';
import {DomainAvatar} from '../../common/DomainAvatar/DomainAvatar';
import styles from './DomainTable.module.css';

import editIcon from '../../../assets/icons/Edit.svg';
import deleteIcon from '../../../assets/icons/Delete.svg';

interface DomainTableProps {
    data: Domain[];
    pagination?: React.ReactNode;
    onEdit?: (domain: Domain) => void;
    onDelete?: (domain: Domain) => void;
}

export function DomainTable({data, pagination, onEdit, onDelete}: DomainTableProps) {
    const columns: ColumnDefinition<Domain>[] = [
        {
            header: 'ID',
            accessor: (domain) => <span className={styles.cellId}>{domain.id}</span>,
            width: '60px',
        },
        {
            header: 'DOMAIN NAME',
            accessor: (domain) => (
                <div className={styles.cellDomain}>
                    <DomainAvatar/>
                    <span className={styles.domainName}>{domain.name}</span>
                </div>
            ),
            width: '250px',
        },
        {
            header: 'DESCRIPTION',
            accessor: (domain) => (
                <span className={styles.cellDescription}>{domain.description}</span>
            ),
        },
        {
            header: 'ACTIONS',
            accessor: (domain) => (
                <div className={styles.cellActions}>
                    <ActionIconButton
                        iconSource={editIcon}
                        altText={`Edit domain ${domain.name}`}
                        title="Edit Domain"
                        onClick={() => onEdit?.(domain)}
                    />
                    <ActionIconButton
                        iconSource={deleteIcon}
                        variant="danger"
                        altText={`Delete domain ${domain.name}`}
                        title="Delete Domain"
                        onClick={() => onDelete?.(domain)}
                    />
                </div>
            ),
            width: '100px',
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