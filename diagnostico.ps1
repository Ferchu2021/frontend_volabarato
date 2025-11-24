# Script de diagnóstico para problemas de carga
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DIAGNOSTICO DE VOLABARATO FRONTEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar archivo .env
Write-Host "1. Verificando archivo .env..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   ✅ Archivo .env existe" -ForegroundColor Green
    $envContent = Get-Content .env
    $hasApiKey = $envContent | Select-String "VITE_FIREBASE_API_KEY=" | Select-String -NotMatch "REEMPLAZA"
    if ($hasApiKey) {
        Write-Host "   ✅ VITE_FIREBASE_API_KEY configurado" -ForegroundColor Green
    } else {
        Write-Host "   ❌ VITE_FIREBASE_API_KEY no configurado" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ Archivo .env NO existe" -ForegroundColor Red
}

Write-Host ""

# Verificar Firebase instalado
Write-Host "2. Verificando Firebase..." -ForegroundColor Yellow
if (Test-Path "node_modules\firebase") {
    Write-Host "   ✅ Firebase instalado" -ForegroundColor Green
} else {
    Write-Host "   ❌ Firebase NO instalado" -ForegroundColor Red
    Write-Host "   Ejecuta: npm install firebase" -ForegroundColor Yellow
}

Write-Host ""

# Verificar archivos de configuración
Write-Host "3. Verificando archivos de configuración..." -ForegroundColor Yellow
if (Test-Path "src\config\firebase.ts") {
    Write-Host "   ✅ firebase.ts existe" -ForegroundColor Green
} else {
    Write-Host "   ❌ firebase.ts NO existe" -ForegroundColor Red
}

if (Test-Path "src\services\firebaseStorage.ts") {
    Write-Host "   ✅ firebaseStorage.ts existe" -ForegroundColor Green
} else {
    Write-Host "   ❌ firebaseStorage.ts NO existe" -ForegroundColor Red
}

Write-Host ""

# Verificar node_modules
Write-Host "4. Verificando node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   ✅ node_modules existe" -ForegroundColor Green
} else {
    Write-Host "   ❌ node_modules NO existe" -ForegroundColor Red
    Write-Host "   Ejecuta: npm install" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "INSTRUCCIONES:" -ForegroundColor Yellow
Write-Host "1. Asegurate de que el servidor esté corriendo: npm run dev" -ForegroundColor White
Write-Host "2. Abre el navegador en: http://localhost:3000" -ForegroundColor White
Write-Host "3. Abre la consola del navegador (F12) y revisa errores" -ForegroundColor White
Write-Host "4. Si hay errores, compártelos para ayudarte" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

