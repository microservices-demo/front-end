#!/usr/bin/env bash

set -ev

if [[ -z "$GROUP" ]] ; then
  echo "Cannot find GROUP env var"
  exit 1
fi

if [[ -z "$COMMIT" ]] ; then
  echo "Cannot find COMMIT env var"
  exit 1
fi

if [[ "$(uname)" == "Darwin" ]]; then
  DOCKER_CMD=docker
else
  DOCKER_CMD="sudo docker"
fi

# Issues a "docker push" command, forwarding all arguments to said command
push() {
  DOCKER_PUSH=1;
  while [ $DOCKER_PUSH -gt 0 ] ; do
    echo "Pushing $1";
    $DOCKER_CMD push $1;
    DOCKER_PUSH=$(echo $?);
    if [[ "$DOCKER_PUSH" -gt 0 ]] ; then
      echo "Docker push failed with exit code $DOCKER_PUSH";
    fi;
  done;
}

# Tags the Docker image and pushes it to Docker Hub
tag_and_push_all() {
  # Fail if no tag has been provided
  if [[ -z "$1" ]] ; then
    echo "Please pass the tag"
    exit 1
  else
    TAG=$1
  fi

  REPO=${GROUP}/$(basename front-end)
  if [[ "$COMMIT" != "$TAG" ]]; then
    $DOCKER_CMD tag ${REPO}:${COMMIT} ${REPO}:${TAG}
  fi
  push "$REPO:$TAG";
}

# Always push commit
tag_and_push_all $COMMIT

# Push snapshot when in master
if [ "$TRAVIS_BRANCH" == "master" ]; then
  tag_and_push_all snapshot
fi;

# Push tag and latest when tagged
if [ -n "$TRAVIS_TAG" ]; then
  tag_and_push_all ${TRAVIS_TAG}
  tag_and_push_all latest
fi;
