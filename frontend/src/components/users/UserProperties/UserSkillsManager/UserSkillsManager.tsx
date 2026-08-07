// frontend/src/components/users/UserProperties/UserSkillsManager/UserSkillsManager.tsx
import {useParams} from 'react-router-dom';
import {useUserSkills} from '../../../../hooks/useUsersSkills';
import {Button} from '../../../common/Button/Button';
import {UserSkillsTable} from './UserSkillsTable';
import styles from './UserSkillsManager.module.css';

// Mikro-komponent odpowiedzialny za renderowanie wskaźnika natężenia
interface IntensityIndicatorProps {
    level: number;
    label: string;
    nodeClass: string;
    textClass: string;
}

const IntensityIndicator = ({level, label, nodeClass, textClass}: IntensityIndicatorProps) => {
    // Generujemy tablicę od 1 do 4, aby reprezentować pełną skalę z bazy danych
    const maxLevel = 4;

    return (
        <div className={styles.intensityLegendItem}>
            <div className={styles.intensityTrack}>
                {Array.from({length: maxLevel}).map((_, index) => {
                    const currentStep = index + 1;
                    const isActive = currentStep <= level;
                    return (
                        <div
                            key={currentStep}
                            className={`${styles.intensityNode} ${isActive ? nodeClass : ''}`}
                        />
                    );
                })}
            </div>
            <span className={textClass}>{label}</span>
        </div>
    );
};

export const UserSkillsManager = () => {
    const {id: userId} = useParams<{ id: string }>();
    const {data: skills, isLoading, isError} = useUserSkills(userId);

    return (
        <section className={styles.card}>
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h2 className={styles.title}>Assigned Skills</h2>
                    <span className={styles.badge}>{skills?.length || 0} domains</span>
                </div>
                <Button variant="primary"
                        onClick={() => console.warn('System Check: POST /users/{userId}/skills disabled pending backend DTO fix.')}>
                    + Add Skill
                </Button>
            </header>

            {/* Legenda z poprawnym odwzorowaniem ordynalnej skali natężenia */}
            <div className={styles.legend}>
                <span className={styles.legendLabel}>LEVEL SCALE</span>
                <div className={styles.legendItems}>
                    <IntensityIndicator
                        level={1}
                        label="Awareness"
                        nodeClass={styles.nodeAwareness}
                        textClass={styles.textAwareness}
                    />
                    <IntensityIndicator
                        level={2}
                        label="Functional"
                        nodeClass={styles.nodeFunctional}
                        textClass={styles.textFunctional}
                    />
                    <IntensityIndicator
                        level={3}
                        label="Professional"
                        nodeClass={styles.nodeProfessional}
                        textClass={styles.textProfessional}
                    />
                    <IntensityIndicator
                        level={4}
                        label="Master"
                        nodeClass={styles.nodeMaster}
                        textClass={styles.textMaster}
                    />
                </div>
            </div>

            <div className={styles.content}>
                {isLoading ? (
                    <div className={styles.message}>Loading assigned skills...</div>
                ) : isError ? (
                    <div className={styles.message}>System Error: Failed to load expertise directory.</div>
                ) : skills && skills.length > 0 ? (
                    <UserSkillsTable skills={skills}/>
                ) : (
                    <div className={styles.emptyState}>No skills assigned to this employee yet.</div>
                )}
            </div>
        </section>
    );
};