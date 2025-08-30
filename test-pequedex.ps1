param(
  [string]$BaseUrl = "https://pequedex.onrender.com",
  [string]$FrontendApiFile = "primeiro-app/apiUrl.js"
)

$ErrorActionPreference = "Stop"

function Assert {
  param([bool]$Cond, [string]$Msg)
  if (-not $Cond) {
    Write-Host ("FAIL: " + $Msg)
    exit 1
  } else {
    Write-Host ("OK: " + $Msg)
  }
}

function IsNonEmptyString {
  param($x)
  if ($null -eq $x) { return $false }
  if ($x -is [string]) { return ($x.Trim().Length -gt 0) }
  return $false
}

Write-Host "=== Teste Pequedex API ==="
Write-Host ("BaseUrl: " + $BaseUrl)
Write-Host ""

# 0) Frontend aponta para sua API?
if (Test-Path $FrontendApiFile) {
  $apiJs = Get-Content $FrontendApiFile -Raw
  $pattern = [regex]::Escape($BaseUrl)
  Assert ($apiJs -match $pattern) ("Frontend aponta para a API (" + $BaseUrl + ") em " + $FrontendApiFile)
} else {
  Write-Host ("INFO: arquivo " + $FrontendApiFile + " não encontrado; pulando checagem do frontend.")
}

# 1) Health check com retry (Render free pode hibernar)
$healthUrl = $BaseUrl + "/api/pokemons/1"
$ok = $false
for ($i=1; $i -le 3 -and -not $ok; $i++) {
  try {
    Write-Host ("Tentativa " + $i + ": " + $healthUrl)
    $hc = Invoke-WebRequest $healthUrl -UseBasicParsing -TimeoutSec 90
    Assert (($hc.StatusCode -ge 200) -and ($hc.StatusCode -lt 300)) "API responde /api/pokemons/1"
    $ok = $true
  } catch {
    Write-Host ("Aviso: " + $_.Exception.Message)
    Start-Sleep -Seconds 15
  }
}
Assert $ok "API respondeu dentro das tentativas"

# 2) Criar Pokemon de teste (PNG + GIF)
$rand = Get-Random -Minimum 10000 -Maximum 99999
$name = "testmon-$rand"

$payload = @{
  name = $name
  types = @("normal")
  stats = @{
    hp=50; attack=55; defense=40; speed=60; specialAttack=0; specialDefense=0
  }
  height = 0.8
  weight = 12.3
  abilities = @("run-away")
  sprites = @{
    frontDefault = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
    animated     = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif"
  }
} | ConvertTo-Json -Depth 8

$created = Invoke-RestMethod -Method POST -Uri ($BaseUrl + "/api/pokemons") -ContentType "application/json" -Body $payload
$id = [int]$created.id

Assert ($id -gt 0) "Criou Pokemon id=$id"
Assert ($created.name -eq $name) "Nome salvo corretamente"
Assert ( IsNonEmptyString $created.sprites.frontDefault ) "Salvou sprites.frontDefault (PNG)"
Assert ( IsNonEmptyString $created.sprites.animated )     "Salvou sprites.animated (GIF)"

# 3) Listar
$list = Invoke-RestMethod ($BaseUrl + "/api/pokemons")
$listedCount = if ($list -is [System.Array]) { $list.Count } else { 1 }
Assert ($listedCount -gt 0) "Listou pokemons (>=1)"

# 4) Obter por ID
$one = Invoke-RestMethod ($BaseUrl + "/api/pokemons/$id")
Assert (($one.id -eq $id) -and ($one.name -eq $name)) "Obteve por ID"

# 5) Atualizar (trocar apenas o nome)
$updPayload = @{
  name = ($name + "-updated")
  types = $one.types
  stats = $one.stats
  height = $one.height
  weight = $one.weight
  abilities = $one.abilities
  sprites = $one.sprites
} | ConvertTo-Json -Depth 8

$upd = Invoke-RestMethod -Method PUT -Uri ($BaseUrl + "/api/pokemons/$id") -ContentType "application/json" -Body $updPayload
Assert ($upd.name -eq ($name + "-updated")) "Atualizou nome"

# 6) Deletar
$del = Invoke-RestMethod -Method DELETE -Uri ($BaseUrl + "/api/pokemons/$id")
Assert ($del.ok -eq $true) "Deletou registro"

# 7) Confirmar 404 apos deletar
try {
  $null = Invoke-RestMethod ($BaseUrl + "/api/pokemons/$id")
  Assert ($false) "Esperava 404 após deletar"
} catch {
  $resp = $_.Exception.Response
  if ($resp -and $resp.StatusCode) {
    $status = $resp.StatusCode.value__
    Assert ($status -eq 404) "Recebeu 404 após deletar"
  } else {
    throw
  }
}

Write-Host ""
Write-Host "Todos os testes passaram com sucesso."
exit 0
