import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { resolve } from "path";

type EnvType = {
  [key: string]: string | undefined;
  SERVICE_NAME: string;
};

export function loadEnv(serviceName: string): EnvType {
  // Učitaj root .env
  const rootEnv = dotenv.config({
    path: resolve(process.cwd(), "../../../.env"),
  });
  dotenvExpand.expand(rootEnv);

  // Učitaj service-specific .env ako postoji
  const serviceEnv = dotenv.config({
    path: resolve(process.cwd(), ".env"),
    override: true,
  });
  dotenvExpand.expand(serviceEnv);

  return {
    ...process.env,
    SERVICE_NAME: serviceName,
  };
}

export type Config = {
  port: number;
  nodeEnv: string;
  logLevel: string;
  userName: string;
  password: string;
  url: string;
  db_port: number;
  db_name: string;
  auth_secret: string;
  [key: string]: any;
};

export function getConfig(serviceName: string): Config {
  const env = loadEnv(serviceName) as EnvType;
  return {
    port: parseInt(env[`${serviceName.toUpperCase()}_PORT`] || "3000", 10),
    userName: env.DB_USER_NAME || "",
    password: env.DB_PASSWORD || "",
    url: env.DB_URL || "",
    db_name: env.DB_NAME || "",
    db_port: parseInt(env.DB_PORT || "5432", 10),
    nodeEnv: env.NODE_ENV || "development",
    logLevel: env.LOG_LEVEL || "info",
    auth_secret: env.AUTH_SECRET || "test",
  };
}
