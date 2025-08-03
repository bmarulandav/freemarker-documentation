// Script para crear ejemplos avanzados y de Liferay
const mongoose = require('mongoose');
require('dotenv').config();

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    const Example = require('./src/models/Example');
    const Category = require('./src/models/Category');
    
    // Buscar o crear categorías
    let advancedCategory = await Category.findOne({ name: 'Avanzado' });
    if (!advancedCategory) {
      advancedCategory = new Category({
        name: 'Avanzado',
        slug: 'avanzado',
        description: 'Ejemplos avanzados de FreeMarker',
        color: '#dc3545'
      });
      await advancedCategory.save();
      console.log('✅ Categoría Avanzado creada');
    }
    
    let liferayCategory = await Category.findOne({ name: 'Liferay' });
    if (!liferayCategory) {
      liferayCategory = new Category({
        name: 'Liferay',
        slug: 'liferay',
        description: 'Ejemplos específicos de Liferay DXP',
        color: '#0b5fff'
      });
      await liferayCategory.save();
      console.log('✅ Categoría Liferay creada');
    }
    
    console.log('📝 Creando ejemplos avanzados y de Liferay...');
    
    // EJEMPLOS AVANZADOS
    const ejemploAvanzado1 = new Example({
      title: 'Funciones de Texto Avanzadas',
      slug: 'funciones-texto-avanzadas-' + Date.now(),
      description: 'Manipulación avanzada de strings con múltiples funciones',
      code: `<#assign texto = "hola mundo freemarker">
<#assign numeros = "12345.67">
<#assign fecha = "2024-08-01">

<h2>Manipulación de Texto</h2>
<p>Original: \${texto}</p>
<p>Capitalizado: \${texto?cap_first}</p>
<p>Mayúsculas: \${texto?upper_case}</p>
<p>Palabras: \${texto?word_list?join(", ")}</p>
<p>Longitud: \${texto?length}</p>
<p>Contiene 'mundo': \${texto?contains("mundo")?then("Sí", "No")}</p>

<h2>Números y Formato</h2>
<p>Número: \${numeros?number}</p>
<p>Entero: \${numeros?number?floor}</p>
<p>Formato: \${numeros?number?string("0.00")}</p>

<h2>Fechas</h2>
<p>Fecha original: \${fecha}</p>
<p>Año: \${fecha?split("-")[0]}</p>`,
      explanation: 'Ejemplo avanzado que demuestra múltiples funciones de FreeMarker para manipular texto, números y fechas. Incluye ?cap_first, ?upper_case, ?word_list, ?join, ?contains, ?then, ?number, ?floor, ?string y ?split.',
      difficulty: 'avanzado',
      category: advancedCategory._id,
      liferayVersion: '7.4',
      tags: ['funciones', 'texto', 'numeros', 'fechas'],
      author: {
        name: 'Admin',
        email: 'admin@test.com'
      },
      usage: {
        context: 'template',
        variables: []
      }
    });
    
    const ejemploAvanzado2 = new Example({
      title: 'Macros y Funciones Personalizadas',
      slug: 'macros-funciones-' + Date.now(),
      description: 'Creación y uso de macros reutilizables',
      code: `<#-- Definir macro para crear tarjeta de usuario -->
<#macro tarjetaUsuario nombre email activo>
  <div class="tarjeta \${activo?then('activo', 'inactivo')}">
    <h3>\${nombre}</h3>
    <p>📧 \${email}</p>
    <span class="estado">
      \${activo?then('🟢 Activo', '🔴 Inactivo')}
    </span>
  </div>
</#macro>

<#-- Macro para lista numerada -->
<#macro listaOrdenada items titulo="">
  <#if titulo?has_content>
    <h3>\${titulo}</h3>
  </#if>
  <ol>
    <#list items as item>
      <li>\${item}</li>
    </#list>
  </ol>
</#macro>

<h2>Usando Macros</h2>
<@tarjetaUsuario nombre="Juan Pérez" email="juan@email.com" activo=true />
<@tarjetaUsuario nombre="Ana López" email="ana@email.com" activo=false />

<@listaOrdenada 
  items=["Aprender FreeMarker", "Crear templates", "Usar macros"] 
  titulo="Tareas pendientes" />`,
      explanation: 'Ejemplo avanzado de macros en FreeMarker. Las macros permiten crear componentes reutilizables con parámetros. Se muestran dos macros: una para tarjetas de usuario y otra para listas ordenadas.',
      difficulty: 'avanzado',
      category: advancedCategory._id,
      liferayVersion: '7.4',
      tags: ['macros', 'funciones', 'reutilizable'],
      author: {
        name: 'Admin',
        email: 'admin@test.com'
      },
      usage: {
        context: 'template',
        variables: []
      }
    });
    
    // EJEMPLOS DE LIFERAY
    const ejemploLiferay1 = new Example({
      title: 'Variables de Liferay - theme_display',
      slug: 'theme-display-liferay-' + Date.now(),
      description: 'Acceso a información del contexto de Liferay',
      code: `<#-- Información del usuario actual -->
<#if themeDisplay.isSignedIn()>
  <div class="usuario-info">
    <h3>¡Hola \${user.getFirstName()}!</h3>
    <p>Email: \${user.getEmailAddress()}</p>
    <p>Rol: \${user.getRoles()?first.getName()}</p>
  </div>
<#else>
  <div class="usuario-anonimo">
    <p>Usuario no autenticado</p>
    <a href="\${themeDisplay.getURLSignIn()}">Iniciar Sesión</a>
  </div>
</#if>

<#-- Información del sitio -->
<div class="sitio-info">
  <h3>Información del Sitio</h3>
  <p>Nombre: \${themeDisplay.getScopeGroupName()}</p>
  <p>URL: \${themeDisplay.getPortalURL()}</p>
  <p>Idioma: \${themeDisplay.getLanguageId()}</p>
</div>

<#-- Información de la página -->
<div class="pagina-info">
  <h3>Página Actual</h3>
  <p>Título: \${themeDisplay.getLayout().getName(themeDisplay.getLocale())}</p>
  <p>URL: \${themeDisplay.getLayout().getFriendlyURL()}</p>
</div>`,
      explanation: 'Ejemplo específico de Liferay que muestra cómo usar theme_display para acceder a información del usuario, sitio y página actual. Muy útil para personalizar contenido según el contexto.',
      difficulty: 'intermedio',
      category: liferayCategory._id,
      liferayVersion: '7.4',
      tags: ['liferay', 'theme_display', 'usuario', 'sitio'],
      author: {
        name: 'Admin',
        email: 'admin@test.com'
      },
      usage: {
        context: 'theme',
        variables: []
      }
    });
    
    const ejemploLiferay2 = new Example({
      title: 'Web Content Template',
      slug: 'web-content-template-' + Date.now(),
      description: 'Template para mostrar contenido web estructurado',
      code: `<#-- Template para estructura de artículo de blog -->
<article class="blog-post">
  <header class="post-header">
    <h1 class="post-title">\${Titulo.getData()}</h1>
    <div class="post-meta">
      <span class="autor">Por: \${Autor.getData()}</span>
      <span class="fecha">\${FechaPublicacion.getData()?date}</span>
      <#if Categoria.getData()?has_content>
        <span class="categoria">\${Categoria.getData()}</span>
      </#if>
    </div>
  </header>
  
  <#if ImagenDestacada.getData() != "">
    <figure class="post-image">
      <img src="\${ImagenDestacada.getData()}" alt="\${Titulo.getData()}" />
    </figure>
  </#if>
  
  <div class="post-content">
    \${Contenido.getData()}
  </div>
  
  <#if Tags.getSiblings()?has_content>
    <footer class="post-tags">
      <h4>Tags:</h4>
      <#list Tags.getSiblings() as tag>
        <span class="tag">\${tag.getData()}</span>
      </#list>
    </footer>
  </#if>
</article>

<#-- Estilos CSS inline para el ejemplo -->
<style>
.blog-post { margin: 20px 0; }
.post-title { color: #333; }
.post-meta { color: #666; font-size: 0.9em; }
.tag { background: #007bff; color: white; padding: 2px 8px; margin: 2px; }
</style>`,
      explanation: 'Template de Web Content para Liferay que muestra cómo acceder a campos de una estructura. Usa .getData() para obtener valores y .getSiblings() para campos repetibles como tags.',
      difficulty: 'intermedio',
      category: liferayCategory._id,
      liferayVersion: '7.4',
      tags: ['liferay', 'web-content', 'template', 'estructura'],
      author: {
        name: 'Admin',
        email: 'admin@test.com'
      },
      usage: {
        context: 'web-content',
        variables: []
      }
    });
    
    // Guardar ejemplos
    await ejemploAvanzado1.save();
    console.log('✅ Creado: Funciones de Texto Avanzadas');
    
    await ejemploAvanzado2.save();
    console.log('✅ Creado: Macros y Funciones Personalizadas');
    
    await ejemploLiferay1.save();
    console.log('✅ Creado: Variables de Liferay - theme_display');
    
    await ejemploLiferay2.save();
    console.log('✅ Creado: Web Content Template');
    
    const total = await Example.countDocuments();
    console.log(`📊 Total ejemplos: ${total}`);
    
    await mongoose.disconnect();
    console.log('🎉 ¡4 nuevos ejemplos agregados!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
