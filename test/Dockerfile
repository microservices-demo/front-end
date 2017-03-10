FROM node:4-alpine

RUN apk update && apk add make

RUN npm install -g phantomjs-prebuilt
RUN npm install -g casperjs

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
