Write-Host "Recreando package.json..." -ForegroundColor Yellow

# Eliminar package.json corrupto
if (Test-Path "package.json") {
    Remove-Item "package.json" -Force
    Write-Host "package.json eliminado" -ForegroundColor Green
}

# Crear contenido del package.json
$json = @'
{
  "name": "freemarker-docs-backend",
  "version": "1.0.0",
  "description": "Backend API para la plataforma de documentacion de FreeMarker en Liferay",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "demo": "node src/api-demo.js"
  },
  "keywords": ["freemarker", "liferay", "documentation", "api", "backend"],
  "author": "FreeMarker Docs Team",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "mongoose-paginate-v2": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "express-rate-limit": "^6.10.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
'@

# Escribir archivo
$json | Out-File -FilePath "package.json" -Encoding UTF8

Write-Host "Nuevo package.json creado" -ForegroundColor Green

# Verificar y ejecutar
if (Test-Path "package.json") {
    Write-Host "Instalando dependencias..." -ForegroundColor Blue
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Iniciando servidor..." -ForegroundColor Magenta
        npm start
    } else {
        Write-Host "Error instalando dependencias" -ForegroundColor Red
        Write-Host "Intentando con node directo..." -ForegroundColor Yellow
        node src/app.js
    }
} else {
    Write-Host "Error creando package.json" -ForegroundColor Red
}
