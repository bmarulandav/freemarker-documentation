#!/usr/bin/env pwsh

Write-Host "🔧 Recreando package.json..." -ForegroundColor Yellow

# Eliminar package.json corrupto si existe
if (Test-Path "package.json") {
    Remove-Item "package.json" -Force
    Write-Host "✅ package.json corrupto eliminado" -ForegroundColor Green
}

# Crear nuevo package.json con codificación UTF-8
$packageContent = @'
{
  "name": "freemarker-docs-backend",
  "version": "1.0.0",
  "description": "Backend API para la plataforma de documentación de FreeMarker en Liferay",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "demo": "node src/api-demo.js",
    "test": "echo \"Error: no test specified\" && exit 1"
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

# Escribir el archivo con codificación UTF-8
$packageContent | Out-File -FilePath "package.json" -Encoding UTF8 -NoNewline

Write-Host "✅ Nuevo package.json creado" -ForegroundColor Green

# Verificar que el archivo se creó correctamente
if (Test-Path "package.json") {
    Write-Host "🔍 Verificando contenido..." -ForegroundColor Blue
    $content = Get-Content "package.json" -Raw
    if ($content -match '"name".*"freemarker-docs-backend"') {
        Write-Host "✅ package.json válido creado exitosamente" -ForegroundColor Green
        
        # Instalar dependencias
        Write-Host "📦 Instalando dependencias..." -ForegroundColor Blue 
        npm install
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Dependencias instaladas correctamente" -ForegroundColor Green
            Write-Host "🚀 Iniciando servidor..." -ForegroundColor Magenta
            npm start
        } else {
            Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Error: package.json no tiene el contenido correcto" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Error: No se pudo crear package.json" -ForegroundColor Red
}
