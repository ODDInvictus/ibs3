# Het bouwen van IBS3 vereist een aantal stappen om te bouwen. Dit scriptje is gebeund in powershell want daar had ik zin in haha
# Ga waarschijnlijk in de toekomst spijt hebben van die beslissing maar goed, het werkt.

# Stap 1: Verzamel alle environment variabelen
$env:IBS3_ENV = "production"
$env:IBS3_PORT = "3000"

# Verkrijg de huidige git branch en stop het in een variabele
$env:PUBLIC_GIT_BRANCH    = git rev-parse --abbrev-ref HEAD
$env:PUBLIC_GIT_REV       = git rev-parse HEAD
$env:PUBLIC_GIT_REV_SHORT = git rev-parse --short HEAD

# Stap 2: Bouw de node server
npm run build