const http = require('http');
const url = require('url');

// Función para parsear JSON del cuerpo de la petición
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
  });
}

// Función para responder con JSON
function sendJSON(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  });
  res.end(JSON.stringify(data));
}

// Datos de ejemplo
const examples = [
  {
    _id: '1',
    title: 'Ejemplo básico de FreeMarker',
    description: 'Un ejemplo simple para comenzar con FreeMarker en Liferay',
    slug: 'ejemplo-basico',
    difficulty: 'Principiante',
    liferayVersion: '7.4',
    views: 150,
    likes: 12,
    createdAt: new Date().toISOString(),
    author: { name: 'Demo User' },
    category: { name: 'Básico', slug: 'basico' },
    code: `<#-- Ejemplo básico de FreeMarker -->
<h1>¡Hola \${user.name}!</h1>
<p>Bienvenido a \${site.name}</p>

<#if articles?has_content>
  <ul>
    <#list articles as article>
      <li>\${article.title}</li>
    </#list>
  </ul>
<#else>
  <p>No hay artículos disponibles.</p>
</#if>`,
    explanation: '<p>Este ejemplo muestra los conceptos básicos de FreeMarker para mostrar información del usuario y listar artículos de forma condicional.</p>',
    requiredVariables: {
      user: { name: "string" },
      site: { name: "string" },
      articles: "array"
    },
    outputExample: "<h1>¡Hola Juan!</h1>\\n<p>Bienvenido a Mi Sitio</p>\\n<ul>\\n  <li>Artículo 1</li>\\n  <li>Artículo 2</li>\\n</ul>"
  },
  {
    _id: '2',
    title: 'Loops y condicionales',
    description: 'Cómo usar bucles y condicionales en FreeMarker',
    slug: 'loops-condicionales',
    difficulty: 'Intermedio',
    liferayVersion: '7.4',
    views: 89,
    likes: 8,
    createdAt: new Date().toISOString(),
    author: { name: 'Demo User' },
    category: { name: 'Control Flow', slug: 'control-flow' },
    code: `<#-- Bucles y condicionales avanzados -->
<#assign items = ["item1", "item2", "item3"]>

<#list items as item>
  <div class="item-\${item?index}">
    <#if item?has_content>
      <h3>\${item?upper_case}</h3>
      <#if item?index == 0>
        <span class="first">Primer elemento</span>
      <#elseif item?index == items?size - 1>
        <span class="last">Último elemento</span>
      <#else>
        <span class="middle">Elemento intermedio</span>
      </#if>
    </#if>
  </div>
</#list>`,
    explanation: '<p>Este ejemplo demuestra el uso de bucles, condicionales anidados y funciones de índice en FreeMarker.</p>',
    requiredVariables: {},
    outputExample: '<div class="item-0">\\n  <h3>ITEM1</h3>\\n  <span class="first">Primer elemento</span>\\n</div>\\n...'
  },
  {
    _id: '3',
    title: 'Manejo de variables',
    description: 'Técnicas para manejar variables y datos en FreeMarker',
    slug: 'manejo-variables',
    difficulty: 'Intermedio',
    liferayVersion: '7.4',
    views: 234,
    likes: 18,
    createdAt: new Date().toISOString(),
    author: { name: 'Expert User' },
    category: { name: 'Variables', slug: 'variables' },
    code: `<#-- Manejo avanzado de variables -->
<#assign dateFormat = "dd/MM/yyyy">
<#assign currentDate = .now>

<h2>Información del contenido</h2>
<div class="content-info">
  <#if content??>
    <h3>\${content.title!"Sin título"}</h3>
    <p>Autor: \${content.author!"Desconocido"}</p>
    <p>Fecha: \${content.publishDate?string(dateFormat)}</p>
    
    <#-- Manejo seguro de propiedades opcionales -->
    <#if content.tags?has_content>
      <div class="tags">
        <#list content.tags as tag>
          <span class="tag">\${tag}</span><#if tag?has_next>, </#if>
        </#list>
      </div>
    </#if>
  <#else>
    <p>No hay contenido disponible.</p>
  </#if>
</div>`,
    explanation: '<p>Este ejemplo muestra técnicas avanzadas para el manejo seguro de variables, incluyendo valores por defecto, formateo de fechas y verificación de existencia.</p>',
    requiredVariables: {
      content: {
        title: "string",
        author: "string",
        publishDate: "date",
        tags: "array"
      }
    },
    outputExample: '<h2>Información del contenido</h2>\\n<div class="content-info">\\n  <h3>Mi Artículo</h3>\\n  <p>Autor: Juan Pérez</p>\\n  <p>Fecha: 27/07/2025</p>\\n...'
  }
];

