FROM mhart/alpine-node:6.3
ENV NODE_ENV "production"
ENV PORT 8079
EXPOSE 8079

RUN mkdir -p /usr/src/app

# Prepare app directory
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

# Start the app
CMD ["npm", "start"]
