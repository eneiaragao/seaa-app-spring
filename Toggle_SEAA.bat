@echo off
set PORT=8080
set PROJECT_DIR="C:\Users\User\Desktop\SEAA-app"

:: Verifica se a porta 8080 está em uso
netstat -ano | findstr :%PORT% > nul

if %errorlevel% equ 0 (
    echo [STATUS] SEAA-APP detectado. Desligando...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%PORT%') do taskkill /F /PID %%a
    echo [OK] Sistema encerrado.
    timeout /t 3
) else (
    echo [STATUS] Iniciando SEAA-APP...
    cd /d %PROJECT_DIR%
    
    :: Inicia o Spring Boot em uma nova janela
    start "SPRING BOOT - SEAA" cmd /k "mvn spring-boot:run"
    
    echo [AGUARDE] O sistema esta subindo...
    echo [INFO] O navegador abrira em 15 segundos.
    
    :: Espera o Spring Boot carregar (ajuste o tempo se seu PC for mais rápido/lento)
    timeout /t 15 /nobreak > nul
    
    :: Abre o seu navegador padrão no endereço do sistema
    start http://localhost:8080 
    
    echo [OK] Navegador aberto!
    timeout /t 8
)