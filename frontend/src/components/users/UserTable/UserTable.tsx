import type {UserListItem} from '../../../types/users';
import {type ColumnDefinition, Table} from '../../common/Table/Table';
import {Badge, type LevelRank} from '../../common/Badge/Badge';
import {UserAvatar} from '../../common/UserAvatar/UserAvatar';
import {ActionIconButton} from '../../common/IconButton/ActionIconButton';
import styles from './UserTable.module.css';

// Zakładam standardową ścieżkę do ikon zgodnie z naszą strukturą
import editIcon from '../../../assets/icons/Edit.svg';
import deleteIcon from '../../../assets/icons/Delete.svg';

interface UserTableProps {
    data: UserListItem[];
    // Opcjonalne callbacki, które przekażemy wyżej do Smart Componentu (DashboardPage)
    onEdit?: (user: UserListItem) => void;
    onDelete?: (user: UserListItem) => void;
}

export function UserTable({data, onEdit, onDelete}: UserTableProps) {
    const columns: ColumnDefinition<UserListItem>[] = [
        {
            header: 'ID',
            accessor: (user) => <span className={styles.cellId}>{user.id}</span>,
            width: '60px',
        },
        {
            header: 'USER',
            accessor: (user) => (
                <div className={styles.cellUser}>
                    <UserAvatar altText={`${user.firstName} ${user.lastName}`}/>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>{user.firstName} {user.lastName}</span>
                        <span className={styles.userEmail}>{user.email}</span>
                    </div>
                </div>
            ),
        },
        {
            header: 'DOMAINS',
            accessor: (user) => (
                <div className={styles.skillList}>
                    {user.skills?.map((skill, index) => (
                        <Badge
                            key={`${skill.domainName}-${index}`}
                            variant="skill"
                            level={skill.rankValue as LevelRank}
                            domainName={skill.domainName}
                            levelName={skill.levelName}
                        />
                    ))}
                </div>
            ),
        },
        {
            header: 'ROLE',
            accessor: (user) => (
                <span className={styles.cellRole}>
                    {user.roles && user.roles.length > 0
                        ? user.roles.map(role => role.replace('ROLE_', '')).join(', ')
                        : '—'}
                </span>
            ),
            width: '100px',
        },
        {
            header: 'STATUS',
            accessor: (user) => (
                <Badge
                    variant="status"
                    status={user.active ? 'active' : 'inactive'}
                />
            ),
            width: '120px',
        },
        {
            header: 'ACTIONS',
            accessor: (user) => (
                <div className={styles.cellActions}>
                    <ActionIconButton
                        iconSource={editIcon}
                        altText={`Edit ${user.firstName}`}
                        title="Edit User"
                        onClick={() => onEdit?.(user)}
                    />
                    <ActionIconButton
                        iconSource={deleteIcon}
                        variant="danger"
                        altText={`Delete ${user.firstName}`}
                        title="Delete User"
                        onClick={() => onDelete?.(user)}
                    />
                </div>
            ),
            width: '100px',
        },
    ];

    return (
        <div className={styles.userTableWrapper}>
            <Table
                data={data}
                columns={columns}
                emptyMessage="No users found matching the criteria."
            />
        </div>
    );
}