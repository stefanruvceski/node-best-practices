/* eslint-disable @typescript-eslint/no-non-null-assertion */
// eslint-disable-next-line import/no-extraneous-dependencies
import { PrismaClient, Prisma } from "@prisma/client";
import { getConfig } from "@monorepo/config";

let prismaClientInstance: PrismaClient | undefined;
const config = getConfig("DB");

export const connectionString = `postgresql://${config.userName}:${config.password}@${config.url}:${config.db_port}/${config.db_name}`;

// Postavi DATABASE_URL za Prisma klijent
process.env.DATABASE_URL = connectionString;

export function getPrismaClient(): PrismaClient {
  if (!prismaClientInstance) {
    prismaClientInstance = new PrismaClient({
      datasources: {
        db: {
          url: connectionString,
        },
      },
    });
  }

  return prismaClientInstance;
}

export { Prisma };
