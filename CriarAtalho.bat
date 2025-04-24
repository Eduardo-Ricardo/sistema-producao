@echo off
echo Criando atalho na area de trabalho...

REM Cria um script VBS temporario
echo Set oWS = WScript.CreateObject("WScript.Shell") > criar_atalho.vbs
echo sLinkFile = "%USERPROFILE%\Desktop\Sistema de Gestao.lnk" >> criar_atalho.vbs
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> criar_atalho.vbs
echo oLink.TargetPath = "%~dp0IniciarServidor.bat" >> criar_atalho.vbs
echo oLink.WorkingDirectory = "%~dp0" >> criar_atalho.vbs
echo oLink.IconLocation = "shell32.dll,22" >> criar_atalho.vbs
echo oLink.Description = "Sistema de Gestao" >> criar_atalho.vbs
echo oLink.Save >> criar_atalho.vbs

REM Executa o script VBS e depois remove
cscript //nologo criar_atalho.vbs
del criar_atalho.vbs

echo Atalho criado com sucesso!
pause