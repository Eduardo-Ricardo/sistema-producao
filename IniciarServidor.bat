@echo off
echo Iniciando o Sistema de Gestao...
cd /d "%~dp0common"

REM Inicia o servidor Node.js
start "Servidor do Sistema de Gestao" cmd /k "node app.js"

REM Espera 3 segundos para o servidor inicializar
timeout /t 3 /nobreak > nul

REM Abre o navegador
start http://localhost:3000

exit