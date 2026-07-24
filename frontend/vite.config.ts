import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';

// Wsparcie dla importu SVG jako komponnetów Reacta
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    plugins: [react(), svgr()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/setupTests.ts',
    },
});