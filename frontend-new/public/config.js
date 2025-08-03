// Configuración de API para diferentes entornos
class ApiConfig {
    constructor() {
        // Detectar si estamos en producción (usando Docker/Nginx) o desarrollo
        this.isDevelopment = window.location.hostname === 'localhost' && window.location.port === '3000';
        this.baseURL = this.isDevelopment ? 'http://localhost:5000' : '';
    }

    getApiUrl(endpoint) {
        return `${this.baseURL}/api${endpoint}`;
    }

    // Métodos de conveniencia
    get healthUrl() { return this.getApiUrl('/health'); }
    get examplesUrl() { return this.getApiUrl('/examples'); }
    get processTemplateUrl() { return this.getApiUrl('/process-template'); }
}

// Instancia global de configuración
window.apiConfig = new ApiConfig();
