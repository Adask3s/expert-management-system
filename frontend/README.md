````markdown
# Expert Management System - Frontend

Client application for managing employee competencies within an organization.

The frontend is part of the **Expert Management System** and communicates with the backend **exclusively via a REST API**.

---

## 🚀 Technology Stack

| Technology | Purpose |
|------------|---------|
| **React** | Frontend library |
| **TypeScript** | Static type checking |
| **Vite** | Development server and build tool |
| **Axios** | HTTP client |
| **TanStack React Query** | Server state management and caching |
| **React Router** | Client-side routing |
| **Vitest** | Unit testing framework |
| **React Testing Library** | Component testing |

---

# Project Configuration Summary

This project was configured to provide a scalable, maintainable, and type-safe frontend architecture that integrates seamlessly with the backend REST API.

## 1. Project Initialization & Architecture

### Configuration

A standard React + TypeScript project was created with a structured directory layout:

```text
src/
├── api/
├── components/
├── hooks/
├── pages/
├── routes/
├── services/
└── types/
```

### Purpose

The project follows the **Separation of Concerns** principle.

Each layer has a dedicated responsibility:

- **api/** – HTTP communication
- **services/** – business logic
- **components/** – reusable UI components
- **pages/** – application views
- **routes/** – routing configuration
- **hooks/** – reusable custom hooks
- **types/** – shared TypeScript definitions

This architecture improves maintainability, scalability, and code readability.

---

## 2. OpenAPI Integration

### Configuration

The frontend integrates the backend API specification located at:

```text
docs/openapi.yaml
```

TypeScript definitions are automatically generated into:

```text
src/types/api.d.ts
```

using **openapi-typescript**.

### Purpose

Instead of manually maintaining interfaces, the frontend relies on the backend specification as the **Single Source of Truth**.

Benefits include:

- automatic synchronization with backend changes,
- compile-time validation,
- elimination of duplicated API models,
- reduced risk of integration errors.

---

## 3. Centralized HTTP Client

### Configuration

A shared Axios instance is configured in:

```text
src/api/axiosClient.ts
```

Features include:

- global API base URL

```text
http://localhost:8080/api
```

- automatic JWT Bearer token injection
- request interceptors
- centralized HTTP configuration

### Purpose

Using a single Axios instance:

- avoids duplicated configuration,
- simplifies API communication,
- enforces consistent authentication,
- makes future changes easier.

---

## 4. Routing & Server State Management

### Configuration

The application root (`main.tsx`) is wrapped with:

- `BrowserRouter`
- `QueryClientProvider`

using **TanStack React Query**.

### Purpose

React does not provide built-in routing or server-state management.

These libraries provide:

- client-side routing,
- asynchronous data fetching,
- automatic caching,
- background synchronization,
- request deduplication,
- cache invalidation.

This significantly improves both developer experience and application performance.

---

## 5. Testing Infrastructure

### Configuration

Testing is configured using:

- Vitest
- React Testing Library
- jsdom

The configuration includes:

- `vite.config.ts`
- `src/setupTests.ts`
- baseline smoke test (`App.test.tsx`)

### Purpose

The testing environment enables automated verification of React components without launching a real browser.

Using **JSDOM** allows browser APIs to be simulated inside Node.js, making component rendering and assertions fast and reliable.

---

# 📋 Prerequisites

Before running the project, ensure you have installed:

- Node.js
- npm (included with Node.js)

---

# 🛠️ Installation

Clone the repository and navigate to the frontend directory.

Install dependencies:

```bash
npm install
```

---

# ▶️ Running the Development Server

Start the application with Hot Module Replacement (HMR):

```bash
npm run dev
```

---

# 🧪 Running Tests

Execute the complete test suite:

```bash
npm run test
```

The project uses **Vitest** together with **React Testing Library** for component testing.

---

# 📁 Project Structure

```text
src/
├── api/
├── components/
├── hooks/
├── pages/
├── routes/
├── services/
├── types/
├── App.tsx
└── main.tsx
```

---

# ✅ Project Goals

The frontend architecture emphasizes:

- scalable project organization,
- strong type safety with TypeScript,
- automatic API contract synchronization,
- centralized HTTP communication,
- reusable components,
- maintainable routing,
- efficient server-state management,
- automated testing.

---

# ✅ Completion Criteria

The project setup is considered complete when:

- dependencies install successfully,
- the application starts using:

```bash
npm run dev
```

- all tests pass successfully:

```bash
npm run test
```

Once these conditions are met, the project is ready for further feature development and integration with the backend.
````
