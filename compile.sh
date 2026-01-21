#!/bin/bash

if [ -z ${1+x} ];
then
  echo "Gebruik: ./compile.sh v2.0.2 [push]"
  exit 1
fi

if [[ $1 != v* ]]
then
  echo "Versie moet beginnen met v, zoals v2.0.2"
  exit 1
fi

echo Bouwen voor versie $1
export NODE_ENV=production
export ENVIRONMENT=production
bun --bun install
bunx prisma generate
bun --bun run build

if [ $? -ne 0 ]; then
    echo 'Build gefaald, probeer opnieuw'
    exit 1
fi

echo
echo Docker container genereren
sudo docker build --file Dockerfile.frontend -t ghcr.io/oddinvictus/ibs3:$1 .
echo

if [ -z ${2+x} ];
then
  echo 
  echo Nu kan je pushen met
  echo docker push ghcr.io/oddinvictus/ibs3:$1
else
  echo "Backend bouwen"
  sudo docker build --file Dockerfile.backend -t ghcr.io/oddinvictus/ibs3:$1-backend .
  echo
  echo Pushen naar GitHub...
  sudo docker push ghcr.io/oddinvictus/ibs3:$1
  sudo docker push ghcr.io/oddinvictus/ibs3:$1-backend
fi

