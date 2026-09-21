<#
.SYNOPSIS
  Publica a landing da ACTech. Teste primeiro, oficial depois.

.DESCRIPTION
  O repositorio tem dois remotes:
    origin   -> AmonTimo7/AmonTimo7.github.io  (teste, amontimo7.github.io)
    oficial  -> perfil oficial da ACTech        (producao)

  Sem parametro, publica so no teste. Com -Oficial, publica nos dois:
  primeiro o teste, depois a producao, e pede confirmacao antes da producao.

.EXAMPLE
  .\publicar.ps1
  .\publicar.ps1 -Oficial
#>
param(
  [switch]$Oficial
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# Nao publicar por engano o que ainda esta na bancada.
$pendente = git status --porcelain
if ($pendente) {
  Write-Host "Ha alteracoes nao commitadas:" -ForegroundColor Yellow
  Write-Host $pendente
  Write-Host "Commite antes de publicar." -ForegroundColor Yellow
  exit 1
}

Write-Host "Enviando pro teste (AmonTimo7)..." -ForegroundColor Cyan
git push origin main
if (-not $?) { exit 1 }
Write-Host "Teste no ar em alguns minutos: https://amontimo7.github.io" -ForegroundColor Green

if (-not $Oficial) {
  Write-Host "Confira o teste. Para publicar na producao: .\publicar.ps1 -Oficial"
  exit 0
}

$temOficial = git remote | Where-Object { $_ -eq "oficial" }
if (-not $temOficial) {
  Write-Host "O remote 'oficial' ainda nao existe neste repositorio." -ForegroundColor Red
  exit 1
}

$resposta = Read-Host "Conferiu o teste? Publicar na PRODUCAO agora? (s/N)"
if ($resposta -ne "s") {
  Write-Host "Cancelado. Nada foi enviado pra producao."
  exit 0
}

Write-Host "Enviando pra producao..." -ForegroundColor Cyan
git push oficial main
if (-not $?) { exit 1 }
Write-Host "Producao publicada." -ForegroundColor Green
