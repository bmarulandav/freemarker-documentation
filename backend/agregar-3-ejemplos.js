// Script para agregar 3 ejemplos más (sin borrar los existentes)
const mongoose = require('mongoose');
require('dotenv').config();

console.log('🚀 Agregando 3 ejemplos nuevos...');

async function main() {
  try {
    console.log('📡 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    const Example = require('./src/models/Example');
    const Category = require('./src/models/Category');
    
    // Buscar categorías existentes
    let basicCategory = await Category.findOne({ name: 'Básico' });
    let intermediateCategory = await Category.findOne({ name: 'Intermedio' });
    
    if (!intermediateCategory) {
      intermediateCategory = new Category({
        name: 'Intermedio',
        slug: 'intermedio',
        description: 'Ejemplos intermedios de FreeMarker',
        color: '#ffc107'
      });
      await intermediateCategory.save();
      console.log('✅ Categoría Intermedio creada');
    }
    
    console.log('📝 Creando 3 ejemplos nuevos...');
    
    // Ejemplo 1: Lista de usuarios
    const ejemplo1 = new Example({
      title: 'Lista de Usuarios',
      slug: 'lista-usuarios',
      description: 'Mostrar una lista de usuarios con sus datos',
      code: `<#assign usuarios = [
  {"nombre": "Juan", "edad": 28, "email": "juan@email.com"},
  {"nombre": "María", "edad": 32, "email": "maria@email.com"},
  {"nombre": "Carlos", "edad": 25, "email": "carlos@email.com"}
]>

<h2>Lista de Usuarios</h2>
<div class="usuarios">
<#list usuarios as usuario>
  <div class="usuario">
    <h3>\${usuario.nombre}</h3>
    <p>Edad: \${usuario.edad} años</p>
    <p>Email: \${usuario.email}</p>
  </div>
</#list>
</div>`,
      explanation: 'Este ejemplo muestra cómo crear una lista de objetos con múltiples propiedades y mostrarlos usando #list. Muy útil para mostrar datos de usuarios, productos, etc.',
      difficulty: 'principiante',
      category: basicCategory._id,
      liferayVersion: '7.4',
      tags: ['lista', 'objetos', 'usuarios'],
      author: {
        name: 'FreeMarker Docs',
        email: 'docs@freemarker.com'
      },
      usage: {
        context: 'template',
        variables: [
          { 
            name: 'usuarios', 
            type: 'Array', 
            description: 'Lista de objetos usuario con nombre, edad y email',
            required: false
          }
        ]
      }
    });
    
    // Ejemplo 2: Condicionales con números
    const ejemplo2 = new Example({
      title: 'Calificaciones con Colores',
      slug: 'calificaciones-colores',
      description: 'Mostrar calificaciones con diferentes colores según la nota',
      code: `<#assign estudiantes = [
  {"nombre": "Ana", "nota": 95},
  {"nombre": "Luis", "nota": 78},
  {"nombre": "Sofia", "nota": 45},
  {"nombre": "Pedro", "nota": 88}
]>

<h2>Calificaciones de Estudiantes</h2>
<#list estudiantes as estudiante>
  <div class="estudiante">
    <span>\${estudiante.nombre}: \${estudiante.nota}</span>
    <#if estudiante.nota >= 90>
      <span style="color: green;">🏆 Excelente</span>
    <#elseif estudiante.nota >= 70>
      <span style="color: blue;">👍 Bueno</span>
    <#elseif estudiante.nota >= 60>
      <span style="color: orange;">⚠️ Regular</span>
    <#else>
      <span style="color: red;">❌ Necesita mejorar</span>
    </#if>
  </div>
</#list>`,
      explanation: 'Este ejemplo demuestra el uso de condicionales múltiples (#if #elseif #else) para categorizar datos numéricos. Perfecto para sistemas de calificación, estados, niveles, etc.',
      difficulty: 'intermedio',
      category: intermediateCategory._id,
      liferayVersion: '7.4',
      tags: ['condicionales', 'numeros', 'calificaciones'],
      author: {
        name: 'FreeMarker Docs',
        email: 'docs@freemarker.com'
      },
      usage: {
        context: 'template',
        variables: [
          { 
            name: 'estudiantes', 
            type: 'Array', 
            description: 'Lista de estudiantes con nombre y nota numérica',
            required: false
          }
        ]
      }
    });
    
    // Ejemplo 3: Formato de fechas y texto
    const ejemplo3 = new Example({
      title: 'Información de Productos',
      slug: 'info-productos',
      description: 'Mostrar productos con formato y funciones de texto',
      code: `<#assign productos = [
  {"nombre": "laptop gaming", "precio": 1299.99, "disponible": true},
  {"nombre": "mouse inalámbrico", "precio": 29.50, "disponible": false},
  {"nombre": "teclado mecánico", "precio": 89.99, "disponible": true}
]>

<h2>Catálogo de Productos</h2>
<#list productos as producto>
  <div class="producto">
    <h3>\${producto.nombre?cap_first}</h3>
    <p>Precio: $\${producto.precio?string("0.00")}</p>
    <p>Estado: 
      <#if producto.disponible>
        <span style="color: green;">✅ Disponible</span>
      <#else>
        <span style="color: red;">❌ Agotado</span>
      </#else>
    </p>
    <p>Categoría: \${producto.nombre?contains("gaming")?then("Gaming", "Accesorios")}</p>
  </div>
</#list>`,
      explanation: 'Este ejemplo muestra funciones útiles de FreeMarker: ?cap_first (capitalizar), ?string (formatear números), ?contains (buscar texto), y operador ternario ?then(). Muy práctico para mostrar datos con formato.',
      difficulty: 'intermedio',
      category: intermediateCategory._id,
      liferayVersion: '7.4',
      tags: ['formato', 'funciones', 'productos'],
      author: {
        name: 'FreeMarker Docs',
        email: 'docs@freemarker.com'
      },
      usage: {
        context: 'template',
        variables: [
          { 
            name: 'productos', 
            type: 'Array', 
            description: 'Lista de productos con nombre, precio y disponibilidad',
            required: false
          }
        ]
      }
    });
    
    // Guardar los ejemplos
    await ejemplo1.save();
    console.log('✅ Creado: Lista de Usuarios');
    
    await ejemplo2.save();
    console.log('✅ Creado: Calificaciones con Colores');
    
    await ejemplo3.save();
    console.log('✅ Creado: Información de Productos');
    
    // Verificar total
    const totalExamples = await Example.countDocuments();
    console.log(`📊 Total de ejemplos en BD: ${totalExamples}`);
    
    await mongoose.disconnect();
    console.log('✅ ¡3 ejemplos nuevos agregados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
