// frontend/src/components/users/UserProperties/UserSkillsManager/UserSkillsTable.tsx
import {type ColumnDefinition, Table} from '../../../common/Table/Table';
import {Badge, type LevelRank} from '../../../common/Badge/Badge';
import {ActionIconButton} from '../../../common/IconButton/ActionIconButton';
import {DomainAvatar} from '../../../common/DomainAvatar/DomainAvatar';
import type {UserSkillDetail} from '../../../../types/users';
import styles from './UserSkillsTable.module.css';

import editIcon from '../../../../assets/icons/Edit.svg';
import deleteIcon from '../../../../assets/icons/Delete.svg';

interface UserSkillsTableProps {
    skills: UserSkillDetail[];
}

export const UserSkillsTable = ({skills}: UserSkillsTableProps) => {
    const columns: ColumnDefinition<UserSkillDetail>[] = [
        {
            header: 'DOMAIN',
            accessor: (skill) => (
                <div className={styles.domainCell}>
                    {/* Zastępujemy surowy span Twoim inteligentnym komponentem */}
                    <DomainAvatar/>
                    <span className={styles.domainName}>{skill.domainName}</span>
                </div>
            ),
        },
        {
            header: 'EXPERTISE LEVEL',
            accessor: (skill) => (
                <Badge
                    variant="skill"
                    level={skill.rankValue as LevelRank}
                    levelName={skill.levelName}
                />
            ),
        },
        {
            header: 'ACTIONS',
            width: '100px',
            accessor: (skill) => (
                <div className={styles.actionsCell}>
                    <ActionIconButton
                        iconSource={editIcon}
                        altText={`Edit ${skill.domainName}`}
                        title="Edit"
                        onClick={() => console.log('Edit locked.')}
                    />
                    <ActionIconButton
                        iconSource={deleteIcon}
                        variant="danger"
                        altText={`Delete ${skill.domainName}`}
                        title="Delete"
                        onClick={() => console.log('Delete locked.')}
                    />
                </div>
            ),
        }
    ];

    return (
        <div className={styles.tableWrapper}>
            <Table
                data={skills}
                columns={columns}
                emptyMessage="No skills assigned to this employee yet."
            />
        </div>
    );
};