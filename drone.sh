#!/bin/sh

export PUBLIC_GIT_REV=$(echo $DRONE_COMMIT)
export PUBLIC_GIT_REV_SHORT=$(echo `expr $DRONE_COMMIT 0 7`)
export PUBLIC_GIT_BRANCH=$(echo $DRONE_BRANCH)
export PUBLIC_BUILD_NUMBER=$(echo $DRONE_BUILD_NUMBER)
export PUBLIC_BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
export PUBLIC_BUILD_LINK=$(echo $DRONE_BUILD_LINK)