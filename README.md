[![Build Status](https://travis-ci.org/microservices-demo/front-end.svg?branch=master)](https://travis-ci.org/microservices-demo/front-end)

Front-end app
---
Front-end application written in [Node.js](https://nodejs.org/en/) that puts together all of the microservices under [microservices-demo](https://github.com/microservices-demo/microservices-demo).

## Development
### Dependencies
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Version</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://docker.com">Docker</a></td>
      <td>>= 1.12</td>
    </tr>
    <tr>
      <td><a href="https://docs.docker.com/compose/">Docker Compose</a></td>
      <td>>= 1.8.0</td>
    </tr>
    <tr>
      <td><a href="gnu.org/s/make">Make</a>&nbsp;(optional)</td>
      <td>>= 4.1</td>
    </tr>
  </tbody>
</table>

### Take it for a spin
If you want to try this out real quick on your laptop, go to the terminal and type
```
$ make up
```

This step brings all the services up using compose and the actual front-end application using Docker.
The application will become available on http://localhost:8080. Adjust to the virutal machine's IP if you
are using docker-machine or similar.

Once you're done with testing you can bring the whole thing down with
```
$ make down
```

### Getting started
**Before you start** make sure the rest of the microservices are up & running.

Install the application dependencies with:
```
$ make deps
```

### Testing
**Make sure that the microservices are up & running**

* Unit & Functional tests:

    ```
    make test
    ```

* End-to-End tests:
    To make sure that the test suite is running against the latest (local) version with your changes, you need to manually build
    the image, run the container and attach it to the proper Docker networks.
    There is a make task that will do all this for you:

    ```
    $ make dev
    ```

    That will also tail the logs of the container to make debugging easy.

    Then you can run the tests with:

    ```
    $ make e2e
    ```
