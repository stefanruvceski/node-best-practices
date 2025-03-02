import { context } from "@monorepo/global-context";
import { LOG_LEVELS, Logger, LoggerConfiguration } from "./definition";
import PinoLogger from "./pino.logger";
import WinstonLogger from "./winston.logger";
import { getConfig } from "@monorepo/config";
export class LoggerWrapper implements Logger {
  #underlyingLogger: Logger | null = null;
  #config = getConfig("logger");

  #getInitializeLogger(): Logger {
    this.configureLogger(
      {
        level: this.#config.logLevel as LOG_LEVELS,
        loggerType: "pino",
        prettyPrint: this.#config.nodeEnv === "development",
      },
      false
    );
    return this.#underlyingLogger!;
  }

  configureLogger(
    configuration: Partial<LoggerConfiguration>,
    overrideIfExists = true
  ): void {
    if (this.#underlyingLogger === null || overrideIfExists === true) {
      if (configuration.loggerType === "pino") {
        this.#underlyingLogger = new PinoLogger(
          configuration.level || "info",
          configuration.prettyPrint || false
        );
      } else if (configuration.loggerType === "winston") {
        this.#underlyingLogger = new WinstonLogger(
          configuration.level || "info",
          configuration.prettyPrint || false
        );
      }
    }
  }

  resetLogger() {
    this.#underlyingLogger = null;
  }

  debug(message: string, metadata?: object): void {
    this.#getInitializeLogger().debug(
      message,
      LoggerWrapper.#insertContextIntoMetadata(metadata)
    );
  }

  error(message: string, metadata?: object): void {
    this.#getInitializeLogger().error(
      message,
      LoggerWrapper.#insertContextIntoMetadata(metadata)
    );
  }

  info(message: string, metadata?: object): void {
    this.#getInitializeLogger().info(
      message,
      LoggerWrapper.#insertContextIntoMetadata(metadata)
    );
  }

  warning(message: string, metadata?: object): void {
    this.#getInitializeLogger().warning(
      message,
      LoggerWrapper.#insertContextIntoMetadata(metadata)
    );
  }

  static #insertContextIntoMetadata(metadata?: object): object | undefined {
    const currentContext = context().getStore();

    if (currentContext === null || typeof currentContext !== "object") {
      return metadata;
    }

    if (metadata == null) {
      return currentContext;
    }

    return { ...currentContext, ...metadata };
  }
}

export const logger = new LoggerWrapper();
