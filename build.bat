@echo off
echo ========================================
echo   Build du projet pour production
echo ========================================
echo.

REM Vérifier si node_modules existe
if not exist "node_modules" (
    echo Installation des dependances...
    call npm install
    echo.
)

echo Construction du site statique...
echo.

REM Lancer le build
call npm run build

echo.
echo ========================================
echo   Build termine !
echo ========================================
echo Les fichiers statiques sont dans le dossier 'out'
echo.
pause



