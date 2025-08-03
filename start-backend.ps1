#!/usr/bin/env pwsh

Write-Host "🔧 Iniciando solo el Backend..." -ForegroundColor Yellow

$backendPath = "c:\Users\Oconer\Desktop\Liferay\backend"
Set-Location $backendPath

Write-Host "📂 Directorio backend: $backendPath" -ForegroundColor Blue
Write-Host "🚀 Ejecutando: npm start" -ForegroundColor Green

npm start
