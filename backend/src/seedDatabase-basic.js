const mongoose = require('mongoose');
const Category = require('./models/Category');
const Example = require('./models/Example');
const User = require('./models/User');
const path = require('path');

// Cargar variables de entorno desde la carpeta padre
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Función para inicializar la base de datos
const initializeDatabase = async () => {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freemarker-docs');
    console.log('✅ Conectado a MongoDB');

    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await Category.deleteMany({});
    await Example.deleteMany({});
    await User.deleteMany({});

    // Crear usuario administrador
    console.log('👤 Creando usuario administrador...');
    const adminUser = {
      username: "admin",
      email: "admin@freemarker-docs.com",
      password: "admin123",
      firstName: "Administrador",
      lastName: "Sistema",
      role: "admin",
      isEmailVerified: true
    };
    await User.create(adminUser);
    console.log('✅ Usuario administrador creado');

    // Crear categorías
    console.log('📁 Creando categorías...');
    const categories = [
      {
        name: "Básico",
        slug: "basico",
        description: "Ejemplos básicos de FreeMarker",
        icon: "book-open",
        color: "#3B82F6",
        order: 1
      },
      {
        name: "Control Flow",
        slug: "control-flow",
        description: "Bucles, condicionales y control de flujo",
        icon: "code",
        color: "#10B981",
        order: 2
      },
      {
        name: "Variables",
        slug: "variables",
        description: "Manejo de variables y datos en FreeMarker",
        icon: "variable",
        color: "#8B5CF6",
        order: 3
      }
    ];
    
    const createdCategories = await Category.create(categories);
    console.log(`✅ ${createdCategories.length} categorías creadas`);

    // Crear ejemplos básicos
    console.log('📄 Creando ejemplos...');
    
    const example1 = {
      title: "Ejemplo básico de FreeMarker",
      slug: "ejemplo-basico",
      description: "Un ejemplo simple para comenzar con FreeMarker en Liferay",
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
      explanation: "Este ejemplo muestra los conceptos básicos de FreeMarker para mostrar información del usuario y listar artículos de forma condicional.",
      category: createdCategories[0]._id,
      difficulty: "principiante",
      liferayVersion: "7.4",
      author: {
        name: "Demo User",
        email: "demo@freemarker-docs.com"
      },
      usage: {
        context: "template",
        variables: []
      }
    };

    const example2 = {
      title: "Loops y condicionales",
      slug: "loops-condicionales",
      description: "Cómo usar bucles y condicionales en FreeMarker",
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
      explanation: "Este ejemplo demuestra el uso de bucles, condicionales anidados y funciones de índice en FreeMarker.",
      category: createdCategories[1]._id,
      difficulty: "intermedio",
      liferayVersion: "7.4",
      author: {
        name: "Demo User",
        email: "demo@freemarker-docs.com"
      },
      usage: {
        context: "template",
        variables: []
      }
    };

    const example3 = {
      title: "Manejo de variables",
      slug: "manejo-variables",
      description: "Técnicas para manejar variables y datos en FreeMarker",
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
      explanation: "Este ejemplo muestra técnicas avanzadas para el manejo seguro de variables, incluyendo valores por defecto, formateo de fechas y verificación de existencia.",
      category: createdCategories[2]._id,
      difficulty: "avanzado",
      liferayVersion: "7.4",
      author: {
        name: "Expert User",  
        email: "expert@freemarker-docs.com"
      },
      usage: {
        context: "template",
        variables: []
      }
    };

    await Example.create([example1, example2, example3]);
    console.log(`✅ 3 ejemplos creados`);

    console.log('🎉 Base de datos inicializada exitosamente');
    
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
  } finally {
    console.log('🔌 Conexión cerrada');
    await mongoose.connection.close();
  }
};

// Ejecutar inicialización
initializeDatabase();
