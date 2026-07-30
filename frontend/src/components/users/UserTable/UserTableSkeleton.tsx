import styles from './UserTableSkeleton.module.css';

interface SkeletonProps {
    rows?: number;
}

export const UserTableSkeleton = ({ rows = 10 }: SkeletonProps) => {
    return (
        <div className={styles.skeletonWrapper}>
            {/* Nagłówek tabeli (stały) */}
            <div className={styles.skeletonHeader}>
                <div className={`${styles.pulse} ${styles.textLine}`} style={{ width: '200px' }}></div>
                <div className={`${styles.pulse} ${styles.textLine}`} style={{ width: '300px' }}></div>
                <div className={`${styles.pulse} ${styles.textLine}`} style={{ width: '100px' }}></div>
            </div>

            {/* Wiersze tabeli generowane dynamicznie */}
            {Array.from({ length: rows }).map((_, index) => (
                <div key={index} className={styles.skeletonRow}>
                    {/* Kolumna: Avatar + Info */}
                    <div style={{ display: 'flex', gap: '16px', flex: 1.5 }}>
                        <div className={`${styles.pulse} ${styles.avatar}`}></div>
                        <div>
                            <div className={`${styles.pulse} ${styles.textLine}`}></div>
                            <div className={`${styles.pulse} ${styles.textLineShort}`}></div>
                        </div>
                    </div>

                    {/* Kolumna: Skills/Domains */}
                    <div style={{ display: 'flex', gap: '8px', flex: 2 }}>
                        <div className={`${styles.pulse} ${styles.badge}`}></div>
                        <div className={`${styles.pulse} ${styles.badge}`} style={{ width: '80px' }}></div>
                    </div>

                    {/* Kolumna: Status */}
                    <div style={{ flex: 1 }}>
                        <div className={`${styles.pulse} ${styles.textLineShort}`}></div>
                    </div>

                    {/* Kolumna: Akcje */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div className={`${styles.pulse} ${styles.icon}`}></div>
                        <div className={`${styles.pulse} ${styles.icon}`}></div>
                    </div>
                </div>
            ))}
        </div>
    );
};