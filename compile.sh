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
npm run build

if [ $? -ne 0 ]; then
    echo 'Build gefaald, probeer opnieuw'
    exit 1
fi

echo
echo Docker container genereren
sudo docker build -t ghcr.io/oddinvictus/ibs3:$1 .

if [ -z ${2+x} ];
then
  echo 
  echo Nu kan je pushen met
  echo docker push ghcr.io/oddinvictus/ibs3:$1
else
  echo
  echo Pushen naar GitHub...
  sudo docker push ghcr.io/oddinvictus/ibs3:$1
fi