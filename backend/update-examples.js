const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

async function updateExamples() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    const Example = require('./src/models/Example');
    
    // Limpiar ejemplos existentes
    await Example.deleteMany({});
    console.log('🗑️ Ejemplos antiguos eliminados');
    
    // Crear 3 ejemplos optimizados que funcionan perfectamente con nuestro procesador
    const newExamples = [
      {
        title: "Hola Mundo con Variables",
        description: "Ejemplo básico de variables y saludo personalizado",
        code: `<#assign nombre = "Mundo">
<#assign saludo = "¡Hola">

<div class="greeting">
  <h1>\${saludo} \${nombre}!</h1>
  <p>Bienvenido a FreeMarker</p>
</div>`,
        explanation: "Este ejemplo demuestra cómo usar variables locales con #assign y mostrarlas con \${variable}.",
        difficulty: "beginner",
        category: "basico",
        tags: ["variables", "assign", "basico"],
        usage: {
          variables: {},
          description: "No requiere datos externos, usa solo variables locales."
        }
      },
      {
        title: "Bucles y Condicionales",
        description: "Lista de elementos con condiciones y posiciones",
        code: `<#assign items = ["Primer elemento", "Segundo elemento", "Tercer elemento"]>
<#assign totalItems = 3>

<div class="lista-elementos">
  <h2>Lista de Elementos</h2>
  
  <#list items as item>
    <div class="elemento-\${item?index}">
      <#if item?has_content>
        <h3>\${item?upper_case}</h3>
        
        <#if item?index == 0>
          <span class="badge primero">🥇 Primer elemento</span>
        <#elseif item?index == 2>
          <span class="badge ultimo">🏁 Último elemento</span>
        <#else>
          <span class="badge medio">📍 Elemento intermedio</span>
        </#if>
        
        <p>Posición: \${item?index} de \${totalItems}</p>
      </#if>
    </div>
  </#list>
  
  <div class="resumen">
    <p>Total procesado: \${items?size} elementos</p>
  </div>
</div>`,
        explanation: "Demuestra bucles #list, condicionales #if/#elseif/#else, funciones como ?upper_case, ?index, ?size, y ?has_content.",
        difficulty: "intermediate",
        category: "control-flow",
        tags: ["bucles", "condicionales", "funciones", "list", "if"],
        usage: {
          variables: {},
          description: "Utiliza arrays locales y demuestra el control de flujo."
        }
      },
      {
        title: "Datos JSON con Usuario y Productos",
        description: "Procesamiento de datos JSON complejos con objetos y arrays",
        code: `<div class="perfil-usuario">
  <h1>¡Hola \${usuario.nombre}!</h1>
  
  <#if usuario.edad >= 18>
    <span class="adulto">Usuario mayor de edad (\${usuario.edad} años)</span>
  <#else>
    <span class="menor">Usuario menor de edad</span>
  </#if>
</div>

<#assign descuento = 10>

<div class="catalogo-productos">
  <h2>Catálogo de Productos</h2>
  <p>Descuento especial: \${descuento}% para \${usuario.nombre}</p>
  
  <#list productos as producto>
    <div class="producto-card">
      <h3>\${producto.nombre}</h3>
      <p class="precio">Precio: $\${producto.precio}</p>
      
      <#if producto?index == 0>
        <span class="destacado">⭐ ¡Producto destacado!</span>
      </#if>
      
      <#if producto.precio > 500>
        <span class="premium">💎 Producto Premium</span>
      <#else>
        <span class="economico">💰 Precio económico</span>
      </#if>
    </div>
  </#list>
  
  <div class="total">
    <p>Total de productos: \${productos?size}</p>
  </div>
</div>`,
        explanation: "Muestra cómo procesar datos JSON externos con objetos anidados, arrays de objetos, y combinación con variables locales.",
        difficulty: "advanced",
        category: "datos-json",
        tags: ["json", "objetos", "arrays", "datos-externos"],
        usage: {
          variables: {
            usuario: {
              nombre: "Juan",
              edad: 30
            },
            productos: [
              { nombre: "Laptop", precio: 999.99 },
              { nombre: "Mouse", precio: 25.50 }
            ]
          },
          description: "Requiere datos JSON con usuario y productos para funcionar correctamente."
        }
      }
    ];

    // Insertar los nuevos ejemplos
    for (const exampleData of newExamples) {
      const example = new Example(exampleData);
      await example.save();
      console.log(`✅ Ejemplo creado: ${example.title} (${example.slug})`);
    }
    
    console.log('🎉 Todos los ejemplos han sido actualizados exitosamente');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateExamples();
