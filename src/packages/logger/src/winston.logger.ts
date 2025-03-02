import { createLogger, format, transports } from "winston";
import { LOG_LEVELS, Logger } from "./definition";

export default class WinstonLogger implements Logger {
  readonly #logger: ReturnType<typeof createLogger>;

  constructor(
    private level: LOG_LEVELS,
    private prettyPrintEnabled: boolean,
    private destStream?: NodeJS.WritableStream | string
  ) {
    this.#logger = createLogger({
      level,
      transports: [
        new transports.Console({
          format: format.colorize(),
        }),
      ],
      format: prettyPrintEnabled
        ? format.combine(
            format.printf(
              (info) => `${info.level}: ${JSON.stringify(info.message)}`
            )
          )
        : undefined,
    });
  }

  debug(message: string, metadata?: object): void {
    if (metadata) {
      this.#logger.debug(message, metadata);
    } else {
      this.#logger.debug(message);
    }
  }

  error(message: string, metadata?: object): void {
    if (metadata) {
      this.#logger.error(message, metadata);
    } else {
      this.#logger.error(message);
    }
  }

  info(message: string, metadata?: object): void {
    if (metadata) {
      this.#logger.info(message, metadata);
    } else {
      this.#logger.info(message);
    }
  }

  warning(message: string, metadata?: object): void {
    if (metadata) {
      this.#logger.warn(message, metadata);
    } else {
      this.#logger.warn(message);
    }
  }
}
