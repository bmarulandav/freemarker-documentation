// Script para actualizar el ejemplo de macros con código más compatible
const mongoose = require('mongoose');
require('dotenv').config();

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    const Example = require('./src/models/Example');
    
    // Buscar el ejemplo de macros
    const ejemplo = await Example.findOne({ title: 'Macros y Funciones Personalizadas' });
    
    if (ejemplo) {
      // Actualizar con código más simple y compatible
      ejemplo.code = `<#-- Simulando macros con templates simples -->
<#assign usuarios = [
  {"nombre": "Juan Pérez", "email": "juan@email.com", "activo": true},
  {"nombre": "Ana López", "email": "ana@email.com", "activo": false}
]>

<#assign tareas = ["Aprender FreeMarker", "Crear templates", "Usar funciones"]>

<h2>Tarjetas de Usuario</h2>
<#list usuarios as usuario>
  <div class="tarjeta \${usuario.activo?then('activo', 'inactivo')}">
    <h3>\${usuario.nombre}</h3>
    <p>📧 \${usuario.email}</p>
    <span class="estado">
      \${usuario.activo?then('🟢 Activo', '🔴 Inactivo')}
    </span>
  </div>
</#list>

<h2>Lista de Tareas</h2>
<ol>
  <#list tareas as tarea>
    <li>\${tarea}</li>
  </#list>
</ol>

<style>
.tarjeta { 
  border: 1px solid #ddd; 
  padding: 10px; 
  margin: 10px 0; 
  border-radius: 5px; 
}
.activo { border-color: green; }
.inactivo { border-color: red; }
</style>`;

      ejemplo.explanation = 'Ejemplo que simula el comportamiento de macros usando templates simples con listas y condicionales. Muestra cómo crear componentes reutilizables con datos estructurados.';
      
      await ejemplo.save();
      console.log('✅ Ejemplo "Macros y Funciones Personalizadas" actualizado');
    } else {
      console.log('❌ No se encontró el ejemplo');
    }
    
    await mongoose.disconnect();
    console.log('✅ Actualización completada');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
