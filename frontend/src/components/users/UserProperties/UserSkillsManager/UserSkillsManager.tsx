import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {useAddUserSkill, useDeleteUserSkill, useUpdateUserSkill, useUserSkills} from '../../../../hooks/useUsersSkills';
import {Button} from '../../../common/Button/Button';
import {UserSkillsTable} from './UserSkillsTable';
import {UserSkillModal} from './UserSkillModal.tsx';
import {ConfirmModal} from '../../../common/Modal/ConfirmModal';
import styles from './UserSkillsManager.module.css';
import type {UserSkillDetail} from '../../../../types/users';

interface IntensityIndicatorProps {
    level: number;
    label: string;
    nodeClass: string;
    textClass: string;
}

const IntensityIndicator = ({level, label, nodeClass, textClass}: IntensityIndicatorProps) => {
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
    if (!userId) throw new Error("System Check: Missing userId in URL params");

    const {data: skills, isLoading, isError} = useUserSkills(userId);

    const addMutation = useAddUserSkill(userId);
    const updateMutation = useUpdateUserSkill(userId);
    const deleteMutation = useDeleteUserSkill(userId);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<UserSkillDetail | null>(null);
    const [skillToDelete, setSkillToDelete] = useState<UserSkillDetail | null>(null);

    const handleOpenAdd = () => {
        setEditingSkill(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEdit = (skill: UserSkillDetail) => {
        setEditingSkill(skill);
        setIsFormModalOpen(true);
    };

    const handleSaveSkill = (domainId: number, expertiseLevelId: number) => {
        // Rygorystyczna konwersja typu dla backendu
        const numericUserId = Number(userId);

        if (editingSkill && editingSkill.id) {
            updateMutation.mutate(
                {
                    userSkillId: editingSkill.id,
                    payload: {userId: numericUserId, domainId, expertiseLevelId}
                },
                {onSuccess: () => setIsFormModalOpen(false)}
            );
        } else {
            addMutation.mutate(
                {userId: numericUserId, domainId, expertiseLevelId},
                {onSuccess: () => setIsFormModalOpen(false)}
            );
        }
    };

    const handleConfirmDelete = () => {
        if (skillToDelete && skillToDelete.id) {
            deleteMutation.mutate(skillToDelete.id, {
                onSuccess: () => setSkillToDelete(null)
            });
        }
    };

    const isPending = addMutation.isPending || updateMutation.isPending;

    return (
        <section className={styles.card}>
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h2 className={styles.title}>Assigned Skills</h2>
                    <span className={styles.badge}>{skills?.length || 0} domains</span>
                </div>
                <Button variant="primary" onClick={handleOpenAdd} disabled={isPending}>
                    + Add Skill
                </Button>
            </header>

            <div className={styles.legend}>
                <span className={styles.legendLabel}>LEVEL SCALE</span>
                <div className={styles.legendItems}>
                    <IntensityIndicator level={1} label="Awareness" nodeClass={styles.nodeAwareness}
                                        textClass={styles.textAwareness}/>
                    <IntensityIndicator level={2} label="Functional" nodeClass={styles.nodeFunctional}
                                        textClass={styles.textFunctional}/>
                    <IntensityIndicator level={3} label="Professional" nodeClass={styles.nodeProfessional}
                                        textClass={styles.textProfessional}/>
                    <IntensityIndicator level={4} label="Master" nodeClass={styles.nodeMaster}
                                        textClass={styles.textMaster}/>
                </div>
            </div>

            <div className={styles.content}>
                {isLoading ? (
                    <div className={styles.message}>Loading assigned skills...</div>
                ) : isError ? (
                    <div className={styles.message}>System Error: Failed to load expertise directory.</div>
                ) : skills && skills.length > 0 ? (
                    <UserSkillsTable
                        skills={skills}
                        onEdit={handleOpenEdit}
                        onDelete={(skill) => setSkillToDelete(skill)}
                    />
                ) : (
                    <div className={styles.emptyState}>No skills assigned to this employee yet.</div>
                )}
            </div>

            {/* Modal dodawania / edycji */}
            <UserSkillModal
                // Inżynieryjne podejście: gdy zmieniamy tryb pracy (Dodawanie vs Edycja konkretnego ID) 
                // lub gdy zamykamy modal, 'key' się zmienia. React automatycznie 
                // niszczy starą instancję modala i czyści wszystkie useState!
                key={isFormModalOpen ? (editingSkill ? `edit-${editingSkill.id}` : 'add') : 'closed'}
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSave={handleSaveSkill}
                initialData={editingSkill}
                existingSkills={skills || []}
                isPending={isPending}
            />

            <ConfirmModal
                isOpen={!!skillToDelete}
                onClose={() => setSkillToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Remove Skill"
                description={`Are you sure you want to remove the ${skillToDelete?.domainName} competency from this user's profile? This action cannot be undone.`}
                confirmText={deleteMutation.isPending ? 'Removing...' : 'Remove'}
                cancelText="Cancel"
                variant="danger"
                isLoading={deleteMutation.isPending}
            />
        </section>
    );
};