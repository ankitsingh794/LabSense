import { addColors, format as _format, createLogger, transports as _transports } from 'winston';
import { join } from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'cyan',
};

addColors(logColors);

const isDevelopment = process.env.NODE_ENV === 'development';

// Define different formats for development (readable) and production (JSON)
const format = _format.combine(
  _format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  isDevelopment ? _format.colorize({ all: true }) : _format.uncolorize(),
  _format.splat(),
  _format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
);

const prodJsonFormat = _format.combine(
  _format.timestamp(),
  _format.json()
);

const logger = createLogger({
  level: isDevelopment ? 'debug' : 'info',
  levels: logLevels,
  format: prodJsonFormat, 
  transports: [
    new DailyRotateFile({
      filename: join('logs', 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, 
      maxSize: '20m',      
      maxFiles: '14d',     
    }),
    new DailyRotateFile({
      level: 'error',
      filename: join('logs', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
  exceptionHandlers: [
    new DailyRotateFile({ filename: join('logs', 'exceptions.log') }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({ filename: join('logs', 'rejections.log') }),
  ],
  exitOnError: false, 
});

logger.add(new _transports.Console({
  format: isDevelopment ? format : _format.simple(),
  handleExceptions: true,
}));

export default logger;