# Monta _site/ exatamente como o GitHub Pages vai montar e sobe um servidor local.
# Uso:  .\preview.ps1
# Depois abra http://127.0.0.1:8777
#
# Precisa ser servidor: aberto direto por file:// o support.js não carrega
# e a página aparece crua, com {{ ... }} no lugar do conteúdo.

$root = $PSScriptRoot
$site = Join-Path $root '_site'

if (Test-Path $site) { Remove-Item -Recurse -Force $site }
New-Item -ItemType Directory -Force -Path $site | Out-Null

Copy-Item (Join-Path $root 'project\ACTech Landing.dc.html') (Join-Path $site 'index.html')
Copy-Item (Join-Path $root 'project\support.js')             (Join-Path $site 'support.js')

Write-Host ''
Write-Host '  Landing em  http://127.0.0.1:8777' -ForegroundColor Green
Write-Host '  Ctrl+C para parar' -ForegroundColor DarkGray
Write-Host ''

# Entrar na pasta em vez de usar --directory: funciona em qualquer versão do Python.
Set-Location $site
python -m http.server 8777 --bind 127.0.0.1
