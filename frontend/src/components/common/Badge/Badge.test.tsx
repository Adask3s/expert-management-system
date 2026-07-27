import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {Badge} from './Badge';

describe('Badge Component', () => {
    // Test dla wariantu 3 - domyślnego (default)
    it('renders children correctly in default variant', () => {
        render(<Badge>245 records</Badge>);

        // Sprawdzamy, czy tekst przekazany w children znajduje się w dokumencie
        expect(screen.getByText('245 records')).toBeInTheDocument();
    });

    // Test dla wariantu 1.1  - status (Active)
    it('renders Active status correctly', () => {
        render(<Badge variant="status" status="active"/>);

        expect(screen.getByText('Active')).toBeInTheDocument();
    });

    // Test dla wariantu 1.2 - status (Inactive)
    it('renders Inactive status correctly', () => {
        render(<Badge variant="status" status="inactive"/>);

        expect(screen.getByText('Inactive')).toBeInTheDocument();
    });

    // Test dla wariantu 2 - umiejętność (domain)
    it('renders domain and level name for skill variant', () => {
        render(
            <Badge
                variant="skill"
                domainName="Java"
                levelName="Professional"
                level={3}
            />
        );

        expect(screen.getByText('Java')).toBeInTheDocument();
        expect(screen.getByText('Professional')).toBeInTheDocument();
        expect(screen.getByText('∙')).toBeInTheDocument();
    });

    // Testy sprawdzające poprawność renderowania różnych poziomów (1-4)
    it.each([
        {level: 1 as const, name: 'Awareness'},
        {level: 2 as const, name: 'Functional'},
        {level: 3 as const, name: 'Professional'},
        {level: 4 as const, name: 'Master'},
    ])('renders skill variant correctly for level $level ($name)', ({level, name}) => {
        render(
            <Badge
                variant="skill"
                domainName="TestDomain"
                levelName={name}
                level={level}
            />
        );

        expect(screen.getByText('TestDomain')).toBeInTheDocument();
        expect(screen.getByText(name)).toBeInTheDocument();
    });
});