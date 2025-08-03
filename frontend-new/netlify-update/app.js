// Router simple para SPA
class FreeMarkerRouter {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        // No inicializar automáticamente
    }

    init() {
        // Configurar event listeners
        window.addEventListener('popstate', () => this.handleRoute());
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                e.preventDefault();
                this.navigate(e.target.getAttribute('data-route'));
            }
        });

        // Cargar ruta inicial
        this.handleRoute();
    }

    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        this.handleRoute();
    }

    handleRoute() {
        const path = window.location.pathname;
        this.currentRoute = path;
        
        console.log(`🧭 Navegando a: ${path}`);
        
        // Buscar handler para la ruta
        const handler = this.routes[path] || this.routes['/404'];
        if (handler) {
            console.log(`✅ Handler encontrado para: ${path}`);
            handler();
        } else {
            console.log(`❌ No se encontró handler para: ${path}`);
            // Si no hay handler y es la ruta raíz, forzar home
            if (path === '/' && this.routes['/']) {
                console.log('🏠 Forzando renderizado de home');
                this.routes['/']();
            }
        }
    }
}

// Componentes de la aplicación
class FreeMarkerApp {
    constructor() {
        // Verificar que el elemento app existe
        if (!document.getElementById('app')) {
            console.error('Elemento #app no encontrado');
            return;
        }
        
        console.log('🚀 Inicializando FreeMarkerApp...');
        
        // Crear router sin inicializar aún
        this.router = new FreeMarkerRouter();
        
        // Configurar rutas ANTES de inicializar
        this.setupRoutes();
        
        // Ahora sí inicializar el router (esto ejecutará handleRoute)
        this.router.init();
        
        // Crear navegación y otros elementos
        this.createNavigation();
        this.initCopyButtons();
        
        // Forzar renderizado inicial después de configurar todo
        console.log('🏠 Forzando renderizado inicial...');
        setTimeout(() => {
            if (window.location.pathname === '/') {
                this.renderHome();
            } else {
                this.router.handleRoute();
            }
        }, 100);
        
        // Marcar como inicializada
        window.appInitialized = true;
        
        console.log('✅ FreeMarkerApp inicializada correctamente');
    }

    setupRoutes() {
        this.router.addRoute('/', () => this.renderHome());
        this.router.addRoute('/sintaxis', () => this.renderSyntax());
        this.router.addRoute('/variables', () => this.renderVariables());
        this.router.addRoute('/directivas', () => this.renderDirectives());
        this.router.addRoute('/funciones', () => this.renderFunctions());
        this.router.addRoute('/macros', () => this.renderMacros());
        this.router.addRoute('/liferay', () => this.renderLiferay());
        this.router.addRoute('/ejemplos', () => this.renderExamples());
        this.router.addRoute('/ejemplos/basicos', () => this.renderBasicExamples());
        this.router.addRoute('/ejemplos/avanzados', () => this.renderAdvancedExamples());
        this.router.addRoute('/ejemplos/liferay', () => this.renderLiferayExamples());
        this.router.addRoute('/playground', () => this.renderPlayground());
        // Rutas en inglés (alias)
        this.router.addRoute('/examples', () => this.renderExamples());
        this.router.addRoute('/examples/basic', () => this.renderBasicExamples());
        this.router.addRoute('/examples/advanced', () => this.renderAdvancedExamples());
        this.router.addRoute('/examples/liferay', () => this.renderLiferayExamples());
        this.router.addRoute('/404', () => this.render404());
    }

