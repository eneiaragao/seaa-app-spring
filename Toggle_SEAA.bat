@echo off
set PORT=8080

cd /d %~dp0

:: Verifica se a porta está em uso
netstat -ano | findstr :%PORT% > nul

if %errorlevel% equ 0 (
    echo [STATUS] SEAA-APP detectado. Desligando...

    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%PORT%') do (
        taskkill /F /PID %%a
    )

    echo [OK] Sistema encerrado.
    timeout /t 3 > nul

) else (

    echo [STATUS] Iniciando SEAA-APP...

    start "" java\bin\javaw.exe -jar seaa-app-0.0.1-SNAPSHOT.jar

    echo [AGUARDE] O sistema esta iniciando...
    timeout /t 15 /nobreak > nul

    start http://localhost:8080

    echo [OK] Sistema iniciado!
)