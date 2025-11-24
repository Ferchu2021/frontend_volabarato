# Script para crear el archivo .env
# Ejecuta este script en PowerShell: .\crear-env.ps1

$envContent = @"
# Variables de entorno para el frontend VolaBarato

# ===========================================
# FIREBASE CONFIGURATION
# ===========================================
# IMPORTANTE: Reemplaza estos valores con los de tu proyecto Firebase
# Los obtienes en: Firebase Console → ⚙️ → Project settings → Your apps → Web app

VITE_FIREBASE_API_KEY=REEMPLAZA_CON_TU_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=REEMPLAZA_CON_TU_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=REEMPLAZA_CON_TU_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=REEMPLAZA_CON_TU_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=REEMPLAZA_CON_TU_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=REEMPLAZA_CON_TU_APP_ID

# ===========================================
# API BACKEND CONFIGURATION
# ===========================================
# URL base del API Backend
# Desarrollo local:
VITE_API_BASE_URL=http://localhost:4000/api
# Producción (descomenta y actualiza cuando despliegues):
# VITE_API_BASE_URL=https://backup-volabarato-1.onrender.com/api
"@

# Crear el archivo .env
$envContent | Out-File -FilePath ".env" -Encoding utf8 -NoNewline

Write-Host "✅ Archivo .env creado exitosamente!" -ForegroundColor Green
Write-Host "`nUbicación: $PWD\.env" -ForegroundColor Cyan
Write-Host "`n⚠️ IMPORTANTE: Edita el archivo .env y reemplaza los valores de Firebase" -ForegroundColor Yellow
Write-Host "   Puedes abrirlo con: notepad .env" -ForegroundColor Yellow

