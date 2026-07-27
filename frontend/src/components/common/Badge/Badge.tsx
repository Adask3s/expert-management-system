// Badge będzie wykorzystywany do statusu konta, pigułki kompenetcji

import React from 'react';
import styles from './Badge.module.css';

// Użyjemy variantu default jako zwykłego kafelka z napisaem np. do liczników rekordów w dashboardzie
// lub roli użytkownika w User Properties
export type BadgeVariant = 'status' | 'skill' | 'default';
export type StatusType = 'active' | 'inactive';
export type LevelRank = 1 | 2 | 3 | 4;

export interface BadgeProps {
    variant?: BadgeVariant;
    status?: StatusType;
    level?: LevelRank;
    domainName?: string;
    levelName?: string;
    // Będziemy mogli coś przekazać pomiędzy znacznikami otwierającym i zamykającym komponentu Badge
    children?: React.ReactNode;
    // Rodzic decyduje o dodatkowych klasach CSS, które mają być zastosowane do komponentu Badge
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
                                                variant = 'default',
                                                status,
                                                level,
                                                domainName,
                                                levelName,
                                                children,
                                                className = '',
                                            }) => {

    // Wariant 1: Status pracownika (Active/Inactive)
    if (variant === 'status') {
        const isActive = status === 'active';
        return (
            <span
                className={`${styles.badge} ${styles.status} ${isActive ? styles.active : styles.inactive} ${className}`}>
                {/* Kropka sygnalizacyjna */}
                <span className={styles.dot}/>
                {isActive ? 'Active' : 'Inactive'}
            </span>
        );
    }

    // Wariant 2: Umiejętność (Domain)
    if (variant === 'skill') {
        const levelClass = level ? styles[`level${level}`] : '';
        return (
            <span className={`${styles.badge} ${styles.skill} ${levelClass} ${className}`}>
                <span className={styles.dot}/>
                {/* Pokazujemy nazwę domeny tylko jeśli została przeazana*/}
                {domainName && <span>{domainName}</span>}
                {domainName && levelName && <span>∙</span>}
                {levelName && <span>{levelName}</span>}
            </span>
        );
    }

    // Wariant 3: Default (Zwykła etykieta)
    return (
        <span className={`${styles.badge} ${styles.default} ${className}`}>
            {/* Wyświetlamy przekazany pomiędzy znacznikami (<Badge> i <Badge/>) children */}
            {children}
        </span>
    );
}