# ERD – Expert Management System

## Diagram ERD (Mermaid)

```mermaid
erDiagram
    USER {
        bigint id PK
        string first_name
        string last_name
        string email
        boolean active
    }

    ROLE {
        bigint id PK
        string name
    }

    DOMAIN {
        bigint id PK
        string name
        string description
    }

    EXPERTISE_LEVEL {
        int id PK
        string name
        int rank_value
    }

    USER_SKILL {
        bigint id PK
        bigint user_id FK
        bigint domain_id FK
        int expertise_level_id FK
    }

    USER_ROLE {
        bigint user_id FK
        bigint role_id FK
    }

    USER ||--o{ USER_SKILL : has
    DOMAIN ||--o{ USER_SKILL : contains
    EXPERTISE_LEVEL ||--o{ USER_SKILL : assigned

    USER ||--o{ USER_ROLE : owns
    ROLE ||--o{ USER_ROLE : assigned
```

## Relacje

- User ↔ Role: wiele-do-wielu
- User ↔ UserSkill: jeden-do-wielu
- Domain ↔ UserSkill: jeden-do-wielu
- ExpertiseLevel ↔ UserSkill: jeden-do-wielu

## Przykładowe role

- ROLE_USER
- ROLE_ADMIN

## Przykładowe poziomy kompetencji

| Nazwa | Wartość |
|--------|----------|
| Awareness | 1 |
| Functional | 2 |
| Professional | 3 |
| Master | 4 |
