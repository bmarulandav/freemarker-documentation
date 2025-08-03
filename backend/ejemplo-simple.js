// Script súper simple para agregar ejemplos (sin errores de validación)
const mongoose = require('mongoose');
require('dotenv').config();

console.log('🚀 Agregando ejemplos simples...');

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    const Example = require('./src/models/Example');
    const Category = require('./src/models/Category');
    
    // Buscar categoría básica
    let basicCategory = await Category.findOne({ name: 'Básico' });
    
    console.log('📝 Creando ejemplo simple...');
    
    // Ejemplo súper simple sin variables complicadas
    const ejemplo = new Example({
      title: 'Lista de Números',
      slug: 'lista-numeros-' + Date.now(), // Slug único
      description: 'Ejemplo de lista simple con números',
      code: `<#list [1, 2, 3, 4, 5] as numero>
  <p>Número: \${numero}</p>
</#list>`,
      explanation: 'Este ejemplo muestra cómo hacer una lista simple con números del 1 al 5.',
      difficulty: 'principiante',
      category: basicCategory._id,
      liferayVersion: '7.4',
      tags: ['lista', 'numeros'],
      author: {
        name: 'Admin',
        email: 'admin@test.com'
      },
      usage: {
        context: 'template',
        variables: [] // Array vacío para evitar errores
      }
    });
    
    await ejemplo.save();
    console.log('✅ Ejemplo creado:', ejemplo.title);
    
    // Verificar total
    const total = await Example.countDocuments();
    console.log(`📊 Total ejemplos: ${total}`);
    
    await mongoose.disconnect();
    console.log('✅ Completado exitosamente');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

main();
