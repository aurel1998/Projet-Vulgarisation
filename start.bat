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
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

REM Lancer le serveur
npm run dev

pause



