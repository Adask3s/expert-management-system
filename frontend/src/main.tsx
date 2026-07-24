import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import App from './App.tsx'

// Globalny import tokenów - deklaruje zmienne :root w całej aplikacji
import './styles/tokens.css';

// tworzymy instancję QueryClient do zarządzania zapytaniami REST API
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // dobra praktyka: nie odświeżamy danych przy każdej zmianie zakładki
            retry: 1,
        },
    },
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {/* dostarczamy mechanizm zapytań do całej aplikacji */}
        <QueryClientProvider client={queryClient}>
            {/* dostarczamy mechanizm routingu (ścieżek) do całej aplikacji */}
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>,
)