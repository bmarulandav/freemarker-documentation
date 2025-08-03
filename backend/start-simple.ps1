#!/usr/bin/env pwsh

Write-Host "🚀 Iniciando Backend FreeMarker (modo simple)" -ForegroundColor Green

# Verificar que estemos en la carpeta correcta
if (-not (Test-Path "src/app.js")) {
    Write-Host "❌ Error: No se encontró src/app.js" -ForegroundColor Red
    Write-Host "   Asegúrate de estar en la carpeta backend" -ForegroundColor Yellow
    exit 1
}

Write-Host "📂 Ubicación: $(Get-Location)" -ForegroundColor Blue
Write-Host "🔧 Ejecutando: node src/app.js" -ForegroundColor Yellow
Write-Host "📊 Puerto esperado: 5000" -ForegroundColor White
Write-Host "🌐 URL API: http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "💚 Health Check: http://localhost:5000/api/health" -ForegroundColor Cyan

Write-Host "`n⚡ Iniciando servidor..." -ForegroundColor Magenta

# Ejecutar directamente con node
node src/app.js
