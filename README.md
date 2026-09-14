# Expert Management System

A full-stack web application for managing employee competencies within an organization. It allows assigning expertise levels to knowledge domains and searching for experts that match given criteria (e.g. `Java >= Professional AND SQL >= Master`).

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [API Documentation](#api-documentation)
- [Authors](#authors)
- [Mentors](#mentors)
- [License](#license)

## Overview

An employee can be assigned one or more competencies, each combining a **domain** (e.g. Java, SQL, React) with an **expertise level**:

```
Java  = Professional
SQL   = Master
React = Functional
```

Expertise levels are presented to users as text but stored internally as numeric values, so their names can change without affecting existing data:

| Level        | Value |
| ------------ | ----- |
| Awareness    | 1     |
| Functional   | 2     |
| Professional | 3     |
| Master       | 4     |

## Features

**Standard user (`ROLE_USER`)**

- Browse competency domains
- Browse experts assigned to a given domain
- Search users by expertise level (`Java = Professional`)
- Search users by minimum expertise level (`Java >= Professional`)
- Multi-criteria search (`Java >= Professional AND SQL >= Master`)

**Administrator (`ROLE_ADMIN`)** — everything a standard user can do, plus:

- Full CRUD on users
- Full CRUD on domains
- Full CRUD on user-to-domain competency assignments
- Grant/revoke the administrator role

**Security**

- Spring Security with JWT authentication and refresh tokens

## Tech Stack

**Backend**

- Java 21, Spring Boot
- Spring Web, Spring Data JPA, Spring Security
- JWT (jjwt)
- Bean Validation
- Maven

**Database**

- PostgreSQL
- Liquibase (schema is managed exclusively through migrations)

**Frontend**

- React 19 + TypeScript
- React Router 7
- TanStack React Query
- Axios
- Vite 8
- Vitest + React Testing Library
- CSS Modules with a Figma-driven design token system

**API contract**

- OpenAPI specification, with backend interfaces and frontend types both generated from it

## Architecture

```
React (Frontend)
        |
     REST API
        |
Spring Boot
        |
PostgreSQL
```

The backend follows a layered architecture:

```
Controller → Service → Repository → Entity
                 |
              DTO / Mapper
```

### Domain model

```
User      1..* UserSkill
Domain    1..* UserSkill
Role      *..* User
```

The full entity-relationship diagram is available in [`docs/entity-relationship-diagram.md`](docs/entity-relationship-diagram.md).

## Project Structure

```
expert-management-system/
├── backend/                 # Spring Boot REST API
│   ├── src/main/java/…/expertmanagementsystem/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── entity/
│   │   ├── mapper/
│   │   ├── repository/
│   │   └── service/
│   ├── src/main/resources/
│   │   ├── application.yaml
│   │   ├── expert-management-openapi.yaml
│   │   └── db/changelog/     # Liquibase migrations
│   ├── src/test/java/
│   └── pom.xml
│
├── frontend/                 # React + TypeScript SPA
│   ├── src/
│   │   ├── api/               # Axios HTTP client
│   │   ├── components/        # Reusable & feature components
│   │   ├── hooks/              # Custom hooks (React Query, auth, etc.)
│   │   ├── pages/               # Route-level views
│   │   ├── routes/               # Routing / route guards
│   │   ├── services/              # API service layer
│   │   ├── styles/                 # Design tokens
│   │   └── types/                   # Types, incl. those generated from OpenAPI
│   └── package.json
│
├── docs/
│   └── entity-relationship-diagram.md
│
├── docker-compose.yml         # PostgreSQL for local development
└── README.md
```

## Getting Started

### Prerequisites

- Java 21 (JDK)
- Node.js 20+ and npm
- Docker (for PostgreSQL) or a local PostgreSQL instance
- Maven (or use the included Maven wrapper, if present)

### 1. Clone the repository

```bash
git clone <repository-url>
cd expert-management-system
```

### 2. Start the database

```bash
docker-compose up -d
```

This starts a PostgreSQL instance on port `5432` (database `expert_db`, user `admin`, password `password` — see [`docker-compose.yml`](docker-compose.yml)).

### 3. Run the backend

1. Open the `backend/` module in your IDE (or use the terminal).
2. Generate the OpenAPI-based interfaces by building the project (`mvn clean compile` or the equivalent IDE action).
3. Run the Spring Boot application.
4. The API will be available at `http://localhost:8080`, with interactive documentation at:
   ```
   http://localhost:8080/swagger-ui/index.html
   ```

More backend-specific details are available in [`backend/README.md`](backend/README.md).

> **Note:** Liquibase changesets are the single source of truth for the database schema — existing changesets must not be modified; schema changes are added as new changesets.

#### Environment variables

| Variable     | Description                                              | Default (local dev)                                                                                                               |
| ------------ | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `JWT_SECRET` | Base64-encoded secret key used to sign JWT access tokens | A dev-only placeholder baked into `application.yaml` — **must be overridden with a strong, secret value in any real deployment.** |

Override it, e.g.:

```bash
export JWT_SECRET=$(openssl rand -base64 32)
```

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will start at `http://localhost:5173` and expects the backend to be reachable at the URL configured in `frontend/.env` (`VITE_API_BASE_URL`, defaults to `http://localhost:8080/`).

More frontend-specific details are available in [`frontend/README.md`](frontend/README.md).

### Default credentials (local/dev seed data)

**Administrator** (`ROLE_ADMIN`):

```
email:    admin@example.com
password: admin
```

**Standard user** (`ROLE_USER`) — to view the app from a regular user's perspective, log in with one of the seeded accounts (e.g. `jan.kowalski1@example.com`) and the shared seed password: `Start123!`.

## Running Tests

**Backend** (JUnit 5, Mockito)

```bash
cd backend
mvn test
```

**Frontend** (Vitest, React Testing Library)

```bash
cd frontend
npm run test:run
```

## API Documentation

The REST API is documented with OpenAPI and served via Swagger UI when the backend is running:

```
http://localhost:8080/swagger-ui/index.html
```

The OpenAPI specification itself lives at [`backend/src/main/resources/expert-management-openapi.yaml`](backend/src/main/resources/expert-management-openapi.yaml) and is the source of truth for both backend interfaces and frontend TypeScript types.

## Authors

This project was built as a team effort during an internship.

- Adask3s — Frontend (GitHub: [@Adask3s](https://github.com/Adask3s))
- jonatanalimowski — Backend (GitHub: [@jonatanalimowski](https://github.com/jonatanalimowski))
- SzymonMich47 — Backend (GitHub: [@SzymonMich47](https://github.com/SzymonMich47))

## Mentors

Developed under the guidance of two senior developers:

- pawel-matujewicz (GitHub: [@pawel-matujewicz](https://github.com/pawel-matujewicz))
- SlighTom (GitHub: [SlighTom](https://github.com/SlighTom))

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
