#!/usr/bin/env pwsh

Write-Host "🚀 Iniciando servidores FreeMarker Documentation..." -ForegroundColor Green

# Cambiar al directorio del proyecto
$projectPath = "c:\Users\Oconer\Desktop\Liferay"
Set-Location $projectPath

Write-Host "📂 Directorio del proyecto: $projectPath" -ForegroundColor Blue

# Verificar que existan los directorios necesarios
if (-not (Test-Path "backend")) {
    Write-Host "❌ Error: No se encontró la carpeta 'backend'" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "frontend-new")) {
    Write-Host "❌ Error: No se encontró la carpeta 'frontend-new'" -ForegroundColor Red
    exit 1
}

Write-Host "🔧 Iniciando Backend (Puerto 5000)..." -ForegroundColor Yellow
Start-Process -NoNewWindow -FilePath "powershell" -ArgumentList "-Command", "cd '$projectPath\backend'; npm start"

Write-Host "🌐 Iniciando Frontend (Puerto 3000)..." -ForegroundColor Yellow  
Start-Process -NoNewWindow -FilePath "powershell" -ArgumentList "-Command", "cd '$projectPath\frontend-new'; npm start"

Write-Host "✅ Servidores iniciados!" -ForegroundColor Green
Write-Host "📊 Backend API: http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📋 Health Check: http://localhost:5000/api/health" -ForegroundColor Cyan

Write-Host "`n⏳ Esperando 3 segundos para que los servidores se inicien..." -ForegroundColor Blue
Start-Sleep -Seconds 3

Write-Host "🔍 Verificando estado de los servidores..." -ForegroundColor Blue

try {
    $backendHealth = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get -TimeoutSec 5
    Write-Host "✅ Backend: OK - $($backendHealth.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend: No responde" -ForegroundColor Red
}

try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -Method Get -TimeoutSec 5
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend: OK - Código de estado 200" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend: No responde" -ForegroundColor Red
}

Write-Host "`n🎯 Para probar la aplicación:" -ForegroundColor Magenta
Write-Host "   • Abrir: http://localhost:3000" -ForegroundColor White
Write-Host "   • Ir a: Ejemplos -> http://localhost:3000/ejemplos" -ForegroundColor White

pause
