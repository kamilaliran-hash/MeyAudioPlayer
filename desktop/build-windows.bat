@echo off
title Building MeyAudioPlayer for Windows
echo Requires Node.js 20 or newer (https://nodejs.org)
cd /d "%~dp0"
copy /y "..\app\index.html" "app\index.html" >nul
call npm install || goto :err
call npm run dist || goto :err
echo.
echo Done! Your files are in the "dist" folder:
echo   MeyAudioPlayer-Setup-1.0.0.exe   (installer)
echo   MeyAudioPlayer-1.0.0-portable.exe (single exe, no install)
start "" "%~dp0dist"
pause
exit /b 0
:err
echo Build failed - see messages above.
pause
exit /b 1