    createNavigation() {
        const nav = `
            <nav class="navbar">
                <div class="nav-container">
                    <div class="nav-brand">
                        <a href="/" data-route="/">🚀 FreeMarker Docs</a>
                    </div>
                    <div class="nav-menu">
                        <div class="nav-dropdown">
                            <span class="nav-link">📚 Documentación</span>
                            <div class="nav-dropdown-content">
                                <a href="/sintaxis" data-route="/sintaxis">Sintaxis Básica</a>
                                <a href="/variables" data-route="/variables">Variables</a>
                                <a href="/directivas" data-route="/directivas">Directivas</a>
                                <a href="/funciones" data-route="/funciones">Funciones</a>
                                <a href="/macros" data-route="/macros">Macros</a>
                                <a href="/liferay" data-route="/liferay">Liferay DXP</a>
                            </div>
                        </div>
                        <div class="nav-dropdown">
                            <span class="nav-link">💡 Ejemplos</span>
                            <div class="nav-dropdown-content">
                                <a href="/ejemplos" data-route="/ejemplos">Todos los Ejemplos</a>
                                <a href="/ejemplos/basicos" data-route="/ejemplos/basicos">Básicos</a>
                                <a href="/ejemplos/avanzados" data-route="/ejemplos/avanzados">Avanzados</a>
                                <a href="/ejemplos/liferay" data-route="/ejemplos/liferay">Liferay</a>
                            </div>
                        </div>
                        <a href="/playground" data-route="/playground" class="nav-link">🎮 Playground</a>
                    </div>
                </div>
            </nav>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', nav);
    }

    renderHome() {
        console.log('🏠 Renderizando página de inicio...');
        this.setTitle('FreeMarker Docs - Inicio');
        
        const appElement = document.getElementById('app');
        if (!appElement) {
            console.error('❌ Elemento #app no encontrado');
            return;
        }
        
        appElement.innerHTML = `
            <div class="container">
                <div class="hero">
                    <h1>🚀 FreeMarker Documentation</h1>
                    <p class="hero-subtitle">Documentación completa y ejemplos prácticos para FreeMarker en Liferay DXP</p>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">8</div>
                        <div class="stat-label">Ejemplos Prácticos</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">4</div>
                        <div class="stat-label">Categorías</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">100%</div>
                        <div class="stat-label">Funcional</div>
                    </div>
                </div>

                <div class="quick-links">
                    <h2>🎯 Empezar Aquí</h2>
                    <div class="links-grid">
                        <a href="/sintaxis" data-route="/sintaxis" class="quick-link">
                            <div class="quick-link-icon">📝</div>
                            <div class="quick-link-title">Sintaxis Básica</div>
                            <div class="quick-link-desc">Aprende la sintaxis fundamental de FreeMarker</div>
                        </a>
                        <a href="/ejemplos/basicos" data-route="/ejemplos/basicos" class="quick-link">
                            <div class="quick-link-icon">🔰</div>
                            <div class="quick-link-title">Ejemplos Básicos</div>
                            <div class="quick-link-desc">Ejemplos simples para empezar</div>
                        </a>
                        <a href="/liferay" data-route="/liferay" class="quick-link">
                            <div class="quick-link-icon">🏢</div>
                            <div class="quick-link-title">Liferay DXP</div>
                            <div class="quick-link-desc">Integración específica con Liferay</div>
                        </a>
                        <a href="/playground" data-route="/playground" class="quick-link">
                            <div class="quick-link-icon">🎮</div>
                            <div class="quick-link-title">Playground</div>
                            <div class="quick-link-desc">Prueba código en tiempo real</div>
                        </a>
                    </div>
                </div>

                <div class="backend-status">
                    <div id="backend-indicator">
                        <span class="status-dot"></span>
                        <span>Conectando con API...</span>
                    </div>
                </div>
            </div>
        `;
        
        console.log('✅ Página de inicio renderizada');
        this.checkBackendStatus();
    }

    renderSyntax() {
        this.setTitle('FreeMarker Docs - Sintaxis');
        document.getElementById('app').innerHTML = `
            <div class="container">
                <div class="page-header">
                    <h1>📝 Sintaxis Básica de FreeMarker</h1>
                    <p>Aprende los fundamentos de la sintaxis de FreeMarker paso a paso</p>
                </div>

                <div class="content-grid">
                    <div class="syntax-section">
                        <h2>🔤 Variables</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>FreeMarker</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code>\${nombreVariable}
\${usuario.nombre}
\${producto.precio?string.currency}</code></pre>
                        </div>
                    </div>

                    <div class="syntax-section">
                        <h2>🔀 Directivas</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>FreeMarker</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code>&lt;#if condicion&gt;
    Contenido si es verdadero
&lt;#else&gt;
    Contenido si es falso
&lt;/#if&gt;</code></pre>
                        </div>
                    </div>

                    <div class="syntax-section">
                        <h2>🔄 Bucles</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>FreeMarker</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code>&lt;#list items as item&gt;
    \${item.nombre}
&lt;/#list&gt;</code></pre>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderPlayground() {
        this.setTitle('FreeMarker Docs - Playground');
        
        // Obtener parámetros de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const exampleSlug = urlParams.get('example');
        
        document.getElementById('app').innerHTML = `
            <div class="container">
                <div class="page-header">
                    <h1>🎮 FreeMarker Playground</h1>
                    <p>Prueba y experimenta con código FreeMarker en tiempo real</p>
                    ${exampleSlug ? '<div class="loading-example">Cargando ejemplo...</div>' : ''}
                </div>

                <div class="playground">
                    <div class="playground-section">
                        <h3>📝 Código FreeMarker</h3>
                        <textarea id="freemarker-input" placeholder="Escribe tu código FreeMarker aquí..."></textarea>
                    </div>
                    
                    <div class="playground-section">
                        <h3>📊 Datos JSON</h3>
                        <textarea id="json-input" placeholder="Datos en formato JSON...">{
  "usuario": {
    "nombre": "Juan",
    "edad": 30
  },
  "productos": [
    {"nombre": "Laptop", "precio": 999.99},
    {"nombre": "Mouse", "precio": 25.50}
  ]
}</textarea>
                    </div>
                    
                    <div class="playground-section full-width">
                        <div class="playground-controls">
                            <h3>🎯 Resultado</h3>
                            <button id="process-btn" class="btn-primary">🚀 Procesar</button>
                        </div>
                        <div id="output" class="output">
                            <div class="output-placeholder">
                                El resultado aparecerá aquí después de procesar...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.initPlayground(exampleSlug);
    }

    initPlayground(exampleSlug = null) {
        // Si hay un ejemplo específico, cargarlo
        if (exampleSlug) {
            this.loadExampleInPlayground(exampleSlug);
        } else {
            // Cargar ejemplo por defecto
            this.loadDefaultPlaygroundContent();
        }

        const processBtn = document.getElementById('process-btn');
        if (processBtn) {
            processBtn.addEventListener('click', () => {
                const template = document.getElementById('freemarker-input').value;
                const data = document.getElementById('json-input').value;
                
                fetch(window.apiConfig.processTemplateUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ template, data })
                })
                .then(response => response.json())
                .then(result => {
                    document.getElementById('output').innerHTML = `
                        <pre><code>${result.output || result.error}</code></pre>
                    `;
                })
                .catch(error => {
                    document.getElementById('output').innerHTML = `
                        <div class="error">Error: ${error.message}</div>
                    `;
                });
            });
        }
        
        // Agregar funcionalidad de copia después de renderizar
        this.initCopyButtons();
    }

    loadDefaultPlaygroundContent() {
        const freemarkerInput = document.getElementById('freemarker-input');
        if (freemarkerInput) {
            freemarkerInput.value = `<#assign nombre = "Mundo">
¡Hola \${nombre}!

<#list [1, 2, 3, 4, 5] as numero>
Número: \${numero}
</#list>`;
        }
    }

    async loadExampleInPlayground(exampleSlug) {
        try {
            console.log('🔍 Cargando ejemplo:', exampleSlug);
            
            // Buscar el ejemplo por slug usando la API
            const response = await fetch(window.apiConfig.examplesUrl);
            const result = await response.json();
            const examples = result.data || result;
            
            console.log('📊 Ejemplos disponibles:', examples.map(ex => ({ slug: ex.slug, title: ex.title })));
            
            const example = examples.find(ex => ex.slug === exampleSlug || ex._id === exampleSlug);
            
            if (example) {
                console.log('✅ Ejemplo encontrado:', example.title);
                console.log('📝 Código del ejemplo:', example.code);
                
                // Actualizar el título de la página
                const pageHeader = document.querySelector('.page-header h1');
                if (pageHeader) {
                    pageHeader.innerHTML = `🎮 FreeMarker Playground - ${example.title}`;
                }
                
                // Cargar el código del ejemplo
                const freemarkerInput = document.getElementById('freemarker-input');
                if (freemarkerInput && example.code) {
                    freemarkerInput.value = example.code;
                    console.log('✅ Código cargado en textarea');
                }
                
                // Cargar datos JSON específicos para el ejemplo
                const jsonInput = document.getElementById('json-input');
                if (jsonInput) {
                    const exampleData = this.getExampleSpecificData(example);
                    jsonInput.value = JSON.stringify(exampleData, null, 2);
                }
                
                // Remover mensaje de carga
                const loadingMsg = document.querySelector('.loading-example');
                if (loadingMsg) {
                    loadingMsg.remove();
                }
                
                console.log('✅ Ejemplo cargado en playground');
            } else {
                console.log('❌ Ejemplo no encontrado:', exampleSlug);
                console.log('📊 Slugs disponibles:', examples.map(ex => ex.slug));
                this.loadDefaultPlaygroundContent();
            }
        } catch (error) {
            console.error('❌ Error cargando ejemplo:', error);
            this.loadDefaultPlaygroundContent();
        }
    }

    getExampleSpecificData(example) {
        // Datos específicos basados en el título o slug del ejemplo
        if (example.title.toLowerCase().includes('básico') || example.title.toLowerCase().includes('basic')) {
            return {
                user: {
                    name: "Juan Pérez"
                },
                site: {
                    name: "Mi Sitio Web"
                },
                articles: [
                    { title: "Primer artículo" },
                    { title: "Segundo artículo" },
                    { title: "Tercer artículo" }
                ]
            };
        } else if (example.title.toLowerCase().includes('loop') || example.title.toLowerCase().includes('condicional')) {
            // Para loops y condicionales, datos vacíos ya que el código define sus propias variables
            return {
                message: "Este ejemplo define sus propias variables con #assign",
                note: "No necesita datos externos"
            };
        } else if (example.title.toLowerCase().includes('variable')) {
            return {
                content: {
                    title: "Mi Artículo de Ejemplo",
                    author: "Ana García",
                    publishDate: new Date().toISOString(),
                    tags: ["freemarker", "liferay", "template"]
                }
            };
        } else {
            // Datos por defecto
            return {
                usuario: {
                    nombre: "Juan",
                    edad: 30
                },
                productos: [
                    {"nombre": "Laptop", "precio": 999.99},
                    {"nombre": "Mouse", "precio": 25.50}
                ]
            };
        }
    }

    initCopyButtons() {
        // Agregar event listeners a todos los botones de copiar
        document.addEventListener('click', (e) => {
            if (e.target.matches('.copy-btn')) {
                const codeBlock = e.target.closest('.code-example').querySelector('code');
                if (codeBlock) {
                    navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                        const originalText = e.target.textContent;
                        e.target.textContent = '✅ Copiado';
                        e.target.style.background = '#28a745';
                        
                        setTimeout(() => {
                            e.target.textContent = originalText;
                            e.target.style.background = '#667eea';
                        }, 2000);
                    }).catch(err => {
                        console.error('Error al copiar:', err);
                        e.target.textContent = '❌ Error';
                        setTimeout(() => {
                            e.target.textContent = '📋 Copiar';
                        }, 2000);
                    });
                }
            }
        });
    }

    renderExamples() {
        this.setTitle('FreeMarker Docs - Ejemplos');
        document.getElementById('app').innerHTML = `
            <div class="container">
                <div class="page-header">
                    <h1>💡 Ejemplos de FreeMarker</h1>
                    <p>Ejemplos prácticos organizados por categorías</p>
                </div>

                <div class="examples-grid" id="examples-container">
                    <div class="loading">Cargando ejemplos...</div>
                </div>
            </div>
        `;
        
        this.loadExamples();
    }

    async loadExamples() {
        try {
            // Agregar timestamp para evitar caché
            const timestamp = new Date().getTime();
            const response = await fetch(`${window.apiConfig.examplesUrl}?t=${timestamp}`);
            const result = await response.json();
            
            // El backend devuelve {data: [...]}
            const examples = result.data || result;
            
            // Debug: Log para verificar ejemplos recibidos
            console.log('🔍 Debug - Ejemplos recibidos:', examples.length);
            console.log('🔍 Debug - Títulos:', examples.map(ex => ex.title));
            
            // Limpiar contenedor antes de agregar contenido
            const container = document.getElementById('examples-container');
            if (!container) {
                throw new Error('No se encontró el contenedor examples-container');
            }
            
            // Limpiar completamente el contenedor
            container.innerHTML = '';
            
            // Verificar que examples sea un array
            if (!Array.isArray(examples)) {
                throw new Error('La respuesta no contiene un array de ejemplos');
            }
            
            // Eliminar posibles duplicados basados en _id (por si acaso)
            const uniqueExamples = examples.filter((example, index, self) => 
                index === self.findIndex(e => e._id === example._id)
            );
            
            if (uniqueExamples.length === 0) {
                container.innerHTML = `
                    <div class="no-examples">
                        <h3>No hay ejemplos disponibles</h3>
                        <p>No se encontraron ejemplos en la base de datos.</p>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = uniqueExamples.map(example => `
                <div class="example-card">
                    <div class="example-header">
                        <h3>${example.title || 'Sin título'}</h3>
                        <span class="example-category">${example.category?.name || 'Sin categoría'}</span>
                    </div>
                    <p class="example-description">${example.description || 'Sin descripción'}</p>
                    <div class="example-code-preview">
                        <pre><code>${(example.code || '').substring(0, 150)}...</code></pre>
                    </div>
                    <div class="example-footer">
                        <span class="example-difficulty">${example.difficulty || 'Sin dificultad'}</span>
                        <a href="/playground?example=${example.slug || example._id}" data-route="/playground?example=${example.slug || example._id}" class="view-example-btn">
                            🎮 Probar
                        </a>
                    </div>
                </div>
            `).join('');
            
        } catch (error) {
            const container = document.getElementById('examples-container');
            if (container) {
                container.innerHTML = `
                    <div class="error">
                        <h3>❌ Error cargando ejemplos</h3>
                        <p><strong>Detalles:</strong> ${error.message}</p>
                        <p>Verifica que el backend esté funcionando en http://localhost:5000/api/examples</p>
                    </div>
                `;
            }
        }
    }

    checkBackendStatus() {
        const indicator = document.getElementById('backend-indicator');
        if (!indicator) return;

        fetch(window.apiConfig.healthUrl)
            .then(response => response.json())
            .then(data => {
                indicator.innerHTML = `
                    <span class="status-dot connected"></span>
                    <span>✅ Backend conectado correctamente</span>
                `;
            })
            .catch(error => {
                indicator.innerHTML = `
                    <span class="status-dot disconnected"></span>
                    <span>⚠️ Backend no disponible</span>
                `;
            });
    }

    setTitle(title) {
        document.title = title;
    }

    // Métodos placeholder para otras rutas
    renderVariables() {
        this.setTitle('FreeMarker Docs - Variables');
        document.getElementById('app').innerHTML = `
            <div class="container">
                <div class="page-header">
                    <h1>🔤 Variables en FreeMarker</h1>
                    <p>Aprende a trabajar con variables, tipos de datos y expresiones</p>
                </div>

                <div class="content-grid">
                    <div class="syntax-section">
                        <h2>📋 Tipos de Variables</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>Tipos básicos</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code><#-- Strings -->
\${nombre}
\${usuario.email}

<#-- Números -->
\${edad}
\${precio?string.currency}

<#-- Booleanos -->
\${activo?string("Sí", "No")}

<#-- Fechas -->
\${fecha?string("dd/MM/yyyy")}
\${ahora?string("HH:mm:ss")}</code></pre>
                        </div>
                    </div>

                    <div class="syntax-section">
                        <h2>🔧 Operadores y Expresiones</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>Operadores</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code><#-- Operadores aritméticos -->
\${precio + impuesto}
\${total - descuento}
\${cantidad * precio}
\${total / personas}

<#-- Operadores de comparación -->
\${edad >= 18}
\${precio < 100}
\${nombre == "admin"}

<#-- Operadores lógicos -->
\${activo && premium}
\${nuevo || destacado}</code></pre>
                        </div>
                    </div>

                    <div class="syntax-section">
                        <h2>🛡️ Manejo Seguro de Variables</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>Valores por defecto</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code><#-- Valor por defecto si no existe -->
\${nombre!"Sin nombre"}
\${usuario.email!"No especificado"}

<#-- Verificar existencia -->
<#if usuario??>
    \${usuario.nombre}
</#if>

<#-- Verificar contenido -->
<#if descripcion?has_content>
    \${descripcion}
<#else>
    Sin descripción disponible
</#if></code></pre>
                        </div>
                    </div>

                    <div class="syntax-section">
                        <h2>📊 Funciones Built-in para Variables</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>Funciones útiles</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code><#-- Manipulación de strings -->
\${nombre?upper_case}
\${titulo?lower_case}
\${texto?cap_first}
\${descripcion?length}

<#-- Formateo de números -->
\${precio?string("#,##0.00")}
\${porcentaje?string.percent}

<#-- Manipulación de fechas -->
\${fecha?string("EEEE, d MMMM yyyy")}
\${fecha?date}
\${hora?time}</code></pre>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderDirectives() {
        this.setTitle('FreeMarker Docs - Directivas');
        document.getElementById('app').innerHTML = `
            <div class="container">
                <div class="page-header">
                    <h1>🔀 Directivas de FreeMarker</h1>
                    <p>Controla el flujo de tu template con directivas potentes</p>
                </div>

                <div class="content-grid">
                    <div class="syntax-section">
                        <h2>🔀 Directiva #if</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>Condicionales</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code><#-- Condicional simple -->
<#if usuario.activo>
    <span class="badge-active">Usuario Activo</span>
<#else>
    <span class="badge-inactive">Usuario Inactivo</span>
</#if>

<#-- Múltiples condiciones -->
<#if usuario.rol == "admin">
    <div class="admin-panel">Panel de Administración</div>
<#elseif usuario.rol == "editor">
    <div class="editor-panel">Panel de Editor</div>
<#else>
    <div class="user-panel">Panel de Usuario</div>
</#if></code></pre>
                        </div>
                    </div>

                    <div class="syntax-section">
                        <h2>🔄 Directiva #list</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>Bucles</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code><#-- Lista simple -->
<ul>
<#list productos as producto>
    <li>\${producto.nombre} - \${producto.precio?string.currency}</li>
</#list>
</ul>

<#-- Con información de índice -->
<#list articulos as articulo>
    <div class="articulo-\${articulo?index}">
        <h3>\${articulo.titulo}</h3>
        <p>Artículo #\${articulo?counter} de \${articulos?size}</p>
        <#if articulo?is_first>
            <span class="primera">¡Primer artículo!</span>
        </#if>
        <#if articulo?is_last>
            <span class="ultima">¡Último artículo!</span>
        </#if>
    </div>
</#list></code></pre>
                        </div>
                    </div>

                    <div class="syntax-section">
                        <h2>📝 Directiva #assign</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>Asignación de variables</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code><#-- Asignar valores -->
<#assign titulo = "Mi Página Web">
<#assign fechaActual = .now>
<#assign esAdmin = usuario.rol == "admin">

<#-- Asignar con cálculos -->
<#assign precioTotal = producto.precio * cantidad>
<#assign descuento = precioTotal * 0.1>
<#assign precioFinal = precioTotal - descuento>

<#-- Asignar contenido complejo -->
<#assign mensaje>
    <div class="alert">
        <h4>¡Bienvenido \${usuario.nombre}!</h4>
        <p>Último acceso: \${usuario.ultimoAcceso?string("dd/MM/yyyy")}</p>
    </div>
</#assign></code></pre>
                        </div>
                    </div>

                    <div class="syntax-section">
                        <h2>🎯 Directivas Avanzadas</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>Directivas útiles</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code><#-- #include para incluir otros templates -->
<#include "header.ftl">

<#-- #switch para múltiples opciones -->
<#switch usuario.tipo>
    <#case "premium">
        <div class="premium-content">Contenido Premium</div>
        <#break>
    <#case "basico">
        <div class="basic-content">Contenido Básico</div>
        <#break>
    <#default>
        <div class="guest-content">Contenido para Invitados</div>
</#switch>

<#-- #nested para macros con contenido -->
<#macro panel titulo>
    <div class="panel">
        <h3>\${titulo}</h3>
        <div class="panel-body">
            <#nested>
        </div>
    </div>
</#macro></code></pre>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderFunctions() {
        this.setTitle('FreeMarker Docs - Funciones');
        document.getElementById('app').innerHTML = `
            <div class="container">
                <div class="page-header">
                    <h1>⚙️ Funciones Built-in de FreeMarker</h1>
                    <p>Descubre todas las funciones incorporadas para procesar datos</p>
                </div>

                <div class="content-grid">
                    <div class="syntax-section">
                        <h2>📝 Funciones de String</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>Manipulación de texto</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code><#-- Transformaciones básicas -->
\${nombre?upper_case}       <!-- JUAN PÉREZ -->
\${nombre?lower_case}       <!-- juan pérez -->
\${nombre?cap_first}        <!-- Juan pérez -->
\${nombre?capitalize}       <!-- Juan Pérez -->

<#-- Información del string -->
\${texto?length}            <!-- 25 -->
\${texto?trim}              <!-- Sin espacios al inicio/final -->
\${url?url}                 <!-- Codificación URL -->
\${html?html}               <!-- Escape HTML -->

<#-- Búsqueda y reemplazo -->
\${texto?contains("palabra")}
\${texto?starts_with("Hola")}
\${texto?ends_with("mundo")}
\${texto?replace("viejo", "nuevo")}</code></pre>
                        </div>
                    </div>

                    <div class="syntax-section">
                        <h2>🔢 Funciones de Número</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>Formateo numérico</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code><#-- Formateo básico -->
\${precio?string.currency}     <!-- $1,234.56 -->
\${precio?string.percent}      <!-- 123% -->
\${numero?string("0.00")}      <!-- 123.45 -->
\${numero?string("#,##0")}     <!-- 1,234 -->

<#-- Operaciones matemáticas -->
\${numero?abs}                 <!-- Valor absoluto -->
\${numero?round}               <!-- Redondear -->
\${numero?floor}               <!-- Redondear hacia abajo -->
\${numero?ceiling}             <!-- Redondear hacia arriba -->

<#-- Conversiones -->
\${numero?c}                   <!-- Para uso en JavaScript -->
\${string?number}              <!-- String a número --></code></pre>
                        </div>
                    </div>

                    <div class="syntax-section">
                        <h2>📅 Funciones de Fecha</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>Manejo de fechas</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code><#-- Formateo de fechas -->
\${fecha?string("dd/MM/yyyy")}        <!-- 27/07/2025 -->
\${fecha?string("EEEE, d MMMM yyyy")} <!-- Domingo, 27 julio 2025 -->
\${fecha?string.short}                <!-- 27/07/25 -->
\${fecha?string.medium}               <!-- 27 jul 2025 -->
\${fecha?string.long}                 <!-- 27 de julio de 2025 -->

<#-- Componentes de fecha -->
\${fecha?date}                        <!-- Solo la fecha -->
\${fecha?time}                        <!-- Solo la hora -->
\${fecha?datetime}                    <!-- Fecha y hora -->

<#-- Fecha actual -->
\${.now?string("dd/MM/yyyy HH:mm")}</code></pre>
                        </div>
                    </div>

                    <div class="syntax-section">
                        <h2>📋 Funciones de Lista/Array</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>Manipulación de listas</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code><#-- Información de la lista -->
\${lista?size}                 <!-- Tamaño de la lista -->
\${lista?has_content}          <!-- true si tiene elementos -->
\${lista?first}                <!-- Primer elemento -->
\${lista?last}                 <!-- Último elemento -->

<#-- Manipulación -->
\${lista?join(", ")}           <!-- Unir con separador -->
\${lista?reverse}              <!-- Lista invertida -->
\${lista?sort}                 <!-- Lista ordenada -->
\${lista?sort_by("nombre")}    <!-- Ordenar por propiedad -->

<#-- Búsqueda -->
\${lista?seq_contains("valor")}
\${lista?seq_index_of("valor")}</code></pre>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderMacros() {
        this.setTitle('FreeMarker Docs - Macros');
        document.getElementById('app').innerHTML = `
            <div class="container">
                <div class="page-header">
                    <h1>🛠️ Macros en FreeMarker</h1>
                    <p>Crea componentes reutilizables con macros personalizadas</p>
                </div>

                <div class="content-grid">
                    <div class="syntax-section">
                        <h2>🎯 Definir Macros</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>Macro básica</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code><#-- Macro simple sin parámetros -->
<#macro saludo>
    <div class="saludo">
        <h2>¡Hola desde una macro!</h2>
    </div>
</#macro>

<#-- Usar la macro -->
<@saludo />

<#-- Macro con parámetros -->
<#macro tarjeta titulo descripcion tipo="info">
    <div class="card card-\${tipo}">
        <div class="card-header">
            <h3>\${titulo}</h3>
        </div>
        <div class="card-body">
            <p>\${descripcion}</p>
        </div>
    </div>
</#macro>

<#-- Usar macro con parámetros -->
<@tarjeta titulo="Mi Tarjeta" descripcion="Esta es una tarjeta de ejemplo" tipo="success" /></code></pre>
                        </div>
                    </div>

                    <div class="syntax-section">
                        <h2>🎨 Macros con Contenido Anidado</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>Usando #nested</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code><#-- Macro que acepta contenido anidado -->
<#macro panel titulo icono="📋">
    <div class="panel">
        <div class="panel-header">
            <span class="icon">\${icono}</span>
            <h3>\${titulo}</h3>
        </div>
        <div class="panel-body">
            <#nested>
        </div>
    </div>
</#macro>

<#-- Usar la macro con contenido -->
<@panel titulo="Mi Panel" icono="🚀">
    <p>Este contenido va dentro del panel.</p>
    <ul>
        <li>Elemento 1</li>
        <li>Elemento 2</li>
    </ul>
</@panel></code></pre>
                        </div>
                    </div>

                    <div class="syntax-section">
                        <h2>🔧 Macros Avanzadas</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>Macros complejas</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code><#-- Macro para tabla de datos -->
<#macro tabla datos columnas clase="table">
    <table class="\${clase}">
        <thead>
            <tr>
                <#list columnas as columna>
                    <th>\${columna.titulo}</th>
                </#list>
            </tr>
        </thead>
        <tbody>
            <#list datos as fila>
                <tr>
                    <#list columnas as columna>
                        <td>\${fila[columna.campo]!"N/A"}</td>
                    </#list>
                </tr>
            </#list>
        </tbody>
    </table>
</#macro>

<#-- Macro para formulario -->
<#macro formulario accion metodo="POST">
    <form action="\${accion}" method="\${metodo}" class="form">
        <#nested>
        <div class="form-actions">
            <button type="submit" class="btn btn-primary">Enviar</button>
        </div>
    </form>
</#macro></code></pre>
                        </div>
                    </div>

                    <div class="syntax-section">
                        <h2>📚 Librería de Macros</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>Organizar macros</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code><#-- archivo: macros/ui.ftl -->
<#macro boton texto tipo="primary" tamano="md">
    <button class="btn btn-\${tipo} btn-\${tamano}">
        \${texto}
    </button>
</#macro>

<#macro alerta mensaje tipo="info" cerrable=true>
    <div class="alert alert-\${tipo}">
        \${mensaje}
        <#if cerrable>
            <button class="alert-close">×</button>
        </#if>
    </div>
</#macro>

<#-- En tu template principal -->
<#import "macros/ui.ftl" as ui>

<@ui.boton texto="Guardar" tipo="success" />
<@ui.alerta mensaje="¡Operación exitosa!" tipo="success" /></code></pre>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderLiferay() {
        this.setTitle('FreeMarker Docs - Liferay DXP');
        document.getElementById('app').innerHTML = `
            <div class="container">
                <div class="page-header">
                    <h1>🏢 FreeMarker en Liferay DXP</h1>
                    <p>Integración específica y objetos disponibles en Liferay</p>
                </div>

                <div class="content-grid">
                    <div class="syntax-section">
                        <h2>🌐 Objetos de Contexto en Liferay</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>Objetos principales</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code><#-- Información del usuario -->
\${user.getFullName()}
\${user.getEmailAddress()}
\${user.isSignedIn()}

<#-- Información del sitio -->
\${themeDisplay.getScopeGroup().getName()}
\${themeDisplay.getURLPortal()}
\${themeDisplay.getPathThemeImages()}

<#-- Información de la página -->
\${layout.getName(locale)}
\${layout.getFriendlyURL()}
\${layout.isPrivateLayout()}

<#-- Configuración del portlet -->
\${portletDisplay.getTitle()}
\${portletDisplay.getId()}
\${portletDisplay.getNamespace()}</code></pre>
                        </div>
                    </div>

                    <div class="syntax-section">
                        <h2>📝 Templates de Contenido Web</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>Web Content Templates</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code><#-- Acceder a campos del contenido -->
\${.vars['reserved-article-title'].data}
\${.vars['reserved-article-description'].data}

<#-- Campo de texto simple -->
<#if titulo.getData()?has_content>
    <h1>\${titulo.getData()}</h1>
</#if>

<#-- Campo de texto enriquecido -->
<#if contenido.getData()?has_content>
    <div class="content">
        \${contenido.getData()}
    </div>
</#if>

<#-- Campo de imagen -->
<#if imagen.getData()?has_content>
    <img src="\${imagen.getData()}" 
         alt="\${imagen.getAttribute("alt")}" 
         class="img-responsive">
</#if>

<#-- Campo de selección -->
<#assign categoriaData = categoria.getData()>
<#if categoriaData?has_content>
    <span class="category">\${categoriaData}</span>
</#if></code></pre>
                        </div>
                    </div>

                    <div class="syntax-section">
                        <h2>🎨 Application Display Templates (ADT)</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>ADT para Asset Publisher</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code><#-- Template para Asset Publisher -->
<div class="asset-grid">
    <#if entries?has_content>
        <#list entries as curEntry>
            <#assign entry = curEntry.getAssetRenderer().getAssetObject()>
            
            <div class="asset-card">
                <#-- Título del artículo -->
                <h3>
                    <a href="\${curEntry.getAssetRenderer().getURLViewInContext(renderRequest, renderResponse, "")}">
                        \${entry.getTitle(locale)}
                    </a>
                </h3>
                
                <#-- Resumen -->
                <#assign summary = entry.getDescription(locale)>
                <#if summary?has_content>
                    <p class="summary">\${summary}</p>
                </#if>
                
                <#-- Fecha de publicación -->
                <div class="meta">
                    <time>\${entry.getDisplayDate()?string("dd MMM yyyy")}</time>
                </div>
            </div>
        </#list>
    <#else>
        <div class="no-content">
            No hay contenido disponible.
        </div>
    </#if>
</div></code></pre>
                        </div>
                    </div>

                    <div class="syntax-section">
                        <h2>🔧 Utilidades de Liferay</h2>
                        <div class="code-example">
                            <div class="code-header">
                                <span>Servicios y utilidades</span>
                                <button class="copy-btn">📋 Copiar</button>
                            </div>
                            <pre><code><#-- Formateo de fechas con Liferay -->
\${dateUtil.getDate(fecha, "dd/MM/yyyy", locale)}

<#-- URLs amigables -->
\${portalUtil.getLayoutFriendlyURL(layout, themeDisplay)}

<#-- Escape de HTML -->
\${htmlUtil.escape(contenido)}

<#-- Formateo de números -->
\${numberFormat.format(precio)}

<#-- Verificar permisos -->
\${layoutPermission.contains(permissionChecker, layout, "VIEW")}

<#-- Obtener configuración del portlet -->
\${portletPreferences.getValue("configuracion", "valor-por-defecto")}

<#-- Generar namespace único -->
\${renderResponse.getNamespace()}id-unico</code></pre>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderBasicExamples() {
        this.setTitle('FreeMarker Docs - Ejemplos Básicos');
        document.getElementById('app').innerHTML = `
            <div class="container">
                <div class="page-header">
                    <h1>🔰 Ejemplos Básicos de FreeMarker</h1>
                    <p>Ejemplos simples para empezar con FreeMarker</p>
                </div>

                <div class="examples-grid" id="basic-examples-container">
                    <div class="loading">Cargando ejemplos básicos...</div>
                </div>
            </div>
        `;
        
        this.loadFilteredExamples('Básico');
    }

    renderAdvancedExamples() {
        this.setTitle('FreeMarker Docs - Ejemplos Avanzados');
        document.getElementById('app').innerHTML = `
            <div class="container">
                <div class="page-header">
                    <h1>🚀 Ejemplos Avanzados de FreeMarker</h1>
                    <p>Técnicas avanzadas y casos de uso complejos</p>
                </div>

                <div class="examples-grid" id="advanced-examples-container">
                    <div class="loading">Cargando ejemplos avanzados...</div>
                </div>
            </div>
        `;
        
        this.loadFilteredExamples('Avanzado');
    }

    renderLiferayExamples() {
        this.setTitle('FreeMarker Docs - Ejemplos Liferay');
        document.getElementById('app').innerHTML = `
            <div class="container">
                <div class="page-header">
                    <h1>🏢 Ejemplos para Liferay DXP</h1>
                    <p>Ejemplos específicos para integración con Liferay</p>
                </div>

                <div class="examples-grid" id="liferay-examples-container">
                    <div class="loading">Cargando ejemplos de Liferay...</div>
                </div>
            </div>
        `;
        
        this.loadFilteredExamples('Liferay');
    }

    render404() {
        this.setTitle('FreeMarker Docs - Página no encontrada');
        document.getElementById('app').innerHTML = `
            <div class="container">
                <div class="page-header">
                    <h1>❌ Página no encontrada</h1>
                    <p>La página que buscas no existe</p>
                </div>
                
                <div class="error-page">
                    <div class="error-code">404</div>
                    <div class="error-message">
                        <p>Lo sentimos, la página que estás buscando no existe.</p>
                        <a href="/" data-route="/" class="btn-primary">🏠 Volver al inicio</a>
                    </div>
                </div>
            </div>
        `;
    }

    async loadFilteredExamples(category) {
        try {
            console.log('🔍 Cargando ejemplos para categoría:', category);
            
            const response = await fetch(window.apiConfig.examplesUrl);
            const result = await response.json();
            
            // El backend devuelve {data: [...]}
            const allExamples = result.data || result;
            console.log('📊 Todos los ejemplos:', allExamples.length);
            
            // Verificar que allExamples sea un array
            if (!Array.isArray(allExamples)) {
                throw new Error('La respuesta no contiene un array de ejemplos');
            }
            
            // Debug: mostrar cada ejemplo
            allExamples.forEach((ex, i) => {
                console.log(`Ejemplo ${i + 1}:`, {
                    title: ex.title,
                    category: ex.category?.name,
                    difficulty: ex.difficulty
                });
            });
            
            // Filtrar ejemplos por categoría
            const filteredExamples = allExamples.filter(example => 
                example.category?.name === category || 
                example.difficulty === category.toLowerCase()
            );
            
            console.log('✅ Ejemplos filtrados:', filteredExamples.length);
            filteredExamples.forEach((ex, i) => {
                console.log(`Filtrado ${i + 1}:`, ex.title);
            });
            
            const containerId = category === 'Básico' ? 'basic-examples-container' :
                              category === 'Avanzado' ? 'advanced-examples-container' :
                              'liferay-examples-container';
            
            const container = document.getElementById(containerId);
            if (!container) {
                throw new Error(`No se encontró el contenedor ${containerId}`);
            }
            
            if (filteredExamples.length > 0) {
                console.log('📝 Generando HTML para', filteredExamples.length, 'ejemplos');
                
                const htmlParts = filteredExamples.map((example, index) => {
                    console.log(`Generando HTML para ejemplo ${index + 1}:`, example.title);
                    return `<div class="example-card">
                        <div class="example-header">
                            <h3>${example.title || 'Sin título'}</h3>
                            <span class="example-category">${example.category?.name || 'Sin categoría'}</span>
                        </div>
                        <p class="example-description">${example.description || 'Sin descripción'}</p>
                        <div class="example-code-preview">
                            <pre><code>${(example.code || '').substring(0, 150)}...</code></pre>
                        </div>
                        <div class="example-footer">
                            <span class="example-difficulty">${example.difficulty || 'Sin dificultad'}</span>
                            <a href="/playground?example=${example.slug || example._id}" data-route="/playground?example=${example.slug || example._id}" class="view-example-btn">
                                🎮 Probar
                            </a>
                        </div>
                    </div>`;
                });
                
                console.log('🎯 Partes de HTML generadas:', htmlParts.length);
                container.innerHTML = htmlParts.join('');
                console.log('✅ HTML insertado en el contenedor');
            } else {
                container.innerHTML = `
                    <div class="no-examples">
                        <h3>No hay ejemplos disponibles</h3>
                        <p>Aún no tenemos ejemplos para esta categoría.</p>
                    </div>
                `;
            }
        } catch (error) {
            const containerId = category === 'Básico' ? 'basic-examples-container' :
                              category === 'Avanzado' ? 'advanced-examples-container' :
                              'liferay-examples-container';
            
            document.getElementById(containerId).innerHTML = `
                <div class="error">Error cargando ejemplos: ${error.message}</div>
            `;
        }
    }

    renderPlaceholder(title, icon) {
        this.setTitle(`FreeMarker Docs - ${title}`);
        document.getElementById('app').innerHTML = `
            <div class="container">
                <div class="page-header">
                    <h1>${icon} ${title}</h1>
                    <p>Esta sección está en desarrollo...</p>
                </div>
            </div>
        `;
    }
}

// Inicializar la aplicación cuando el DOM esté listo
function initApp() {
    console.log('🚀 Iniciando aplicación FreeMarker...');
    
    if (document.getElementById('app')) {
        console.log('✅ Elemento #app encontrado');
        new FreeMarkerApp();
    } else {
        console.log('⏳ Elemento #app no encontrado, esperando...');
        // Si el elemento app no existe aún, esperar un poco más
        setTimeout(initApp, 100);
    }
}

// Múltiples formas de inicializar para asegurar que funcione
if (document.readyState === 'loading') {
    console.log('📄 DOM cargando, esperando DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    console.log('📄 DOM ya listo, inicializando inmediatamente...');
    // DOM ya está listo
    initApp();
}

// Fallback adicional
window.addEventListener('load', () => {
    console.log('🌐 Evento load disparado');
    if (!window.appInitialized) {
        console.log('⚠️ App no inicializada, usando fallback...');
        initApp();
        window.appInitialized = true;
    } else {
        console.log('✅ App ya inicializada');
    }
});
