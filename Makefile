include $(shell curl --silent -o .build-harness "https://raw.githubusercontent.com/cloudposse/build-harness/master/templates/Makefile.build-harness"; echo .build-harness)

CHART_NAME ?= frontend

IMAGE=front-end

.PHONY: test coverage

up: compose test-image deps server

down: kill-server kill-compose

dev: clean test-image server

# Brings the backend services up using Docker Compose
compose:
	@docker-compose -f test/docker-compose.yml up -d

# Installs Node.js project dependencies
deps:
	@docker run               \
		-it                     \
		--rm                    \
		-v $$PWD:/usr/src/app   \
		$(IMAGE) /usr/local/bin/npm install

# Runs the Node.js application in a Docker container
server:
	@docker run               \
		-d                      \
		--name $(IMAGE)     \
		-v $$PWD:/usr/src/app   \
		-P                      \
		-e NODE_ENV=development \
		-e PORT=8080            \
		-p 8080:8080            \
		--network test_default  \
		$(IMAGE) /usr/local/bin/npm start

# Runs unit tests in Docker
test: test-image
	@docker run              \
		--rm                   \
		-it                    \
		-v $$PWD:/usr/src/app  \
		$(IMAGE) /usr/local/bin/npm test

# Runs integration tests in Docker
e2e: test-image
	@docker run              \
		--rm                   \
		-it                    \
		--network test_default \
		-v $$PWD:/usr/src/app  \
		$(IMAGE) /usr/src/app/test/e2e/runner.sh

kill-compose:
	@docker-compose -f test/docker-compose.yml down

kill-server:
	@if [ $$(docker ps -a -q -f name=$(IMAGE) | wc -l) -ge 1 ]; then docker rm -f $(IMAGE); fi
