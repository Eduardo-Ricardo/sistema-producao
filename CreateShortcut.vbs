Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = oWS.ExpandEnvironmentStrings("%USERPROFILE%") & "\Desktop\Sistema de Gestao.lnk"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = "c:\Users\User\OneDrive\Dev\sistema-gestao\IniciarServidor.bat"
oLink.IconLocation = "shell32.dll,22"
oLink.Description = "Sistema de Gestao"
oLink.WorkingDirectory = "c:\Users\User\OneDrive\Dev\sistema-gestao"
oLink.Save