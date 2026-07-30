import {render} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import App from './App';
import {MemoryRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

// Inicjujemy czystą instancję QueryClient specjalnie dla testów
const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false, // Wyłączamy retry, żeby testy failowały natychmiast
            gcTime: 0,    // Wyłączamy cache, żeby testy były od siebie niezależne
        },
    },
});

describe('App Component Smoke Test', () => {
    it('renders without crashing', () => {
        // Pobieramy świeżego klienta dla tego konkretnego testu
        const testQueryClient = createTestQueryClient();

        const {container} = render(
            // Oplatamy aplikację Providerem od TanStack Query, analogicznie jak w main.tsx
            <QueryClientProvider client={testQueryClient}>
                <MemoryRouter>
                    <App/>
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(container).toBeInTheDocument();
    });
});