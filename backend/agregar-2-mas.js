// Agregar 2 ejemplos más (estrategia sin variables complejas)
const mongoose = require('mongoose');
require('dotenv').config();

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    const Example = require('./src/models/Example');
    const Category = require('./src/models/Category');
    
    let basicCategory = await Category.findOne({ name: 'Básico' });
    let intermediateCategory = await Category.findOne({ name: 'Intermedio' });
    
    // Crear categoría intermedio si no existe
    if (!intermediateCategory) {
      intermediateCategory = new Category({
        name: 'Intermedio',
        slug: 'intermedio',
        description: 'Ejemplos intermedios',
        color: '#ffc107'
      });
      await intermediateCategory.save();
    }
    
    console.log('📝 Creando 2 ejemplos más...');
    
    // Ejemplo 3: Condicional simple
    const ejemplo3 = new Example({
      title: 'Mensaje Personalizado',
      slug: 'mensaje-personalizado-' + Date.now(),
      description: 'Mostrar mensaje según la hora del día',
      code: `<#assign hora = 14>
<#if hora < 12>
  <h2>¡Buenos días! ☀️</h2>
<#elseif hora < 18>
  <h2>¡Buenas tardes! 🌤️</h2>
<#else>
  <h2>¡Buenas noches! 🌙</h2>
</#if>`,
      explanation: 'Este ejemplo usa condicionales para mostrar diferentes mensajes según la hora del día.',
      difficulty: 'principiante',
      category: basicCategory._id,
      liferayVersion: '7.4',
      tags: ['condicionales', 'mensajes'],
      author: {
        name: 'Admin',
        email: 'admin@test.com'
      },
      usage: {
        context: 'template',
        variables: []
      }
    });
    
    // Ejemplo 4: Variables y texto
    const ejemplo4 = new Example({
      title: 'Tarjeta de Usuario',
      slug: 'tarjeta-usuario-' + Date.now(),
      description: 'Mostrar información básica de un usuario',
      code: `<#assign nombre = "María García">
<#assign cargo = "Desarrolladora">
<#assign activo = true>

<div class="tarjeta-usuario">
  <h3>\${nombre}</h3>
  <p>Cargo: \${cargo}</p>
  <#if activo>
    <span style="color: green;">🟢 Activo</span>
  <#else>
    <span style="color: red;">🔴 Inactivo</span>
  </#if>
</div>`,
      explanation: 'Combina variables de texto y booleanas para crear una tarjeta de usuario con estado.',
      difficulty: 'intermedio',
      category: intermediateCategory._id,
      liferayVersion: '7.4',
      tags: ['variables', 'usuario', 'tarjeta'],
      author: {
        name: 'Admin',
        email: 'admin@test.com'
      },
      usage: {
        context: 'template',
        variables: []
      }
    });
    
    await ejemplo3.save();
    console.log('✅ Creado: Mensaje Personalizado');
    
    await ejemplo4.save();
    console.log('✅ Creado: Tarjeta de Usuario');
    
    const total = await Example.countDocuments();
    console.log(`📊 Total ejemplos: ${total}`);
    
    await mongoose.disconnect();
    console.log('🎉 ¡Ahora tienes 4 ejemplos!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
