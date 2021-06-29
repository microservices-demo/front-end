FROM node:10-alpine
ENV NODE_ENV "production"
ENV PORT 8079
EXPOSE 8079
RUN addgroup mygroup && adduser -D -G mygroup myuser && mkdir -p /usr/src/app && chown -R myuser /usr/src/app

# Prepare app directory
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN chown myuser /usr/src/app/yarn.lock

USER myuser
RUN yarn install
RUN cp /usr/src/app/node_modules/newrelic/newrelic.js /usr/src/app

COPY . /usr/src/app
RUN mkdir public; cp -r public_src/* public;
RUN node newrelic_setup.js

# Start the app
CMD ["/usr/local/bin/npm", "start"]
