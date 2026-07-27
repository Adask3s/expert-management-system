import {Badge} from './components/common/Badge/Badge';

export function App() {
    return (
        <main style={{padding: 'var(--space-6)'}}>
            <h1>Expert Management System</h1>
            <p style={{color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)'}}>
                Weryfikacja wariantów komponentu Badge.
            </p>

            {/* Tymaczasowe testowe wyśeitlanie powstałych elementów */}
            <div style={{
                marginTop: 'var(--space-4)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                backgroundColor: 'var(--color-bg-surface-elevated, #1c1c24)',
                borderRadius: 'var(--radius-lg)'
            }}>

                {/* Warianty domyślne i statusy */}
                <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                    <span
                        style={{color: 'var(--color-text-secondary)', width: '80px', fontSize: '14px'}}>Statusy:</span>
                    <Badge>Domyślny</Badge>
                    <Badge variant="status" status="active"/>
                    <Badge variant="status" status="inactive"/>
                </div>

                {/* Poziomy kompetencji (Domeny) */}
                <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                    <span style={{color: 'var(--color-text-secondary)', width: '80px', fontSize: '14px'}}>Skille:</span>
                    {/* Wariant bez podanego poziomu (użyje domyślnego koloru dla .skill .dot) */}
                    <Badge variant="skill" domainName="Unknown"/>

                    {/* Poziomy 1-4 zmapowane na konkretne tokeny */}
                    <Badge variant="skill" domainName="TypeScript" levelName="Awareness" level={1}/>
                    <Badge variant="skill" domainName="React" levelName="Functional" level={2}/>
                    <Badge variant="skill" domainName="Java" levelName="Professional" level={3}/>
                    <Badge variant="skill" domainName="SQL" levelName="Master" level={4}/>
                </div>

            </div>
        </main>
    );
}

export default App;