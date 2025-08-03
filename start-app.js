const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando aplicación FreeMarker Documentation...');

// Iniciar backend
console.log('🔧 Iniciando Backend (Puerto 5000)...');
const backend = spawn('node', ['launcher.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit'
});

// Iniciar frontend  
console.log('🌐 Iniciando Frontend (Puerto 3000)...');
const frontend = spawn('node', ['launcher.js'], {
  cwd: path.join(__dirname, 'frontend-new'),
  stdio: 'inherit'
});

// Manejar cierre
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidores...');
  backend.kill();
  frontend.kill();
  process.exit();
});

backend.on('close', (code) => {
  console.log(`💥 Backend terminó con código ${code}`);
});

frontend.on('close', (code) => {
  console.log(`💥 Frontend terminó con código ${code}`);
});

console.log('✅ Servidores iniciados!');
console.log('📊 Backend API: http://localhost:5000/api');
console.log('🌐 Frontend: http://localhost:3000');
console.log('📋 Health Check: http://localhost:5000/api/health');
console.log('\n👆 Presiona Ctrl+C para detener ambos servidores');

// Verificar estado después de unos segundos
setTimeout(async () => {
  try {
    const fetch = await import('node-fetch').then(m => m.default);
    
    try {
      const response = await fetch('http://localhost:5000/api/health');
      const data = await response.json();
      console.log('✅ Backend Health Check:', data.message);
    } catch (error) {
      console.log('⚠️ Backend aún no está listo o hay un error');
    }
    
    try {
      const response = await fetch('http://localhost:3000');
      if (response.ok) {
        console.log('✅ Frontend está funcionando correctamente');
      }
    } catch (error) {
      console.log('⚠️ Frontend aún no está listo o hay un error');
    }
  } catch (error) {
    // node-fetch no está disponible, omitir verificaciones
    console.log('ℹ️ Verificaciones de estado no disponibles (node-fetch no instalado)');
  }
}, 3000);
