import {UserAvatar} from "../components/common/UserAvatar/UserAvatar.tsx";
import {Badge} from "../components/common/Badge/Badge.tsx";
import {ActionIconButton} from "../components/common/IconButton/ActionIconButton.tsx";
import editIcon from '../assets/icons/Edit.svg'; // impotrujemy ikonę edytowania
import deleteIcon from '../assets/icons/Delete.svg';
import plusIcon from '../assets/icons/Plus.svg';
import {Button} from "../components/common/Button/Button.tsx"; // impotrujemy ikonę usuwania

export const DashboardPage = () => {
    return (
        <div>
            {/* Tymczasowy nagłówek, TODO: użyjemy tu odpowiedniej typografii */}
            <h1 style={{color: 'var(--color-text-primary)'}}>User List</h1>
            <p style={{color: 'var(--color-text-secondary)'}}>Here, the users table will be implemented.</p>
            <br/><UserAvatar/><br/>
            <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                    <span
                        style={{color: 'var(--color-text-secondary)', width: '80px', fontSize: '14px'}}>Statuses:</span>
                <Badge>Default</Badge>
                <Badge variant="status" status="active"/>
                <Badge variant="status" status="inactive"/>
            </div>
            <br/>
            {/* Poziomy kompetencji (Domeny) */}
            <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                <span style={{color: 'var(--color-text-secondary)', width: '80px', fontSize: '14px'}}>Skills:</span>
                {/* Wariant bez podanego poziomu (użyje domyślnego koloru dla .skill .dot) */}
                <Badge variant="skill" domainName="Unknown"/>

                {/* Poziomy 1-4 zmapowane na konkretne tokeny */}
                <Badge variant="skill" domainName="TypeScript" levelName="Awareness" level={1}/>
                <Badge variant="skill" domainName="React" levelName="Functional" level={2}/>
                <Badge variant="skill" domainName="Java" levelName="Professional" level={3}/>
                <Badge variant="skill" domainName="SQL" levelName="Master" level={4}/>
            </div>
            <br/>
            <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                <ActionIconButton
                    iconSource={editIcon}
                    altText="Edit User"
                    onClick={() => console.log('Edit action.')}
                />
                <ActionIconButton
                    iconSource={deleteIcon}
                    altText="Edit User"
                    variant="danger"
                    onClick={() => console.log('Delete action.')}
                />
            </div>
            <br/>
            <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                <Button variant="primary" icon={<img src={plusIcon} alt="" aria-hidden="true"/>}
                        onClick={() => console.log('Primary Action')}>Add
                    Employee</Button>
                <Button variant="danger" onClick={() => console.log('Danger Action')}>Restore Default</Button>
                <Button variant="ghost" onClick={() => console.log('Ghost Action')}>Clear All</Button>
            </div>
        </div>
    );
};