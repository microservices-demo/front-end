COMMIT_SHA=$(git log -1 --format="%H")
IMAGENAME=nvhoanganh1909/sock-shop-frontend:winstonlogger

echo "Updating front-end to use image $IMAGENAME with GIT SHA $COMMIT_SHA"

kubectl set env deployment/front-end NEW_RELIC_METADATA_COMMIT=$COMMIT_SHA --namespace=sock-shop
kubectl set image deployment/front-end front-end=$IMAGENAME --namespace=sock-shop