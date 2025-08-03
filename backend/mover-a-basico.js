// Script para mover el ejemplo "Tarjeta de Usuario" a la categoría Básico
const mongoose = require('mongoose');
require('dotenv').config();

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    const Example = require('./src/models/Example');
    const Category = require('./src/models/Category');
    
    // Buscar categorías
    const basicCategory = await Category.findOne({ name: 'Básico' });
    
    // Buscar el ejemplo "Tarjeta de Usuario"
    const ejemplo = await Example.findOne({ title: 'Tarjeta de Usuario' });
    
    if (ejemplo) {
      // Cambiar su categoría a Básico
      ejemplo.category = basicCategory._id;
      ejemplo.difficulty = 'principiante'; // También cambiar dificultad
      await ejemplo.save();
      
      console.log('✅ Ejemplo "Tarjeta de Usuario" movido a categoría Básico');
    } else {
      console.log('❌ No se encontró el ejemplo "Tarjeta de Usuario"');
    }
    
    // Verificar distribución de ejemplos por categoría
    const basicCount = await Example.countDocuments().populate('category').where('category.name').equals('Básico');
    const totalCount = await Example.countDocuments();
    
    console.log(`📊 Ejemplos en categoría Básico: ${basicCount}`);
    console.log(`📊 Total de ejemplos: ${totalCount}`);
    
    await mongoose.disconnect();
    console.log('✅ Completado');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
