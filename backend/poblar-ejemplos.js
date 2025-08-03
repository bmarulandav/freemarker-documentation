const mongoose = require('mongoose');
require('dotenv').config();

async function poblarEjemplos() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    // Importar modelo
    const Example = require('./src/models/Example');
    
    // Limpiar ejemplos existentes
    await Example.deleteMany({});
    console.log('🗑️ Ejemplos anteriores eliminados');
    
    // Crear ejemplos simples y funcionales
    const ejemplos = [
      {
        title: "Variables Básicas",
        description: "Ejemplo de uso de variables simples en FreeMarker",
        code: '<#assign nombre = "Juan">\n<#assign edad = 25>\n<h1>Hola ${nombre}!</h1>\n<p>Tienes ${edad} años</p>',
        category: "basico",
        difficulty: "beginner",
        tags: ["variables", "assign"]
      },
      {
        title: "Lista y Bucles",
        description: "Cómo iterar sobre listas con #list",
        code: '<#assign frutas = ["manzana", "banana", "naranja"]>\n<ul>\n<#list frutas as fruta>\n  <li>${fruta}</li>\n</#list>\n</ul>',
        category: "basico", 
        difficulty: "beginner",
        tags: ["list", "bucles", "arrays"]
      },
      {
        title: "Condicionales",
        description: "Uso de condicionales #if con variables",
        code: '<#assign usuario = {"nombre": "Ana", "edad": 30}>\n<#if usuario.edad >= 18>\n  <p>¡Hola ${usuario.nombre}! Eres mayor de edad</p>\n<#else>\n  <p>Hola ${usuario.nombre}, eres menor de edad</p>\n</#if>',
        category: "intermedio",
        difficulty: "intermediate", 
        tags: ["condicionales", "if", "objetos"]
      }
    ];
    
    // Insertar ejemplos
    for (let i = 0; i < ejemplos.length; i++) {
      const ejemplo = new Example(ejemplos[i]);
      await ejemplo.save();
      console.log(`✅ Creado ejemplo ${i + 1}: ${ejemplo.title}`);
    }
    
    console.log(`🎉 ${ejemplos.length} ejemplos creados exitosamente!`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar
poblarEjemplos();
