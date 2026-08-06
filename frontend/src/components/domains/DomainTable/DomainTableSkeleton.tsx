import styles from './DomainTableSkeleton.module.css';

interface SkeletonProps {
    rows?: number;
}

export const DomainTableSkeleton = ({rows = 10}: SkeletonProps) => {
    return (
        <div className={styles.skeletonWrapper}>
            {/* Nagłówek tabeli */}
            <div className={styles.skeletonHeader}>
                <div className={`${styles.pulse} ${styles.textLine}`} style={{width: '60px'}}></div>
                <div className={`${styles.pulse} ${styles.textLine}`} style={{width: '250px'}}></div>
                <div className={`${styles.pulse} ${styles.textLine}`} style={{flex: 1}}></div>
                <div className={`${styles.pulse} ${styles.textLine}`} style={{width: '100px'}}></div>
            </div>

            {/* Generowanie wierszy na podstawie pętli */}
            {Array.from({length: rows}).map((_, index) => (
                <div key={index} className={styles.skeletonRow}>

                    {/* Kolumna ID */}
                    <div style={{width: '60px'}}>
                        <div className={`${styles.pulse} ${styles.textLine}`} style={{width: '20px'}}></div>
                    </div>

                    {/* Kolumna Domain Name (Ikona + Tekst) */}
                    <div style={{display: 'flex', gap: '12px', alignItems: 'center', width: '250px'}}>
                        <div className={`${styles.pulse} ${styles.domainIcon}`}></div>
                        <div className={`${styles.pulse} ${styles.textLine}`} style={{width: '120px'}}></div>
                    </div>

                    {/* Kolumna Description */}
                    <div style={{flex: 1}}>
                        <div className={`${styles.pulse} ${styles.textLine}`} style={{width: '70%'}}></div>
                    </div>

                    {/* Kolumna Action (Edit/Delete) */}
                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        width: '300px',
                        justifyContent: 'flex-end',
                        alignContent: "right"
                    }}>
                        <div className={`${styles.pulse} ${styles.actionIcon}`}></div>
                        <div className={`${styles.pulse} ${styles.actionIcon}`}></div>
                    </div>
                </div>
            ))}
        </div>
    );
};