export default {
  environment: process.env.NODE_ENV,
  serviceName: process.env.SERVICE_NAME,
  serviceVersion: process.env.SERVICE_VERSION,
  otlpEndpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  signozKey: process.env.SIGNOZ_INGESTION_KEY,
};
