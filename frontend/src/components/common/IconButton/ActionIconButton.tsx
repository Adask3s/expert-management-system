import styles from './ActionIconButton.module.css';

export interface ActionIconProps {
    iconSource: string;
    // wariant default np. dla "Apply Filters"
    // wariant danger dla "Restore default"
    variant?: 'default' | 'danger';
    altText: string;
    title?: string;
    onClick?: () => void;
    disabled?: boolean;
}

export const ActionIconButton = ({
                                     iconSource,
                                     variant = 'default',
                                     altText,
                                     title,
                                     disabled = false,
                                     onClick,
                                 }: ActionIconProps) => {
    return (
        <button
            type="button"
            className={`${styles.iconButton} ${styles[variant]}`}
            onClick={onClick}
            disabled={disabled}
            // aria-label - tekstowa etykieta dla czytników ekranu
            aria-label={altText}
            title={title}>
            {/*Jeśli przycisk ma już ustawiony aria-label, to znajdująca się wewnątrz
            niego ikona SVG jest dekoracyjna. Gdybyśmy nie użyli aria-hidden="true",
            czytnik ekranu próbowałby przeczytać nazwę pliku pliku graficznego (np. Edit.svg)*/}
            <img className={styles.icon} src={iconSource} alt="" aria-hidden="true"/>
        </button>
    );
};
