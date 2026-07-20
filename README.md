# Expert Management System

## Cel projektu

Zaprojektuj i zaimplementuj aplikację webową służącą do zarządzania kompetencjami pracowników w organizacji.

System powinien umożliwiać przypisywanie poziomów kompetencji do określonych domen wiedzy oraz wyszukiwanie ekspertów spełniających zadane kryteria.

---

# Opis biznesowy

Przykładowy pracownik:

```text
Paweł Matujewicz
```

może posiadać kompetencje:

```text
Java = Professional
SQL = Master
React = Functional
```

---

# Model poziomów kompetencji

Poziomy powinny być prezentowane użytkownikowi jako tekst, ale przechowywane w systemie jako wartości liczbowe.

```text
Awareness    = 1
Functional   = 2
Professional = 3
Master       = 4
```

Nazwy poziomów powinny być możliwe do zmiany bez modyfikowania istniejących danych.

---

# Role systemowe

## USER

Użytkownik standardowy powinien mieć możliwość:

- przeglądania domen kompetencyjnych,
- przeglądania ekspertów przypisanych do domen,
- wyszukiwania użytkowników po poziomie kompetencji,
- wyszukiwania użytkowników z minimalnym poziomem kompetencji,
- opcjonalnie wyszukiwania wielokryterialnego (AND/OR).

### Przykłady wyszukiwania

```text
Java = Professional
```

```text
Java >= Professional
```

```text
Java >= Professional AND SQL >= Master
```

---

## ADMIN

Administrator powinien mieć wszystkie uprawnienia użytkownika oraz:

### Zarządzanie użytkownikami

CRUD:

- Create
- Read
- Update
- Delete

### Zarządzanie domenami

CRUD:

- Java
- Spring
- React
- SQL
- Docker
- Kubernetes
- inne

### Zarządzanie kompetencjami

CRUD przypisań kompetencji do użytkowników.

### Zarządzanie rolami (opcjonalnie)

- nadawanie roli Administrator,
- odbieranie roli Administrator.

---

# Wymagania technologiczne

## Backend

- Java 21
- Spring Boot 3.x
- Spring Web
- Spring Data JPA
- Spring Security
- Bean Validation
- Maven

Backend powinien udostępniać REST API.

## Baza danych

- PostgreSQL
- Liquibase

Struktura bazy danych powinna być tworzona wyłącznie przy użyciu migracji Liquibase.

## Frontend

- React
- TypeScript

Frontend powinien komunikować się z backendem wyłącznie za pomocą REST API.

---

# Bezpieczeństwo

Aplikacja powinna wykorzystywać Spring Security.

Role:

```text
ROLE_USER
ROLE_ADMIN
```

Opcjonalnie:

- JWT Authentication
- Refresh Token

---

# Architektura aplikacji

```text
React (Frontend)
        |
     REST API
        |
Spring Boot
        |
PostgreSQL
```

Backend powinien wykorzystywać warstwy:

```text
Controller
Service
Repository
Entity
DTO
Mapper
```

---

# Model domenowy (propozycja)

```text
User
Role
Domain
ExpertiseLevel
UserSkill
```

Relacje:

```text
User      1..* UserSkill
Domain    1..* UserSkill
Role      *..* User
```

---

# Migracje Liquibase

Migracje powinny być organizowane w postaci changelogów.

Przykładowa struktura:

```text
src/main/resources/
└── db/
    └── changelog/
        ├── db.changelog-master.yaml
        ├── 001-create-user-table.yaml
        ├── 002-create-role-table.yaml
        ├── 003-create-domain-table.yaml
        ├── 004-create-expertise-level-table.yaml
        ├── 005-create-user-skill-table.yaml
        └── 006-insert-initial-data.yaml
```

Zadanie dodatkowe:

Przygotować migrację dodającą nowy poziom kompetencji:

```text
Expert
```

bez utraty istniejących danych.

---

# Testowanie

## Backend

Wymagane:

- JUnit 5
- Mockito

Testy powinny obejmować:

- Service Layer,
- Security,
- Walidację,
- Logikę wyszukiwania ekspertów.

## Frontend

Wymagane:

- React Testing Library
- Vitest lub Jest

---

# Proponowana struktura repozytorium

```text
expert-management-system/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/company/experts/
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   ├── dto/
│   │   │   │   ├── mapper/
│   │   │   │   ├── security/
│   │   │   │   ├── exception/
│   │   │   │   └── config/
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── db/changelog/
│   │   └── test/
│   ├── pom.xml
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── package.json
│   └── README.md
│
├── docs/
│   ├── openapi.yaml
│   └── architecture-diagram.png
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

# Zawartość repozytorium

Repozytorium powinno zawierać:

- kod źródłowy backendu,
- kod źródłowy frontendu,
- dokumentację API (OpenAPI),
- migracje Liquibase,
- instrukcję uruchomienia projektu,
- testy jednostkowe,
- testy integracyjne (opcjonalnie).

---

# Materiały do nauki

## Spring Boot
- https://spring.io/guides
- https://docs.spring.io/spring-boot/docs/current/reference/html/

## Spring Data JPA
- https://spring.io/projects/spring-data-jpa
- https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa

## Spring Security
- https://docs.spring.io/spring-security/reference/

## React
- https://react.dev/
- https://www.typescriptlang.org/docs/

## PostgreSQL
- https://www.postgresql.org/docs/

## Liquibase
- https://docs.liquibase.com/

## Docker
- https://docs.docker.com/
