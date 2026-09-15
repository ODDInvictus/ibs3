if (-not $args[0]) {
    Write-Host "Gebruik: .\compile.ps1 v2.0.2 [push]"
    exit 1
}

$version = $args[0]

if ($version -notlike "v*") {
    Write-Host "Versie moet beginnen met v, zoals v2.0.2"
    exit 1
}

Write-Host "Bouwen voor versie $version"

$env:NODE_ENV = "production"
$env:ENVIRONMENT = "production"

bun --bun install

if ($LASTEXITCODE -ne 0) {
    Write-Host "Installatie gefaald, probeer opnieuw"
    exit 1
}

bunx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "Prisma generate gefaald, probeer opnieuw"
    exit 1
}

bun --bun run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build gefaald, probeer opnieuw"
    exit 1
}

Write-Host ""
Write-Host "Docker container genereren"

docker build --file Dockerfile.frontend -t "ghcr.io/oddinvictus/ibs3:$version" .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build gefaald, probeer opnieuw"
    exit 1
}

Write-Host ""

if (-not $args[1]) {
    Write-Host ""
    Write-Host "Nu kan je pushen met:"
    Write-Host "docker push ghcr.io/oddinvictus/ibs3:$version"
}
else {
    Write-Host "Pushen naar GitHub..."

    docker push "ghcr.io/oddinvictus/ibs3:$version"

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker push gefaald, probeer opnieuw"
        exit 1
    }
}