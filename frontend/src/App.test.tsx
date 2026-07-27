import {render} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import App from './App';
import {MemoryRouter} from "react-router-dom";

describe('App Component Smoke Test', () => {
    it('renders without crashing', () => {
        const {container} = render(
            <MemoryRouter>
                <App/>
            </MemoryRouter>
        );
        expect(container).toBeInTheDocument();
    });
});