const categories = [
  {
    _id: '1',
    name: 'Básico',
    slug: 'basico',
    description: 'Ejemplos básicos para empezar con FreeMarker',
    exampleCount: 5,
    totalViews: 500,
    contributors: 3,
    color: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    _id: '2',
    name: 'Control Flow',
    slug: 'control-flow',
    description: 'Bucles, condicionales y control de flujo',
    exampleCount: 8,
    totalViews: 320,
    contributors: 2,
    color: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    _id: '3',
    name: 'Variables',
    slug: 'variables',
    description: 'Manejo de variables y datos en FreeMarker',
    exampleCount: 12,
    totalViews: 890,
    contributors: 4,
    color: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    _id: '4',
    name: 'Fragmentos',
    slug: 'fragmentos',
    description: 'Creación y uso de fragmentos reutilizables',
    exampleCount: 6,
    totalViews: 445,
    contributors: 2,
    color: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  },
  {
    _id: '5',
    name: 'Web Content',
    slug: 'web-content',
    description: 'Integración con Web Content de Liferay',
    exampleCount: 15,
    totalViews: 1200,
    contributors: 5,
    color: 'bg-red-100',
    iconColor: 'text-red-600'
  },
  {
    _id: '6',
    name: 'ADT Templates',
    slug: 'adt-templates',
    description: 'Application Display Templates avanzados',
    exampleCount: 9,
    totalViews: 678,
    contributors: 3,
    color: 'bg-indigo-100',
    iconColor: 'text-indigo-600'
  }
];

