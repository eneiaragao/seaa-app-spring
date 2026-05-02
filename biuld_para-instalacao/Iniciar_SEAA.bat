@echo off
title Iniciando Sistema SEAA
echo Aguarde... O servidor esta ligando.
echo Nao feche esta janela enquanto estiver usando o sistema.

:: Navega ate a pasta correta do projeto
cd /d "C:\Users\User\Desktop\SEAA-app"

:: Inicia o navegador com o link do sistema (abre em 8 segundos para dar tempo do Java subir)
start /min cmd /c "timeout /t 8 >nul && start http://localhost:8080"

:: Executa o comando para ligar o Java usando o Maven Wrapper do projeto
call mvnw spring-boot:run

pause