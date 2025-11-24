# Script interactivo para completar el archivo .env con valores de Firebase
# Ejecuta: .\completar-env.ps1

Write-Host ""
Write-Host "Completar archivo .env con valores de Firebase" -ForegroundColor Cyan
Write-Host ""
Write-Host "Necesito los valores de tu configuracion de Firebase." -ForegroundColor Yellow
Write-Host "Los encuentras en: Firebase Console -> Project settings -> Your apps -> Web app" -ForegroundColor Yellow
Write-Host ""

# Solicitar cada valor
$apiKey = Read-Host "Ingresa el apiKey (sin comillas)"
$authDomain = Read-Host "Ingresa el authDomain (sin comillas)"
$projectId = Read-Host "Ingresa el projectId (sin comillas)"
$storageBucket = Read-Host "Ingresa el storageBucket (sin comillas)"
$messagingSenderId = Read-Host "Ingresa el messagingSenderId (sin comillas)"
$appId = Read-Host "Ingresa el appId (sin comillas)"

# Crear contenido del archivo .env
$envContent = @"
# Variables de entorno para el frontend VolaBarato

# ===========================================
# FIREBASE CONFIGURATION
# ===========================================
VITE_FIREBASE_API_KEY=$apiKey
VITE_FIREBASE_AUTH_DOMAIN=$authDomain
VITE_FIREBASE_PROJECT_ID=$projectId
VITE_FIREBASE_STORAGE_BUCKET=$storageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID=$messagingSenderId
VITE_FIREBASE_APP_ID=$appId

# ===========================================
# API BACKEND CONFIGURATION
# ===========================================
# URL base del API Backend
# Desarrollo local:
VITE_API_BASE_URL=http://localhost:4000/api
# Produccion (descomenta y actualiza cuando despliegues):
# VITE_API_BASE_URL=https://backup-volabarato-1.onrender.com/api
"@

# Escribir el archivo
$envContent | Out-File -FilePath ".env" -Encoding ASCII

Write-Host ""
Write-Host "Archivo .env actualizado exitosamente!" -ForegroundColor Green
Write-Host "Ubicacion: $PWD\.env" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANTE: Reinicia el servidor de desarrollo (npm run dev)" -ForegroundColor Yellow
Write-Host ""
