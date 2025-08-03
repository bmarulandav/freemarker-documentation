const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Cargar variables de entorno desde la carpeta padre
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();

// Middleware de seguridad
app.use(helmet());

// CORS más flexible para desarrollo y producción
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000', 
  'https://688f107b756f329d43a50df8--shiny-toffee-e9e38e.netlify.app',
  'https://shiny-toffee-e9e38e.netlify.app',
  process.env.FRONTEND_URL
].filter(Boolean);

console.log('🌐 CORS configurado para:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (ej: mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ CORS bloqueado para:', origin);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP cada 15 minutos
});
app.use('/api/', limiter);

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Conexión a MongoDB
console.log('🔌 Intentando conectar a MongoDB...');
console.log('📍 URI configurada:', process.env.MONGODB_URI ? 'SÍ' : 'NO');
console.log('📍 URI preview:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 30) + '...' : 'undefined');

const mongoOptions = {
  serverSelectionTimeoutMS: 5000, // Timeout después de 5s en lugar de 30s
  socketTimeoutMS: 45000, // Cerrar sockets después de 45s de inactividad
  family: 4, // Usar IPv4, evitar problemas IPv6
  bufferCommands: false, // Deshabilitar mongoose buffering
  bufferMaxEntries: 0 // Deshabilitar mongoose buffering
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freemarker-docs', mongoOptions)
.then(() => {
  console.log('✅ Conectado a MongoDB exitosamente');
  console.log('🗄️ Base de datos:', mongoose.connection.name);
})
.catch(err => {
  console.error('❌ Error conectando a MongoDB:', err.message);
  console.error('💡 Verifica tu conexión a internet y las credenciales de MongoDB Atlas');
  console.error('🔍 MongoDB URI está configurada:', process.env.MONGODB_URI ? 'SÍ' : 'NO');
});

// Importar rutas
const exampleRoutes = require('./routes/examples');
const categoryRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');

// Endpoint de diagnóstico
app.get('/api/debug', async (req, res) => {
  try {
    const Example = require('./models/Example');
    const Category = require('./models/Category');
    
    // Información detallada del entorno
    const debugInfo = {
      environment: process.env.NODE_ENV || 'development',
      mongoUri: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
      mongoUriPreview: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'undefined',
      mongoConnectionState: mongoose.connection.readyState,
      mongoConnectionStates: {
        0: 'disconnected',
        1: 'connected', 
        2: 'connecting',
        3: 'disconnecting'
      },
      databaseName: mongoose.connection.name || 'undefined'
    };

    // Intentar contar documentos solo si está conectado
    if (mongoose.connection.readyState === 1) {
      const exampleCount = await Example.countDocuments();
      const categoryCount = await Category.countDocuments();
      const publishedExamples = await Example.countDocuments({ isPublished: true });
      const sampleExamples = await Example.find().limit(3).select('title slug difficulty category');
      
      debugInfo.totalExamples = exampleCount;
      debugInfo.totalCategories = categoryCount;
      debugInfo.publishedExamples = publishedExamples;
      debugInfo.sampleExamples = sampleExamples;
    } else {
      debugInfo.note = 'Database not connected, skipping queries';
    }
    
    res.json({
      success: true,
      debug: debugInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      debug: {
        environment: process.env.NODE_ENV || 'development',
        mongoUri: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
        mongoConnectionState: mongoose.connection.readyState,
        mongoConnectionStates: {
          0: 'disconnected',
          1: 'connected', 
          2: 'connecting',
          3: 'disconnecting'
        }
      }
    });
  }
});

// Rutas principales
app.use('/api/examples', exampleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

// Endpoint para procesar templates de FreeMarker (simulado)
app.post('/api/process-template', (req, res) => {
  try {
    const { template, data } = req.body;
    
    if (!template) {
      return res.status(400).json({ error: 'Template es requerido' });
    }
    
    // Simular procesamiento de FreeMarker
    let parsedData = {};
    
    if (data) {
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        return res.status(400).json({ error: 'Datos JSON inválidos' });
      }
    }
    
    // Variables locales definidas con #assign
    const localVars = {};
    
    // Simulación mejorada de procesamiento de template
    let output = template;
    
    // Procesamiento de directivas #assign
    output = output.replace(/<#assign\s+(\w+)\s*=\s*(\[.*?\]|"[^"]*"|'[^']*'|\d+(?:\.\d+)?|true|false)>/g, 
      (match, varName, value) => {
        try {
          // Convertir el valor a tipo JavaScript
          let parsedValue;
          if (value.startsWith('[') && value.endsWith(']')) {
            // Array
            parsedValue = JSON.parse(value.replace(/'/g, '"'));
          } else if (value.startsWith('"') || value.startsWith("'")) {
            // String
            parsedValue = value.slice(1, -1);
          } else if (value === 'true' || value === 'false') {
            // Boolean
            parsedValue = value === 'true';
          } else if (!isNaN(value)) {
            // Number
            parsedValue = parseFloat(value);
          } else {
            parsedValue = value;
          }
          
          localVars[varName] = parsedValue;
          console.log(`Assigned ${varName} = ${JSON.stringify(parsedValue)}`);
        } catch (e) {
          console.error('Error parsing assign:', e);
        }
        return ''; // Remover la directiva del output
      });
    
    // Combinar datos externos con variables locales
    const allVars = { ...parsedData, ...localVars };
    
    // Procesamiento mejorado de #list con soporte para arrays literales y variables
    output = output.replace(/<#list\s+(\[.*?\]|\w+)\s+as\s+(\w+)>\s*([\s\S]*?)\s*<\/#list>/g, 
      (match, arrayRef, itemVar, content) => {
        let array;
        
        // Si es un array literal [1, 2, 3]
        if (arrayRef.startsWith('[') && arrayRef.endsWith(']')) {
          try {
            array = JSON.parse(arrayRef.replace(/'/g, '"'));
          } catch (e) {
            console.error('Error parsing literal array:', e);
            return '[Error parsing array: ' + arrayRef + ']';
          }
        } else {
          // Si es una variable
          array = allVars[arrayRef];
        }
        
        if (Array.isArray(array)) {
          return array.map((item, index) => {
            let itemContent = content;
            
            // Procesar condicionales #if dentro del bucle con contexto del índice
            itemContent = itemContent.replace(/<#if\s+([^>]+)>\s*([\s\S]*?)\s*(?:<#elseif\s+([^>]+)>\s*([\s\S]*?)\s*)*(?:<#else>\s*([\s\S]*?)\s*)?<\/#if>/g, 
              (match, condition, ifContent, elseifCondition, elseifContent, elseContent) => {
                let isTrue = false;
                
                // Condiciones con ?index del bucle actual
                if (condition.includes(`${itemVar}?index`)) {
                  const indexMatch = condition.match(new RegExp(`${itemVar}\\?index\\s*(==|>=|<=|>|<)\\s*(\\d+)`));
                  if (indexMatch) {
                    const [, operator, value] = indexMatch;
                    const compareValue = parseInt(value);
                    switch (operator) {
                      case '==': isTrue = index == compareValue; break;
                      case '>=': isTrue = index >= compareValue; break;
                      case '<=': isTrue = index <= compareValue; break;
                      case '>': isTrue = index > compareValue; break;
                      case '<': isTrue = index < compareValue; break;
                    }
                  }
                }
                // Comparaciones de propiedades del item
                else if (condition.includes(`${itemVar}.`)) {
                  const comparisonMatch = condition.match(new RegExp(`${itemVar}\\.(\\w+)\\s*(>=|<=|==|>|<)\\s*(\\d+(?:\\.\\d+)?)`));
                  if (comparisonMatch) {
                    const [, prop, operator, value] = comparisonMatch;
                    const itemValue = item[prop];
                    const compareValue = parseFloat(value);
                    
                    switch (operator) {
                      case '>=': isTrue = itemValue >= compareValue; break;
                      case '<=': isTrue = itemValue <= compareValue; break;
                      case '==': isTrue = itemValue == compareValue; break;
                      case '>': isTrue = itemValue > compareValue; break;
                      case '<': isTrue = itemValue < compareValue; break;
                    }
                  }
                }
                
                return isTrue ? (ifContent || '').trim() : (elseContent || '').trim();
              });
            
            // Reemplazar referencias al item
            itemContent = itemContent.replace(new RegExp(`\\$\\{${itemVar}\\}`, 'g'), item);
            itemContent = itemContent.replace(new RegExp(`\\$\\{${itemVar}\\.([^}]+)\\}`, 'g'), 
              (m, prop) => item[prop] || `[Undefined: ${itemVar}.${prop}]`);
            
            // Reemplazar funciones de índice
            itemContent = itemContent.replace(new RegExp(`\\$\\{${itemVar}\\?index\\}`, 'g'), index);
            itemContent = itemContent.replace(new RegExp(`\\$\\{${itemVar}\\?upper_case\\}`, 'g'), 
              typeof item === 'string' ? item.toUpperCase() : item);
            
            // Reemplazar referencias al array original (solo si no es literal)
            if (!arrayRef.startsWith('[')) {
              itemContent = itemContent.replace(new RegExp(`\\$\\{${arrayRef}\\?size\\}`, 'g'), array.length);
            }
            
            return itemContent;
          }).join('\n');
        }
        return '[Array not found or invalid: ' + arrayRef + ']';
      });
    
    // Procesamiento básico de directivas #if con soporte para ?has_content, ?index y comparaciones numéricas
    output = output.replace(/<#if\s+([^>]+)>\s*([\s\S]*?)\s*(?:<#elseif\s+([^>]+)>\s*([\s\S]*?)\s*)*(?:<#else>\s*([\s\S]*?)\s*)?<\/#if>/g, 
      (match, condition, ifContent, elseifCondition, elseifContent, elseContent) => {
        // Evaluación básica de condiciones
        let isTrue = false;
        
        // Evaluar la condición principal
        isTrue = evaluateCondition(condition, allVars);
        
        if (isTrue) {
          return (ifContent || '').trim();
        } else if (elseifCondition) {
          // Evaluar la condición elseif
          const elseifTrue = evaluateCondition(elseifCondition, allVars);
          if (elseifTrue) {
            return (elseifContent || '').trim();
          }
        }
        
        return (elseContent || '').trim();
      });
    
    // Función helper para evaluar condiciones
    function evaluateCondition(condition, vars) {
      if (condition.includes('?has_content')) {
        const varName = condition.replace('?has_content', '').trim();
        const value = getNestedValue(vars, varName);
        return value && (Array.isArray(value) ? value.length > 0 : Boolean(value));
      } else if (condition.includes('?index')) {
        // Para condiciones de índice como item?index == 0
        const indexMatch = condition.match(/(\w+)\?index\s*==\s*(\d+)/);
        if (indexMatch) {
          // Esta sería evaluada en el contexto del loop, simplificado aquí
          return true; // Simplificación
        }
      } else if (condition.includes('>=') || condition.includes('<=') || condition.includes('==') || condition.includes('>') || condition.includes('<')) {
        // Comparaciones numéricas como usuario.edad >= 18
        const comparisonMatch = condition.match(/([^>=<]+)\s*(>=|<=|==|>|<)\s*(\d+(?:\.\d+)?)/);
        if (comparisonMatch) {
          const [, leftVar, operator, rightValue] = comparisonMatch;
          const leftValue = getNestedValue(vars, leftVar.trim());
          const rightNum = parseFloat(rightValue);
          
          console.log(`Evaluating condition: ${leftVar.trim()} ${operator} ${rightValue} = ${leftValue} ${operator} ${rightNum}`);
          
          switch (operator) {
            case '>=': return leftValue >= rightNum;
            case '<=': return leftValue <= rightNum;
            case '==': return leftValue == rightNum;
            case '>': return leftValue > rightNum;
            case '<': return leftValue < rightNum;
          }
        }
      }
      return false;
    }
    
    // Función helper para obtener valores anidados
    function getNestedValue(obj, path) {
      const keys = path.split('.');
      let value = obj;
      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          return undefined;
        }
      }
      return value;
    }
    
    // Reemplazar variables con funciones y propiedades anidadas
    output = output.replace(/\$\{([^}]+)\}/g, (match, variable) => {
      console.log(`Processing variable: ${variable}`);
      
      // Manejar funciones especiales con parámetros como ?string["0.00"]
      if (variable.includes('?string[')) {
        const stringMatch = variable.match(/^(.+?)\?string\["([^"]+)"\]$/);
        if (stringMatch) {
          const [, expression, format] = stringMatch;
          // Evaluar la expresión primero
          const value = evaluateExpression(expression, allVars);
          if (typeof value === 'number') {
            return value.toFixed(2); // Formato básico para decimales
          }
          return String(value);
        }
      }
      
      // Manejar otras funciones especiales simples
      if (variable.includes('?')) {
        const [varPath, func] = variable.split('?');
        
        // Si la parte izquierda es una expresión matemática, evaluarla primero
        let value;
        if (varPath.includes('*') || varPath.includes('+') || varPath.includes('-') || varPath.includes('/') || varPath.includes('(')) {
          value = evaluateExpression(varPath, allVars);
        } else {
          value = getNestedValue(allVars, varPath.trim());
        }
        
        switch (func) {
          case 'size':
            return Array.isArray(value) ? value.length : (value ? 1 : 0);
          case 'int':
            return Math.floor(parseFloat(value) || 0);
          case 'upper_case':
            return typeof value === 'string' ? value.toUpperCase() : value;
          case 'lower_case':
            return typeof value === 'string' ? value.toLowerCase() : value;
          default:
            // Si no reconocemos la función, devolvemos el valor original
            return value !== undefined ? String(value) : `[Undefined: ${variable}]`;
        }
      }
      
      // Manejar expresiones matemáticas simples como (descuento * 100)
      if (variable.includes('*') || variable.includes('+') || variable.includes('-') || variable.includes('/') || variable.includes('(')) {
        const result = evaluateExpression(variable, allVars);
        return result !== undefined ? String(result) : `[Error in expression: ${variable}]`;
      }
      
      // Variables simples y propiedades anidadas
      const value = getNestedValue(allVars, variable.trim());
      return value !== undefined ? String(value) : `[Undefined: ${variable}]`;
    });
    
    // Función helper para evaluar expresiones matemáticas
    function evaluateExpression(expression, vars) {
      try {
        console.log(`Evaluating expression: ${expression}`);
        
        // Reemplazar variables en la expresión
        let processedExpression = expression;
        const varMatches = expression.match(/\b\w+(?:\.\w+)*\b/g);
        if (varMatches) {
          varMatches.forEach(varName => {
            const value = getNestedValue(vars, varName);
            if (value !== undefined) {
              // Escapar puntos en el nombre de variable para regex
              const escapedVarName = varName.replace(/\./g, '\\.');
              processedExpression = processedExpression.replace(new RegExp(`\\b${escapedVarName}\\b`, 'g'), value);
            }
          });
        }
        
        console.log(`Processed expression: ${processedExpression}`);
        
        // Evaluar la expresión matemática de forma más segura
        // Solo permitir números, operadores básicos y paréntesis
        if (/^[\d\s+\-*/.()]+$/.test(processedExpression)) {
          const result = Function('"use strict"; return (' + processedExpression + ')')();
          console.log(`Expression result: ${result}`);
          return result;
        } else {
          console.log(`Expression contains invalid characters: ${processedExpression}`);
          return undefined;
        }
      } catch (e) {
        console.error(`Error evaluating expression: ${expression}`, e);
        return undefined;
      }
    }
    
    // Remover comentarios de FreeMarker
    output = output.replace(/<#--[\s\S]*?-->/g, '');
    
    res.json({ 
      output: output.trim(),
      success: true 
    });
  } catch (error) {
    console.error('Error procesando template:', error);
    res.status(500).json({ 
      error: 'Error procesando template: ' + error.message 
    });
  }
});

// Ruta de diagnóstico para verificar base de datos
app.get('/api/debug-db', async (req, res) => {
  try {
    const Example = require('./models/Example');
    const Category = require('./models/Category');
    
    // Contar documentos
    const exampleCount = await Example.countDocuments();
    const categoryCount = await Category.countDocuments();
    
    // Obtener todos los ejemplos (sin paginación para debug)
    const allExamples = await Example.find().populate('category').limit(5);
    const allCategories = await Category.find().limit(5);
    
    res.json({
      success: true,
      database: {
        connected: mongoose.connection.readyState === 1,
        name: mongoose.connection.name,
        host: mongoose.connection.host
      },
      counts: {
        examples: exampleCount,
        categories: categoryCount
      },
      samples: {
        examples: allExamples.map(ex => ({
          id: ex._id,
          title: ex.title,
          category: ex.category ? ex.category.name : 'No category'
        })),
        categories: allCategories.map(cat => ({
          id: cat._id,
          name: cat.name,
          slug: cat.slug
        }))
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Ruta temporal para poblar ejemplos
app.get('/api/populate-examples', async (req, res) => {
  try {
    const Example = require('./models/Example');
    const Category = require('./models/Category');
    
    // Buscar categorías existentes por nombre (no slug para evitar problemas de codificación)
    let basicCategory = await Category.findOne({ name: 'Básico' });
    let intermediateCategory = await Category.findOne({ name: 'Intermedio' });
    
    // Si no existen, crearlas
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
    
    console.log('Usando categorías:', {
      basico: { id: basicCategory._id, name: basicCategory.name },
      intermedio: { id: intermediateCategory._id, name: intermediateCategory.name }
    });
    
    // Limpiar ejemplos existentes
    const deletedCount = await Example.deleteMany({});
    console.log(`${deletedCount.deletedCount} ejemplos anteriores eliminados`);
    
    // Crear ejemplos con todos los campos requeridos
    const ejemplos = [
      {
        title: "Variables Básicas",
        slug: "variables-basicas",
        description: "Ejemplo de uso de variables simples en FreeMarker",
        code: '<#assign nombre = "Juan">\n<#assign edad = 25>\n<h1>Hola ${nombre}!</h1>\n<p>Tienes ${edad} años</p>',
        explanation: "Este ejemplo muestra cómo usar la directiva #assign para crear variables y luego mostrarlas usando la sintaxis ${variable}.",
        category: basicCategory._id,
        difficulty: "principiante",
        liferayVersion: "7.4",
        tags: ["variables", "assign"],
        author: {
          name: "FreeMarker Docs",
          email: "docs@freemarker.com"
        },
        usage: {
          context: "template",
          variables: [
            { name: "nombre", type: "String", description: "Nombre de la persona" },
            { name: "edad", type: "Number", description: "Edad de la persona" }
          ]
        }
      },
      {
        title: "Lista y Bucles",
        slug: "lista-y-bucles", 
        description: "Cómo iterar sobre listas con #list",
        code: '<#assign frutas = ["manzana", "banana", "naranja"]>\n<ul>\n<#list frutas as fruta>\n  <li>${fruta}</li>\n</#list>\n</ul>',
        explanation: "Este ejemplo demuestra cómo crear una lista con #assign y luego iterar sobre ella usando #list. Cada elemento se procesa individualmente.",
        category: basicCategory._id,
        difficulty: "principiante", 
        liferayVersion: "7.4",
        tags: ["list", "bucles", "arrays"],
        author: {
          name: "FreeMarker Docs",
          email: "docs@freemarker.com"
        },
        usage: {
          context: "template",
          variables: [
            { name: "frutas", type: "Array", description: "Lista de frutas" }
          ]
        }
      },
      {
        title: "Condicionales",
        slug: "condicionales",
        description: "Uso de condicionales #if con variables",
        code: '<#assign usuario = {"nombre": "Ana", "edad": 30}>\n<#if usuario.edad >= 18>\n  <p>¡Hola ${usuario.nombre}! Eres mayor de edad</p>\n<#else>\n  <p>Hola ${usuario.nombre}, eres menor de edad</p>\n</#if>',
        explanation: "Este ejemplo muestra cómo usar condicionales #if/#else para tomar decisiones basadas en valores de variables. Se evalúa la edad del usuario.",
        category: intermediateCategory._id,
        difficulty: "intermedio",
        liferayVersion: "7.4",
        tags: ["condicionales", "if", "objetos"],
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
    
    // Insertar ejemplos uno por uno con mejor logging
    const createdExamples = [];
    for (let i = 0; i < ejemplos.length; i++) {
      try {
        const ejemploData = ejemplos[i];
        console.log(`Creando ejemplo ${i + 1}: ${ejemploData.title}`);
        console.log(`Categoría asignada: ${ejemploData.category}`);
        
        const ejemplo = new Example(ejemploData);
        const savedExample = await ejemplo.save();
        createdExamples.push(savedExample);
        
        console.log(`✅ Ejemplo ${i + 1} creado exitosamente: ${savedExample.title}`);
      } catch (error) {
        console.error(`❌ Error creando ejemplo ${i + 1}:`, error.message);
        return res.status(500).json({
          success: false,
          error: `Error creando ejemplo ${i + 1}: ${error.message}`
        });
      }
    }
    
    // Verificar que se crearon
    const finalCount = await Example.countDocuments();
    
    res.json({
      success: true,
      message: `${createdExamples.length} ejemplos creados exitosamente`,
      finalCount: finalCount,
      examples: createdExamples.map(ex => ({ 
        title: ex.title, 
        slug: ex.slug,
        category: ex.category
      })),
      categories: {
        basico: basicCategory.name,
        intermedio: intermediateCategory.name
      }
    });
    
  } catch (error) {
    console.error('Error poblando ejemplos:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'FreeMarker Documentation API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal!'
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📚 API de documentación FreeMarker disponible en http://localhost:${PORT}/api`);
});

module.exports = app;
