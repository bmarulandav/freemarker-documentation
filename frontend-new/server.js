import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// Tipos MIME
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    let url = req.url;
    let filePath;
    
    // Manejar rutas específicas para archivos estáticos
    if (url.endsWith('.css') || url.endsWith('.js') || url.endsWith('.html') || 
        url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.svg') || url.endsWith('.json')) {
        // Es un archivo estático, buscar directamente
        filePath = path.join(__dirname, 'public', url);
    } else if (url === '/') {
        // Ruta raíz
        filePath = path.join(__dirname, 'public', 'index.html');
    } else {
        // Cualquier otra ruta (SPA), servir index.html
        filePath = path.join(__dirname, 'public', 'index.html');
    }

    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'text/html';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Si el archivo no existe y es una ruta SPA, servir index.html
                if (!url.includes('.')) {
                    const indexPath = path.join(__dirname, 'public', 'index.html');
                    fs.readFile(indexPath, (indexErr, indexContent) => {
                        if (indexErr) {
                            res.writeHead(500);
                            res.end('Error interno del servidor');
                            return;
                        }
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(indexContent);
                    });
                } else {
                    res.writeHead(404);
                    res.end('Archivo no encontrado');
                }
            } else {
                res.writeHead(500);
                res.end('Error interno del servidor');
            }
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log('🚀 Servidor HTTP funcionando en puerto', PORT);
    console.log('🌐 Frontend disponible en http://localhost:' + PORT);
    console.log('✅ Servidor simple sin problemas de Vite');
    console.log('📁 Sirviendo archivos desde:', path.join(__dirname, 'public'));
});
