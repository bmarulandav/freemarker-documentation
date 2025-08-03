// Script simple para poblar ejemplos
const mongoose = require('mongoose');
require('dotenv').config();

console.log('🚀 Iniciando script de población...');

async function main() {
  try {
    console.log('📡 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    const Example = require('./src/models/Example');
    
    // Limpiar todos los ejemplos existentes
    console.log('🧹 Limpiando ejemplos existentes...');
    const deletedCount = await Example.deleteMany({});
    console.log(`🗑️ ${deletedCount.deletedCount} ejemplos eliminados`);
    
    // Buscar la categoría "Básico" existente
    const Category = require('./src/models/Category');
    let basicCategory = await Category.findOne({ name: 'Básico' });
    
    if (!basicCategory) {
      console.log('❌ No se encontró la categoría Básico');
      // Crear la categoría si no existe
      basicCategory = new Category({
        name: 'Básico',
        slug: 'basico',
        description: 'Ejemplos básicos de FreeMarker',
        color: '#28a745'
      });
      await basicCategory.save();
      console.log('✅ Categoría Básico creada');
    } else {
      console.log('✅ Categoría Básico encontrada:', basicCategory._id);
    }
    
    // Crear un ejemplo súper simple
    console.log('📝 Creando ejemplo...');
    const ejemplo = new Example({
      title: 'Hola Mundo',
      slug: 'hola-mundo',
      description: 'Primer ejemplo de FreeMarker',
      code: '<h1>¡Hola Mundo!</h1>',
      explanation: 'Un ejemplo básico que muestra texto HTML simple.',
      difficulty: 'principiante',
      category: basicCategory._id,
      liferayVersion: '7.4',
      tags: ['basico', 'html'],
      author: {
        name: 'Admin',
        email: 'admin@test.com'
      },
      usage: {
        context: 'template',
        variables: []
      }
    });
    
    await ejemplo.save();
    console.log('✅ Ejemplo creado:', ejemplo.title);
    
    // Verificar
    const totalExamples = await Example.countDocuments();
    console.log(`📊 Total de ejemplos en BD: ${totalExamples}`);
    
    // Listar los ejemplos para confirmar
    const examples = await Example.find().populate('category');
    console.log('📋 Ejemplos encontrados:');
    examples.forEach(ex => {
      console.log(`  - ${ex.title} (${ex.category?.name || 'Sin categoría'})`);
    });
    
    await mongoose.disconnect();
    console.log('✅ Script completado exitosamente');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

main();
