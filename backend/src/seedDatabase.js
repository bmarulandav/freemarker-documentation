const mongoose = require('mongoose');
const Category = require('./models/Category');
const Example = require('./models/Example');
const User = require('./models/User');
const path = require('path');

// Cargar variables de entorno desde la carpeta padre
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Datos de categorías iniciales
const categories = [
  {
    name: "Introducción a FreeMarker",
    slug: "introduccion-freemarker",
    description: "Conceptos básicos y sintaxis fundamental de FreeMarker en Liferay",
    icon: "book-open",
    color: "#3B82F6",
    order: 1
  },
  {
    name: "Variables útiles",
    slug: "variables-utiles",
    description: "Variables predefinidas como theme_display, user, group, layout",
    icon: "variable",
    color: "#10B981",
    order: 2
  },
  {
    name: "Fragmentos",
    slug: "fragmentos",
    description: "Uso de FreeMarker en fragmentos de página dinámicos",
    icon: "puzzle-piece",
    color: "#8B5CF6",
    order: 3
  },
  {
    name: "Web Content Templates",
    slug: "web-content-templates",
    description: "Plantillas para contenido web estructurado",
    icon: "document-text",
    color: "#F59E0B",
    order: 4
  },
  {
    name: "Application Display Templates (ADTs)",
    slug: "adt-templates",
    description: "Personalización de visualización de portlets",
    icon: "view-grid",
    color: "#EF4444",
    order: 5
  },
  {
    name: "Temas",
    slug: "temas",
    description: "FreeMarker en portal_normal.ftl e init.ftl",
    icon: "color-swatch",
    color: "#EC4899",
    order: 6
  },
  {
    name: "Errores comunes",
    slug: "errores-comunes",
    description: "Soluciones a problemas frecuentes con FreeMarker",
    icon: "exclamation-triangle",
    color: "#F97316",
    order: 7
  },
  {
    name: "Snippets reutilizables",
    slug: "snippets-reutilizables",
    description: "Fragmentos de código listos para usar",
    icon: "code",
    color: "#06B6D4",
    order: 8
  },
  {
    name: "Integraciones con servicios",
    slug: "integraciones-servicios",
    description: "Acceso a servicios de Liferay desde FreeMarker",
    icon: "lightning-bolt",
    color: "#84CC16",
    order: 9
  }
];// Usuario administrador por defecto
const adminUser = {
  username: "admin",
  email: "admin@freemarker-docs.com",
  password: "admin123",
  firstName: "Administrador",
  lastName: "Sistema",
  role: "admin",
  isEmailVerified: true
};

