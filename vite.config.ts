import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import dts from 'vite-plugin-dts'

export default defineConfig(() => {
    return {
        plugins: [react(), dts()],
        build: {
            sourcemap: true,
            lib:  {
                formats: ['es', 'umd'],
                entry: './src/index.ts',
                name: 'lfQueue',
                fileName: (format) => `index.${format}.js`,
            },
            rollupOptions: {
                // make sure to externalize deps that shouldn't be bundled
                // into your library
                external: ['localforage'],
                output: {
                    // Provide global variables to use in the UMD build
                    // for externalized deps
                    globals: {
                        vue: 'localforage',
                    },
                },
            },

        },
        define: {},
    }
})
