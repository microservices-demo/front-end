#!/usr/bin/env bash

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

PASS=1
REPO=${GROUP}/$(basename front-end);

CID=$($DOCKER_CMD run -d --name testcontainer -p 8080:8079 ${REPO}:${COMMIT})

for i in 1 2 3 4 5
do
  curl -s --head http://localhost:8080/ > /dev/null
  if [ $? -eq "0" ]
  then
    PASS=0
    break
  else
    sleep 1
  fi
done

$DOCKER_CMD rm -f $CID > /dev/null

if [ $PASS -eq "0" ]
then
  echo "container tests passed"
else
  echo "container tests failed"
fi

exit $PASS
