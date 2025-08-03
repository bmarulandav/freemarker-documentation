// Script para actualizar ejemplos de FreeMarker
const mongoose = require('mongoose');
require('dotenv').config();

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Conectado a MongoDB');
  
  const Example = require('./src/models/Example');
  const Category = require('./src/models/Category');
  
  // Buscar o crear categorías existentes
  let basicCategory = await Category.findOne({ name: 'Básico' });
  if (!basicCategory) {
    basicCategory = new Category({
      name: 'Básico',
      slug: 'basico',
      description: 'Ejemplos básicos de FreeMarker',
      color: '#28a745'
    });
    await basicCategory.save();
    console.log('Categoría Básico creada');
  }
  
  let intermediateCategory = await Category.findOne({ name: 'Intermedio' });
  if (!intermediateCategory) {
    intermediateCategory = new Category({
      name: 'Intermedio',
      slug: 'intermedio', 
      description: 'Ejemplos intermedios de FreeMarker',
      color: '#ffc107'
    });
    await intermediateCategory.save();
    console.log('Categoría Intermedio creada');
  }
  
  // Limpiar ejemplos
  await Example.deleteMany({});
  console.log('Ejemplos eliminados');
  
  // Crear nuevos ejemplos optimizados CON TODOS LOS CAMPOS REQUERIDOS
  const ejemplos = [
    {
      title: "Variables Básicas",
      slug: "variables-basicas",
      description: "Ejemplo básico de variables en FreeMarker",
      code: '<#assign nombre = "Mundo">\n<h1>¡Hola ${nombre}!</h1>',
      explanation: "Este ejemplo muestra cómo usar la directiva #assign para crear variables y mostrarlas.",
      difficulty: "principiante",
      category: basicCategory._id,
      liferayVersion: "7.4",
      tags: ["variables", "basico"],
      author: {
        name: "FreeMarker Docs",
        email: "docs@freemarker.com"
      },
      usage: {
        context: "template",
        variables: [
          { name: "nombre", type: "String", description: "Nombre a mostrar" }
        ]
      }
    },
    {
      title: "Bucles y Listas",
      slug: "bucles-y-listas",
      description: "Lista con bucles #list",
      code: '<#assign items = ["A", "B", "C"]>\n<#list items as item>\n  <div>${item} - ${item?index}</div>\n</#list>',
      explanation: "Este ejemplo demuestra cómo iterar sobre listas usando la directiva #list.",
      difficulty: "principiante", 
      category: basicCategory._id,
      liferayVersion: "7.4",
      tags: ["bucles", "listas"],
      author: {
        name: "FreeMarker Docs",
        email: "docs@freemarker.com"
      },
      usage: {
        context: "template",
        variables: [
          { name: "items", type: "Array", description: "Lista de elementos" }
        ]
      }
    },
    {
      title: "Condicionales con Objetos",
      slug: "condicionales-objetos",
      description: "Procesamiento de objetos con condicionales",
      code: '<#assign usuario = {"nombre": "Ana", "edad": 30}>\n<#if usuario.edad >= 18>\n  <p>¡Hola ${usuario.nombre}! Eres mayor de edad</p>\n<#else>\n  <p>Hola ${usuario.nombre}, eres menor</p>\n</#if>',
      explanation: "Este ejemplo muestra cómo trabajar con objetos usando condicionales #if/#else.",
      difficulty: "intermedio",
      category: intermediateCategory._id,
      liferayVersion: "7.4",
      tags: ["condicionales", "objetos"],
      author: {
        name: "FreeMarker Docs",
        email: "docs@freemarker.com"
      },
      usage: {
        context: "template",
        variables: [
          { name: "usuario", type: "Object", description: "Objeto con datos del usuario" }
        ]
      }
    }
  ];
  
  for (const ej of ejemplos) {
    try {
      const ejemplo = new Example(ej);
      await ejemplo.save();
      console.log('✅ Creado:', ej.title);
    } catch (error) {
      console.error('❌ Error creando:', ej.title, error.message);
    }
  }
  
  // Verificar que se crearon
  const finalCount = await Example.countDocuments();
  console.log(`📊 Total de ejemplos creados: ${finalCount}`);
  
  await mongoose.disconnect();
  console.log('✅ Actualización completa');
}

main().catch(console.error);
