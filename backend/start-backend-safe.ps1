#!/usr/bin/env pwsh

Write-Host "🔧 Script de inicio del Backend FreeMarker" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Blue

# Verificar ubicación
$currentPath = Get-Location
Write-Host "📂 Ubicación actual: $currentPath" -ForegroundColor Yellow

# Verificar que estemos en la carpeta backend
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json" -ForegroundColor Red
    Write-Host "   Asegúrate de estar en la carpeta backend" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar Node.js
Write-Host "🔍 Verificando Node.js..." -ForegroundColor Blue
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Node.js no está instalado o no se encuentra en PATH" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar npm
Write-Host "🔍 Verificando npm..." -ForegroundColor Blue
try {
    $npmVersion = npm --version
    Write-Host "✅ npm instalado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: npm no está disponible" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Validar package.json
Write-Host "🔍 Validando package.json..." -ForegroundColor Blue
try {
    $packageContent = Get-Content "package.json" -Raw | ConvertFrom-Json
    Write-Host "✅ package.json es válido" -ForegroundColor Green
    Write-Host "   Nombre: $($packageContent.name)" -ForegroundColor White
    Write-Host "   Versión: $($packageContent.version)" -ForegroundColor White
} catch {
    Write-Host "❌ Error: package.json no es válido" -ForegroundColor Red
    Write-Host "   $_" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️ Advertencia: node_modules no existe" -ForegroundColor Yellow
    Write-Host "🔄 Instalando dependencias..." -ForegroundColor Blue
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
        Read-Host "Presiona Enter para salir"
        exit 1
    }
}

# Verificar archivo principal
if (-not (Test-Path "src/app.js")) {
    Write-Host "❌ Error: No se encontró src/app.js" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "🚀 Iniciando servidor backend..." -ForegroundColor Green
Write-Host "   Puerto: 5000" -ForegroundColor White  
Write-Host "   Modo: development" -ForegroundColor White
Write-Host "   Archivo: src/app.js" -ForegroundColor White

Write-Host "`n⚡ El servidor se iniciará ahora..." -ForegroundColor Magenta
Write-Host "   Presiona Ctrl+C para detenerlo" -ForegroundColor Yellow
Write-Host "=================================================" -ForegroundColor Blue

# Iniciar servidor
npm run dev