// Función para inicializar la base de datos
const initializeDatabase = async () => {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freemarker-docs');
    console.log('✅ Conectado a MongoDB');

    // Limpiar datos existentes (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      console.log('🧹 Limpiando datos existentes...');
      await Category.deleteMany({});
      await Example.deleteMany({});
      await User.deleteMany({});
    }

    // Crear usuario administrador
    console.log('👤 Creando usuario administrador...');
    const admin = new User(adminUser);
    await admin.save();
    console.log('✅ Usuario administrador creado');

    // Crear categorías
    console.log('📁 Creando categorías...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ ${createdCategories.length} categorías creadas`);

    // Ejemplos de muestra
    const sampleExamples = [
      {
        title: "Mostrar información del usuario actual",
        description: "Cómo acceder y mostrar información del usuario logueado usando theme_display",
        code: `<#-- Verificar si el usuario está logueado -->
<#if themeDisplay.isSignedIn()>
    <div class="user-info">
        <h3>¡Hola, \${user.getFirstName()}!</h3>
        <p>Email: \${user.getEmailAddress()}</p>
        <p>Rol: \${user.getRoles()?first.getName()}</p>
        <p>Último login: \${user.getLastLoginDate()?datetime}</p>
    </div>
<#else>
    <div class="guest-info">
        <p>¡Bienvenido! <a href="/c/portal/login">Inicia sesión</a> para ver contenido personalizado.</p>
    </div>
</#if>`,
        htmlOutput: `<div class="user-info">
    <h3>¡Hola, Juan!</h3>
    <p>Email: juan@example.com</p>
    <p>Rol: User</p>
    <p>Último login: 25 jul 2025 10:30:00</p>
</div>`,
        explanation: "Este ejemplo muestra cómo usar la variable themeDisplay para verificar si un usuario está logueado y acceder a información básica del usuario como nombre, email y roles.",
        category: createdCategories[1]._id, // Variables útiles
        tags: ["theme_display", "user", "authentication", "usuario"],
        difficulty: "principiante",
        liferayVersion: "7.4",
        author: {
          name: admin.fullName,
          email: admin.email,
          avatar: admin.displayAvatar
        },
        usage: {
          context: "template",
          variables: [
            { name: "themeDisplay", type: "ThemeDisplay", description: "Objeto principal de contexto", required: true },
            { name: "user", type: "User", description: "Usuario actual", required: false }
          ]
        },
        isFeatured: true
      },
      {
        title: "Listar páginas del sitio actual",
        description: "Mostrar navegación dinámica con las páginas públicas del sitio",
        code: `<#-- Obtener el layout actual y el grupo -->
<#assign currentLayout = themeDisplay.getLayout() />
<#assign group = themeDisplay.getScopeGroup() />

<nav class="site-navigation">
    <ul class="nav-list">
        <#-- Obtener páginas públicas del sitio -->
        <#list group.getPublicLayouts() as layout>
            <li class="nav-item">
                <a href="\${layout.getFriendlyURL()}" 
                   class="nav-link \${(currentLayout.getPlid() == layout.getPlid())?then('active', '')}">
                    \${layout.getName(themeDisplay.getLocale())}
                </a>
                
                <#-- Si tiene páginas hijas, mostrarlas -->
                <#if layout.hasChildren()>
                    <ul class="nav-submenu">
                        <#list layout.getChildren() as childLayout>
                            <li class="nav-subitem">
                                <a href="\${childLayout.getFriendlyURL()}" class="nav-sublink">
                                    \${childLayout.getName(themeDisplay.getLocale())}
                                </a>
                            </li>
                        </#list>
                    </ul>
                </#if>
            </li>
        </#list>
    </ul>
</nav>`,
        explanation: "Este ejemplo genera una navegación dinámica mostrando todas las páginas públicas del sitio actual, incluyendo subpáginas y marcando la página activa.",
        category: createdCategories[1]._id, // Variables útiles
        tags: ["layout", "navigation", "pages", "navegacion"],
        difficulty: "intermedio",
        liferayVersion: "7.4",
        author: {
          name: admin.fullName,
          email: admin.email,
          avatar: admin.displayAvatar
        },
        usage: {
          context: "theme",
          variables: [
            { name: "themeDisplay", type: "ThemeDisplay", description: "Contexto del tema", required: true }
          ]
        }
      },
      {
        title: "Bucle básico con condicionales",
        description: "Sintaxis fundamental de bucles y condicionales en FreeMarker",
        code: `<#-- Lista de ejemplo -->
<#assign fruits = ["manzana", "banana", "naranja", "uva"] />

<div class="fruit-list">
    <h3>Lista de frutas (\${fruits?size} elementos)</h3>
    
    <#-- Verificar si la lista no está vacía -->
    <#if fruits?has_content>
        <ul>
            <#-- Bucle con información de índice -->
            <#list fruits as fruit>
                <li class="fruit-item \${fruit_has_next?then('', 'last')}">
                    <span class="index">\${fruit_index + 1}.</span>
                    <span class="name">\${fruit?capitalize}</span>
                    
                    <#-- Condicional dentro del bucle -->
                    <#if fruit == "banana">
                        <span class="highlight">¡Mi favorita!</span>
                    </#if>
                    
                    <#-- Mostrar separador excepto en el último -->
                    <#if fruit_has_next>
                        <span class="separator"> | </span>
                    </#if>
                </li>
            </#list>
        </ul>
        
        <p class="summary">
            Primera fruta: <strong>\${fruits?first}</strong><br>
            Última fruta: <strong>\${fruits?last}</strong>
        </p>
    <#else>
        <p class="empty">No hay frutas en la lista.</p>
    </#if>
</div>`,
        explanation: "Ejemplo básico que muestra la sintaxis de bucles (#list), condicionales (#if), variables de bucle (_index, _has_next) y métodos útiles de listas (?size, ?first, ?last).",
        category: createdCategories[0]._id, // Introducción
        tags: ["bucles", "condicionales", "listas", "sintaxis"],
        difficulty: "principiante",
        liferayVersion: "7.4",
        author: {
          name: admin.fullName,
          email: admin.email,
          avatar: admin.displayAvatar
        },
        usage: {
          context: "template",
          variables: []
        },
        isFeatured: true
      }
    ];

    // Crear ejemplos
    console.log('📄 Creando ejemplos de muestra...');
    await Example.insertMany(sampleExamples);
    console.log(`✅ ${sampleExamples.length} ejemplos creados`);

    // Actualizar contadores de categorías
    console.log('🔢 Actualizando contadores de categorías...');
    for (const category of createdCategories) {
      const count = await Example.countDocuments({ category: category._id, isPublished: true });
      await Category.findByIdAndUpdate(category._id, { exampleCount: count });
    }

    console.log('🎉 Base de datos inicializada correctamente');
    console.log('\n📊 Resumen:');
    console.log(`   • Categorías: ${createdCategories.length}`);
    console.log(`   • Ejemplos: ${sampleExamples.length}`);
    console.log(`   • Usuario admin: ${adminUser.username} / ${adminUser.password}`);
    
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
