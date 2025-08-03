console.log('🔍 Iniciando verificación del servidor...');
console.log('📁 Directorio actual:', process.cwd());
console.log('🔗 Archivo principal:', __filename);

try {
  console.log('🚀 Cargando aplicación...');
  require('./src/app.js');
} catch (error) {
  console.error('❌ Error al cargar la aplicación:', error.message);
  console.error('📋 Stack trace:', error.stack);
}
