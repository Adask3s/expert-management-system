import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {type DomainRequestFormData, domainRequestSchema} from '../../../validations/domainSchema';
import {useAddDomain} from '../../../hooks/useDomainsList';
import {Button} from '../../common/Button/Button';
import styles from './AddDomainForm.module.css';

interface AddDomainFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export const AddDomainForm = ({onSuccess, onCancel}: AddDomainFormProps) => {
    const {mutate, isPending, isError} = useAddDomain();

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<DomainRequestFormData>({
        resolver: zodResolver(domainRequestSchema),
        defaultValues: {
            name: '',
            description: ''
        }
    });

    const onSubmit = (data: DomainRequestFormData) => {
        mutate(data, {
            onSuccess: () => {
                onSuccess();
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
            <p className={styles.formSubtitle}>
                Add a new technology or skill domain to the directory.
            </p>

            {/* Domain name */}
            <div className={styles.fieldGroup}>
                <label htmlFor="name" className={styles.label}>Domain Name</label>
                <input
                    id="name"
                    type="text"
                    placeholder="e.g. Java, AWS, React"
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    {...register('name')}
                />
                {errors.name && <span className={styles.errorMessage}>{errors.name.message}</span>}
            </div>

            {/* Description */}
            <div className={styles.fieldGroup}>
                <label htmlFor="description" className={styles.label}>Description (Optional)</label>
                <textarea
                    id="description"
                    placeholder="Brief description of this domain..."
                    className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                    {...register('description')}
                />
                {errors.description && <span className={styles.errorMessage}>{errors.description.message}</span>}
            </div>

            {/* Global Error */}
            {isError && (
                <div className={styles.errorMessage}>
                    Failed to add domain. Please try again.
                </div>
            )}

            {/* Actions */}
            <div className={styles.formActions}>
                <Button
                    variant="ghost"
                    type="button"
                    onClick={onCancel}
                    disabled={isPending}
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? 'Adding...' : 'Add Domain'}
                </Button>
            </div>
        </form>
    );
};