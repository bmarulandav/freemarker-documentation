const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware básico
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));

app.use(express.json());

// Ruta de prueba simple
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Rutas de API simuladas para probar frontend
app.get('/api/examples', (req, res) => {
  res.json({
    data: [
      {
        _id: '1',
        title: 'Ejemplo básico de FreeMarker',
        description: 'Un ejemplo simple para comenzar con FreeMarker en Liferay',
        slug: 'ejemplo-basico',
        difficulty: 'Principiante',
        liferayVersion: '7.4',
        views: 150,
        likes: 12,
        createdAt: new Date(),
        author: { name: 'Demo User' },
        category: { name: 'Básico', slug: 'basico' },
        code: `<#-- Ejemplo básico de FreeMarker -->
<h1>¡Hola ${user.name}!</h1>
<p>Bienvenido a ${site.name}</p>

<#if articles?has_content>
  <ul>
    <#list articles as article>
      <li>${article.title}</li>
    </#list>
  </ul>
<#else>
  <p>No hay artículos disponibles.</p>
</#if>`
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
        createdAt: new Date(),
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
</#list>`
      }
    ],
    total: 2,
    page: 1,
    totalPages: 1
  });
});

app.get('/api/examples/:slug', (req, res) => {
  const { slug } = req.params;
  
  const examples = {
    'ejemplo-basico': {
      _id: '1',
      title: 'Ejemplo básico de FreeMarker',
      description: 'Un ejemplo simple para comenzar con FreeMarker en Liferay',
      slug: 'ejemplo-basico',
      difficulty: 'Principiante',
      liferayVersion: '7.4',
      views: 150,
      likes: 12,
      createdAt: new Date(),
      author: { name: 'Demo User' },
      category: { name: 'Básico', slug: 'basico' },
      explanation: '<p>Este ejemplo muestra los conceptos básicos de FreeMarker...</p>',
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
      requiredVariables: {
        user: { name: "string" },
        site: { name: "string" },
        articles: "array"
      },
      outputExample: "<h1>¡Hola Juan!</h1>\n<p>Bienvenido a Mi Sitio</p>\n<ul>\n  <li>Artículo 1</li>\n  <li>Artículo 2</li>\n</ul>"
    }
  };
  
  const example = examples[slug];
  if (example) {
    res.json(example);
  } else {
    res.status(404).json({ message: 'Ejemplo no encontrado' });
  }
});

app.get('/api/categories', (req, res) => {
  res.json({
    data: [
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
      }
    ]
  });
});

// Auth endpoints simulados
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Demo credentials
  if (email === 'demo@freemarker.com' && password === 'demo123') {
    res.json({
      token: 'demo-jwt-token',
      user: {
        id: '1',
        name: 'Demo User',
        email: 'demo@freemarker.com',
        role: 'user'
      }
    });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  res.json({
    message: 'Usuario registrado exitosamente',
    user: {
      id: '2',
      name,
      email,
      role: 'user'
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 API Demo ejecutándose en puerto ${PORT}`);
  console.log(`📚 API disponible en http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend esperado en http://localhost:5174`);
});

module.exports = app;
