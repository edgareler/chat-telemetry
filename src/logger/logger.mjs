import logsAPI from '@opentelemetry/api-logs';
import {
  LoggerProvider,
  SimpleLogRecordProcessor,
} from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OpenTelemetryTransportV3 } from '@opentelemetry/winston-transport';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { ATTR_DEPLOYMENT_ENVIRONMENT_NAME } from '@opentelemetry/semantic-conventions/incubating';
import winston from 'winston';
import {
  environment,
  serviceName,
  serviceVersion,
  signozKey,
  otlpEndpoint,
} from '../config.mjs';

const otlpExplorer = new OTLPLogExporter({
  url: otlpEndpoint,
  headers: {
    'signoz-access-token': signozKey,
  },
});

const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: serviceName,
    [ATTR_SERVICE_VERSION]: serviceVersion,
    [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]: environment,
  }),
  processors: [new SimpleLogRecordProcessor(otlpExplorer)],
});

logsAPI.logs.setGlobalLoggerProvider(loggerProvider);

export const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({
      stack: true,
    }),
    winston.format.metadata(),
    winston.format.json()
  ),
  defaultMeta: {
    service: serviceName,
    environment,
  },
  transports: [
    new OpenTelemetryTransportV3({
      loggerProvider,
      logAttributes: {
        [ATTR_SERVICE_NAME]: serviceName,
        [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]: environment,
      },
    }),
  ],
});
