@echo off
echo ========================================
echo   BUT Science des Donnees - Serveur Dev
echo ========================================
echo.

REM Vérifier si node_modules existe
if not exist "node_modules" (
    echo Installation des dependances...
    call npm install
    echo.
)

echo Demarrage du serveur de developpement...
echo.
echo Le site sera accessible sur: http://localhost:3000
echo.

REM Ouvrir le navigateur après 3 secondes
start /b timeout /t 3 /nobreak >nul && start http://localhost:3000

REM Lancer le serveur
npm run dev

pause



