/**
 * Main Application Entry Point
 * LocalStorage ашиглан бүх зүйл ажиллана (Backend хэрэггүй!)
 */

// Mock API компонентууд import хийх (LocalStorage)
import {
    TokenManager,
    UserManager,
    AuthAPI,
    LoansAPI,
    PaymentsAPI,
    WalletAPI,
    PromoCodeAPI
} from './components/mock-api.component.js';

// Бусад компонентууд
import { initAuth } from './components/auth.component.js';
import { initNavigation } from './components/navigation.component.js';
import { Utils } from './components/utils.component.js';

// Global объектууд window-д нэмэх (backward compatibility)
window.TokenManager = TokenManager;
window.UserManager = UserManager;
window.AuthAPI = AuthAPI;
window.LoansAPI = LoansAPI;
window.PaymentsAPI = PaymentsAPI;
window.WalletAPI = WalletAPI;
window.PromoCodeAPI = PromoCodeAPI;
window.Utils = Utils;

// Application эхлүүлэх
function initApp() {
    console.log('🚀 OmniCredit App initializing...');
    console.log('💾 Running in LocalStorage mode (No backend required)');

    // Navigation эхлүүлэх
    initNavigation();
    console.log('✅ Navigation initialized');

    // Auth guard эхлүүлэх
    initAuth();
    console.log('✅ Auth guard initialized');

    console.log('✨ OmniCredit App ready!');
    console.log('');
    console.log('🧪 TEST ACCOUNTS:');
    console.log('   📧 bat@test.com / 123456');
    console.log('   📧 admin@test.com / admin123 (Admin)');
}

// DOM бэлэн болоход эхлүүлэх
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Export for module usage
export {
    TokenManager,
    UserManager,
    AuthAPI,
    LoansAPI,
    PaymentsAPI,
    WalletAPI,
    PromoCodeAPI,
    Utils
};
