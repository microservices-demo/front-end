var
  newrelic     = require('newrelic')
  , winston      = require('winston')
  , newrelicFormatter = require('@newrelic/winston-enricher')

module.exports = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.label({label: 'microservice'}),
    newrelicFormatter()
  ),
  defaultMeta: { service: 'ec2-micro-front-end' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: '/var/log/front/error.log', level: 'error' }),
    new winston.transports.File({ filename: '/var/log/front/combined.log' }),
  ],
});
