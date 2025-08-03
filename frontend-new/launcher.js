const { spawn } = require('child_process');
const path = require('path');

console.log('🌐 Iniciando servidor FreeMarker Frontend...');
console.log('📂 Directorio:', __dirname);

const frontend = spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: 'inherit'
});

frontend.on('close', (code) => {
  console.log(`💥 Servidor frontend terminó con código ${code}`);
});

frontend.on('error', (err) => {
  console.error('❌ Error iniciando servidor frontend:', err);
});
