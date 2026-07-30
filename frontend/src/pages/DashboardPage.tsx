import plusIcon from '../assets/icons/Plus.svg'; // impotrujemy ikonę dodawania
import {Button} from "../components/common/Button/Button.tsx";
import {UserTable} from "../components/users/UserTable/UserTable.tsx";
import type {UserListItem} from "../types/users.ts";
import {TablePagination} from "../components/common/Table/TablePagination.tsx";

// Dane testowe w 100% odzwierciedlające odpowiedź z API (DTO UserListItem)
const MOCK_USERS: UserListItem[] = [
    {
        id: 101,
        firstName: 'Paweł',
        lastName: 'Matujewicz',
        email: 'pawel.matujewicz@corp.io',
        active: true,
        roles: ['ROLE_USER'],
        skills: [
            {domainName: 'Java', levelName: 'Professional', rankValue: 3},
            {domainName: 'SQL', levelName: 'Master', rankValue: 4},
            {domainName: 'Docker', levelName: 'Functional', rankValue: 2},
            {domainName: 'Spring', levelName: 'Awareness', rankValue: 1}
        ]
    },
    {
        id: 104,
        firstName: 'Katarzyna',
        lastName: 'Nowak',
        email: 'katarzyna.nowak@corp.io',
        active: false,
        roles: ['ROLE_USER'],
        skills: [
            {domainName: 'SQL', levelName: 'Master', rankValue: 4},
            {domainName: 'PostgreSQL', levelName: 'Professional', rankValue: 3},
            {domainName: 'Python', levelName: 'Professional', rankValue: 3}
        ]
    }
];

export const DashboardPage = () => {
    return (
        <div>
            <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                <Button variant="primary" icon={<img src={plusIcon} alt="" aria-hidden="true"/>}
                        onClick={() => console.log('Primary Action')}>Add
                    Employee</Button>
                <Button variant="danger" onClick={() => console.log('Danger Action')}>Restore Default</Button>
                <Button variant="ghost" onClick={() => console.log('Ghost Action')}>Clear All</Button>
            </div>
            <br/>
            {/* Wywołanie naszego gotowego komponentu UserTable */}
            <UserTable
                data={MOCK_USERS}
                onEdit={(user) => console.log(`Otwórz modal edycji dla: ${user.firstName} ${user.lastName}`)}
                onDelete={(user) => console.log(`Rozpocznij proces usuwania dla: ${user.firstName} ${user.lastName}`)}
            />
            {/* Przykładowe użycie TablePagination */}
            <TablePagination number={0} size={10} totalElements={245} totalPages={25}
                             onPageChange={(page) => console.log(`Page changed to: ${page}`)}/>
        </div>
    );
};