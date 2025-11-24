# Script mejorado para completar el archivo .env con valores de Firebase
# Ejecuta: .\completar-env-v2.ps1

$ErrorActionPreference = "Stop"

try {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Completar archivo .env con Firebase" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Necesito los valores de tu configuracion de Firebase." -ForegroundColor Yellow
    Write-Host "Los encuentras en: Firebase Console -> Project settings -> Your apps -> Web app" -ForegroundColor Yellow
    Write-Host ""
    
    # Solicitar cada valor
    Write-Host "Ingresa los valores de Firebase (sin comillas):" -ForegroundColor Green
    Write-Host ""
    
    $apiKey = Read-Host "1. apiKey"
    $authDomain = Read-Host "2. authDomain"
    $projectId = Read-Host "3. projectId"
    $storageBucket = Read-Host "4. storageBucket"
    $messagingSenderId = Read-Host "5. messagingSenderId"
    $appId = Read-Host "6. appId"
    
    Write-Host ""
    Write-Host "Procesando..." -ForegroundColor Yellow
    
    # Crear contenido del archivo .env
    $lines = @(
        "# Variables de entorno para el frontend VolaBarato",
        "",
        "# ===========================================",
        "# FIREBASE CONFIGURATION",
        "# ===========================================",
        "VITE_FIREBASE_API_KEY=$apiKey",
        "VITE_FIREBASE_AUTH_DOMAIN=$authDomain",
        "VITE_FIREBASE_PROJECT_ID=$projectId",
        "VITE_FIREBASE_STORAGE_BUCKET=$storageBucket",
        "VITE_FIREBASE_MESSAGING_SENDER_ID=$messagingSenderId",
        "VITE_FIREBASE_APP_ID=$appId",
        "",
        "# ===========================================",
        "# API BACKEND CONFIGURATION",
        "# ===========================================",
        "# URL base del API Backend",
        "# Desarrollo local:",
        "VITE_API_BASE_URL=http://localhost:4000/api",
        "# Produccion (descomenta y actualiza cuando despliegues):",
        "# VITE_API_BASE_URL=https://backup-volabarato-1.onrender.com/api"
    )
    
    # Escribir el archivo
    $lines | Out-File -FilePath ".env" -Encoding UTF8
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Archivo .env actualizado exitosamente!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ubicacion: $PWD\.env" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "IMPORTANTE: Reinicia el servidor de desarrollo" -ForegroundColor Yellow
    Write-Host "Comando: npm run dev" -ForegroundColor Yellow
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Si el problema persiste, puedes editar el archivo .env manualmente:" -ForegroundColor Yellow
    Write-Host "notepad .env" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

