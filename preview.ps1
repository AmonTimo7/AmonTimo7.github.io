# Sobe a pasta do site num servidor local, do mesmo jeito que o GitHub Pages serve.
# Uso:  .\preview.ps1
# Depois abra http://127.0.0.1:8777
#
# Precisa ser servidor: aberto direto por file:// o support.js não carrega
# e a página aparece crua, com {{ ... }} no lugar do conteúdo.

Set-Location $PSScriptRoot

Write-Host ''
Write-Host '  Landing em  http://127.0.0.1:8777' -ForegroundColor Green
Write-Host '  Ctrl+C para parar' -ForegroundColor DarkGray
Write-Host ''

python -m http.server 8777 --bind 127.0.0.1
