const opentelemetry = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/node');
module.exports = (serviceName) => {
  const provider = new NodeTracerProvider({
    plugins: {
      http: {
        enabled: true,
        path: '@opentelemetry/plugin-http',
        requestHook: (span, request) => {
          console.log(span)
          span.setAttribute("custom request hook attribute", "request");
        },
      },
      express: {
        enabled: true,
        path: '@opentelemetry/plugin-express',
      },
    }
  });
  provider.register();
  return opentelemetry.trace.getTracer("testTrace");
};