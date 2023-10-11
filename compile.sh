#!/bin/bash

echo "Running build"
npm run build

echo "Generating dockerfile"
docker build -t ghcr.io/oddinvictus/ibs3:v2.0.2 -f new.Dockerfile .