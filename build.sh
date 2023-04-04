#! /bin/bash

# Stap 1: Verzamel alle environment variabelen
export ENV="production"
export PORT="3000"
export HOST="0.0.0.0"

# Verkrijg de huidige git branch en stop het in een variabele
export PUBLIC_GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
export PUBLIC_GIT_REV=$(git rev-parse HEAD)
export PUBLIC_GIT_REV_SHORT=$(git rev-parse --short HEAD)

# Stap 2: Bouw de node server
npm run build