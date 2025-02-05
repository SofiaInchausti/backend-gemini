import { defineConfig } from 'vitest/config';
export default defineConfig({
    test: {
        coverage: {
            provider: 'v8', // O puedes usar 'c8' si prefieres esa opción
            reporter: ['text', 'html'], // Aquí puedes elegir varios reporteros
            include: ['src/tests/**/*.ts', 'src/test/**/*.tsx'], // Incluye los archivos que deseas monitorear para la cobertura
            exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'], // Excluye los archivos de test (si es necesario)
        },
    },
});
