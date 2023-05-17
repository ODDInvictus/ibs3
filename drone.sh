#!/bin/sh

export PUBLIC_GIT_REV=$(echo $DRONE_COMMIT)
export PUBLIC_GIT_REV_SHORT=$(echo `expr $DRONE_COMMIT 0 7`)
export PUBLIC_GIT_BRANCH=$(echo $DRONE_BRANCH)