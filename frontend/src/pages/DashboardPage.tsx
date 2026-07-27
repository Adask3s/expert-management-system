import {UserAvatar} from "../components/common/UserAvatar/UserAvatar.tsx";

export const DashboardPage = () => {
    return (
        <div>
            {/* Tymczasowy nagłówek, TODO: użyjemy tu odpowiedniej typografii */}
            <h1 style={{color: 'var(--color-text-primary)'}}>User List</h1>
            <p style={{color: 'var(--color-text-secondary)'}}>Tutaj wdrożymy tabelę użytkowników</p>
            <br/><UserAvatar/>
        </div>
    );
};