import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    },
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code
          'vendor': [
            './src/services/api.js',
            './src/router.js'
          ],
          // Split page components
          'pages-auth': [
            './src/pages/login-page.js',
            './src/pages/register-page.js'
          ],
          'pages-main': [
            './src/pages/dashboard-page.js',
            './src/pages/home-page.js'
          ],
          'pages-loan': [
            './src/pages/loan-application-page.js',
            './src/pages/loans-page.js',
            './src/pages/loan-calculator-page.js'
          ],
          'pages-payment': [
            './src/pages/payment-page.js',
            './src/pages/payment-history-page.js'
          ],
          'pages-other': [
            './src/pages/profile-page.js',
            './src/pages/wallet-history-page.js',
            './src/pages/admin-page.js',
            './src/pages/faq-page.js',
            './src/pages/about-page.js'
          ],
          // Split components
          'components': [
            './src/components/app-nav.js',
            './src/components/app-footer.js',
            './src/components/loan-card.js',
            './src/components/theme-toggle.js'
          ]
        }
      }
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 500
  },
  server: {
    port: 5173,
    strictPort: false,
    // Enable HTTP/2 for better performance
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: []
  }
});
