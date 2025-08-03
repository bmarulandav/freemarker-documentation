const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando servidor FreeMarker Backend...');
console.log('📂 Directorio:', __dirname);

const backend = spawn('node', ['src/app.js'], {
  cwd: __dirname,
  stdio: 'inherit'
});

backend.on('close', (code) => {
  console.log(`💥 Servidor backend terminó con código ${code}`);
});

backend.on('error', (err) => {
  console.error('❌ Error iniciando servidor backend:', err);
});
