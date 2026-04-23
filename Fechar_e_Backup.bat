@echo off
title Encerrando Sistema SEAA com Backup
echo Finalizando processos...

:: 1. Mata o processo do Java/Maven que estiver na porta 8080
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080') do taskkill /F /PID %%a 2>nul

echo.
echo Criando Backup dos dados atuais do CEF 02...
:: 2. Cria uma pasta de backup se nao existir
if not exist "C:\Backups_SEAA" mkdir "C:\Backups_SEAA"

:: 3. Copia o arquivo do banco de dados do NOVO LOCAL (pasta dados do projeto)
:: O comando abaixo pega o arquivo de dentro da pasta do projeto no Desktop
copy /y "C:\Users\User\Desktop\SEAA-app\dados\seaa_local.mv.db" "C:\Backups_SEAA\backup_seaa_%date:~-4%-%date:~3,2%-%date:~0,2%.db"

echo.
echo Sistema fechado e Backup salvo em C:\Backups_SEAA
echo Local do banco copiado: SEAA-app - Copia\dados\
echo.

pause