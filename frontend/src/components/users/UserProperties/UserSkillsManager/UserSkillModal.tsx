import {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {dictionaryService} from '../../../../services/dictionaryService';
import {Button} from '../../../common/Button/Button';
import {Modal} from '../../../common/Modal/Modal';
import type {UserSkillDetail} from '../../../../types/users';
import styles from './UserSkillModal.module.css';

interface UserSkillModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (domainId: number, expertiseLevelId: number) => void;
    initialData?: UserSkillDetail | null;
    existingSkills: UserSkillDetail[];
    isPending: boolean;
}

export const UserSkillModal = ({
                                   isOpen,
                                   onClose,
                                   onSave,
                                   initialData,
                                   existingSkills,
                                   isPending
                               }: UserSkillModalProps) => {
    const isEditMode = !!initialData;

    const {data: domainsPage} = useQuery({
        queryKey: ['domains', 'all'],
        queryFn: () => dictionaryService.getDomains(0, 1000),
        enabled: isOpen,
    });

    const {data: expertiseLevels} = useQuery({
        queryKey: ['expertiseLevels'],
        queryFn: dictionaryService.getExpertiseLevels,
        enabled: isOpen,
    });

    // Derived State
    const defaultDomainId = (initialData && domainsPage?.content)
        ? domainsPage.content.find(d => d.name === initialData.domainName)?.id?.toString() || ''
        : '';

    const defaultLevelId = (initialData && expertiseLevels)
        ? expertiseLevels.find(l => l.name === initialData.levelName)?.id?.toString() || ''
        : '';

    const [localDomainId, setLocalDomainId] = useState<string>('');
    const [localLevelId, setLocalLevelId] = useState<string>('');

    const effectiveDomainId = localDomainId || defaultDomainId;
    const effectiveLevelId = localLevelId || defaultLevelId;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (effectiveDomainId && effectiveLevelId) {
            onSave(Number(effectiveDomainId), Number(effectiveLevelId));
        }
    };

    const availableDomains = isEditMode
        ? domainsPage?.content || []
        : (domainsPage?.content || []).filter(d => !existingSkills.some(skill => skill.domainName === d.name));

    // Jeśli modal jest zamknięty, base Modal.tsx i tak zwraca null, ale 
    // dla pewności, by nie renderować niepotrzebnie formularza, możemy to zostawić.
    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            // Zabezpieczenie UX: nie pozwalamy zamknąć modala w trakcie zapisu do API
            onClose={isPending ? () => {
            } : onClose}
            title={isEditMode ? 'Edit Expertise Level' : 'Add New Skill'}
        >
            <form className={styles.formBody} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>DOMAIN</label>
                    <select
                        className={styles.select}
                        value={effectiveDomainId}
                        onChange={(e) => setLocalDomainId(e.target.value)}
                        disabled={isEditMode || isPending}
                        required
                    >
                        <option value="" disabled>Select a domain...</option>
                        {availableDomains.map(domain => (
                            <option key={domain.id} value={domain.id}>{domain.name}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>EXPERTISE LEVEL</label>
                    <select
                        className={styles.select}
                        value={effectiveLevelId}
                        onChange={(e) => setLocalLevelId(e.target.value)}
                        disabled={isPending}
                        required
                    >
                        <option value="" disabled>Select level...</option>
                        {expertiseLevels?.map(level => (
                            <option key={level.id} value={level.id}>{level.name}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.actions}>
                    {/* W modalu Confirm używamy wariantu "ghost" dla anulowania, trzymajmy spójność */}
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={isPending}>
                        {isPending ? 'Processing...' : (isEditMode ? 'Update Skill' : 'Add Skill')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};