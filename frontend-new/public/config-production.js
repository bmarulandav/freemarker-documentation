// Configuración de API para diferentes entornos
class ApiConfig {
    constructor() {
        // Detectar entorno
        this.isDevelopment = window.location.hostname === 'localhost';
        this.isNetlify = window.location.hostname.includes('netlify.app');
        
        // Configurar URL base según el entorno
        if (this.isDevelopment) {
            this.baseURL = 'http://localhost:5000';
        } else {
            // URL de producción - Railway backend
            this.baseURL = 'https://freemarker-documentation-production.up.railway.app';
        }
    }

    getApiUrl(endpoint) {
        return `${this.baseURL}/api${endpoint}`;
    }

    // Métodos de conveniencia
    get healthUrl() { return this.getApiUrl('/health'); }
    get examplesUrl() { return this.getApiUrl('/examples'); }
    get processTemplateUrl() { return this.getApiUrl('/process-template'); }
    get categoriesUrl() { return this.getApiUrl('/categories'); }
}

// Instancia global de configuración
window.apiConfig = new ApiConfig();

console.log('🚀 API Config:', {
    isDevelopment: window.apiConfig.isDevelopment,
    isNetlify: window.apiConfig.isNetlify,
    baseURL: window.apiConfig.baseURL
});