// Servidor HTTP
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Manejar CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    });
    res.end();
    return;
  }

  try {
    // Health check
    if (path === '/api/health' && method === 'GET') {
      sendJSON(res, {
        status: 'OK',
        message: 'API Demo funcionando correctamente',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Examples endpoints
    if (path === '/api/examples' && method === 'GET') {
      const { search, category, difficulty } = parsedUrl.query;
      let filteredExamples = [...examples];

      if (search) {
        const searchLower = search.toLowerCase();
        filteredExamples = filteredExamples.filter(example =>
          example.title.toLowerCase().includes(searchLower) ||
          example.description.toLowerCase().includes(searchLower)
        );
      }

      if (category) {
        filteredExamples = filteredExamples.filter(example =>
          example.category.slug === category
        );
      }

      if (difficulty) {
        filteredExamples = filteredExamples.filter(example =>
          example.difficulty === difficulty
        );
      }

      sendJSON(res, {
        data: filteredExamples,
        total: filteredExamples.length,
        page: 1,
        totalPages: 1
      });
      return;
    }

    if (path === '/api/examples/featured' && method === 'GET') {
      sendJSON(res, {
        data: examples.slice(0, 3)
      });
      return;
    }

    if (path === '/api/examples/popular' && method === 'GET') {
      const popularExamples = [...examples].sort((a, b) => b.views - a.views);
      sendJSON(res, {
        data: popularExamples.slice(0, 4)
      });
      return;
    }

    // Individual example
    if (path.startsWith('/api/examples/') && method === 'GET') {
      const slug = path.split('/').pop();
      const example = examples.find(ex => ex.slug === slug);
      
      if (example) {
        sendJSON(res, example);
      } else {
        sendJSON(res, { message: 'Ejemplo no encontrado' }, 404);
      }
      return;
    }

    // Categories endpoints
    if (path === '/api/categories' && method === 'GET') {
      sendJSON(res, {
        data: categories
      });
      return;
    }

    // Auth endpoints
    if (path === '/api/auth/login' && method === 'POST') {
      const body = await parseBody(req);
      const { email, password } = body;

      if (email === 'demo@freemarker.com' && password === 'demo123') {
        sendJSON(res, {
          token: 'demo-jwt-token-12345',
          user: {
            id: '1',
            name: 'Demo User',
            email: 'demo@freemarker.com',
            role: 'user'
          }
        });
      } else {
        sendJSON(res, { message: 'Credenciales inválidas' }, 401);
      }
      return;
    }

    if (path === '/api/auth/register' && method === 'POST') {
      const body = await parseBody(req);
      const { name, email } = body;
      
      sendJSON(res, {
        message: 'Usuario registrado exitosamente',
        user: {
          id: '2',
          name,
          email,
          role: 'user'
        }
      }, 201);
      return;
    }

    // Procesar template de FreeMarker (simulado)
    if (path === '/api/process-template' && method === 'POST') {
      const body = await parseBody(req);
      const { template, data } = body;
      
      try {
        // Simular procesamiento de FreeMarker
        // En una implementación real, aquí usarías una librería de FreeMarker para Java
        let parsedData = {};
        
        if (data) {
          try {
            parsedData = JSON.parse(data);
          } catch (e) {
            sendJSON(res, { error: 'Datos JSON inválidos' }, 400);
            return;
          }
        }
        
        // Simulación básica de procesamiento de template
        let output = template;
        
        // Reemplazar variables simples como ${variable}
        output = output.replace(/\$\{([^}]+)\}/g, (match, variable) => {
          const keys = variable.split('.');
          let value = parsedData;
          
          for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
              value = value[key];
            } else {
              return `[Undefined: ${variable}]`;
            }
          }
          
          return value !== undefined ? String(value) : `[Undefined: ${variable}]`;
        });
        
        // Procesamiento básico de directivas #if
        output = output.replace(/<#if\s+([^>]+)>\s*([\s\S]*?)\s*<#else>\s*([\s\S]*?)\s*<\/#if>/g, 
          (match, condition, ifContent, elseContent) => {
            // Evaluación muy básica de condiciones
            const isTrue = condition.includes('?has_content') ? 
              (parsedData[condition.replace('?has_content', '')] && 
               parsedData[condition.replace('?has_content', '')].length > 0) : false;
            return isTrue ? ifContent.trim() : elseContent.trim();
          });
        
        // Procesamiento básico de #list
        output = output.replace(/<#list\s+([^>]+)\s+as\s+(\w+)>\s*([\s\S]*?)\s*<\/#list>/g, 
          (match, arrayRef, itemVar, content) => {
            const array = parsedData[arrayRef];
            if (Array.isArray(array)) {
              return array.map((item, index) => {
                let itemContent = content;
                itemContent = itemContent.replace(new RegExp(`\\$\\{${itemVar}\\}`, 'g'), item);
                itemContent = itemContent.replace(new RegExp(`\\$\\{${itemVar}\\.([^}]+)\\}`, 'g'), 
                  (m, prop) => item[prop] || `[Undefined: ${itemVar}.${prop}]`);
                return itemContent;
              }).join('\n');
            }
            return '[Array not found]';
          });
        
        // Remover comentarios de FreeMarker
        output = output.replace(/<#--[\s\S]*?-->/g, '');
        
        // Remover directivas #assign (simplificado)
        output = output.replace(/<#assign[^>]*>/g, '');
        
        sendJSON(res, { 
          output: output.trim(),
          success: true 
        });
      } catch (error) {
        sendJSON(res, { 
          error: 'Error procesando template: ' + error.message 
        }, 400);
      }
      return;
    }

    // 404 para rutas no encontradas
    sendJSON(res, { message: 'Ruta no encontrada' }, 404);

  } catch (error) {
    console.error('Error:', error);
    sendJSON(res, { message: 'Error interno del servidor' }, 500);
  }
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`🚀 API Demo ejecutándose en puerto ${PORT}`);
  console.log(`📚 API disponible en http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend esperado en http://localhost:3000`);
  console.log('\\n📋 Endpoints disponibles:');
  console.log('  GET  /api/health');
  console.log('  GET  /api/examples');
  console.log('  GET  /api/examples/featured');
  console.log('  GET  /api/examples/popular');
  console.log('  GET  /api/examples/:slug');
  console.log('  GET  /api/categories');
  console.log('  POST /api/auth/login');
  console.log('  POST /api/auth/register');
  console.log('\\n🔑 Credenciales de prueba:');
  console.log('  Email: demo@freemarker.com');
  console.log('  Password: demo123');
});

module.exports = server;
