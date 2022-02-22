COMMIT_SHA=$(git log -1 --format="%H")
IMAGENAME=nvhoanganh1909/sock-shop-frontend:$1

echo "Building image $IMAGENAME"
docker buildx build --platform linux/amd64 . -t $IMAGENAME --progress=plain

echo "Pushing $IMAGENAME to dockerhub"
docker push $IMAGENAME

echo "Updating front-end to use image $IMAGENAME with GIT SHA $COMMIT_SHA"
kubectl set env deployment/front-end NEW_RELIC_METADATA_COMMIT=$COMMIT_SHA --namespace=sock-shop
kubectl set image deployment/front-end front-end=$IMAGENAME --namespace=sock-shop

echo "watching pods deployment/front-end"
kubectl get pods --watch