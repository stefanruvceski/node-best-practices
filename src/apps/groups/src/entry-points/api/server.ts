import { Server } from "http";
import { logger } from "@monorepo/logger";
import { AddressInfo } from "net";
import express from "express";
import helmet from "helmet";
import { errorHandler } from "@monorepo/error-handling";
import { getConfig } from "@monorepo/config";
import {
  authVerifierMiddleware,
  addRequestId,
} from "@monorepo/common-middlewares";
import defineGroupRoutes from "./group.routes";
import defineGroupMembersRoutes from "./group-members.routes";
let connection: Server;
const config = getConfig("groups");
// ️️️✅ Best Practice: API exposes a start/stop function to allow testing control WHEN this should happen
async function startWebServer(): Promise<AddressInfo> {
  // ️️️✅ Best Practice: Declare a strict configuration schema and fail fast if the configuration is invalid
  logger.configureLogger(
    {
      prettyPrint: Boolean(config.nodeEnv === "development"),
    },
    true
  );
  const expressApp = express();
  defineCommonMiddlewares(expressApp);
  defineGroupRoutes(expressApp);
  defineGroupMembersRoutes(expressApp);
  defineErrorHandlingMiddleware(expressApp);
  const APIAddress = await openConnection(expressApp);
  return APIAddress;
}

async function stopWebServer() {
  return new Promise<void>((resolve) => {
    if (connection !== undefined) {
      connection.close(() => {
        resolve();
      });
    }
  });
}

function defineCommonMiddlewares(expressApp: express.Application) {
  const authMiddleware = authVerifierMiddleware({
    secret: config.auth_secret,
  });
  expressApp.use(addRequestId);
  expressApp.use(helmet());
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(express.json());
  // expressApp.use(authMiddleware);
}

async function openConnection(
  expressApp: express.Application
): Promise<AddressInfo> {
  return new Promise((resolve) => {
    // ️️️✅ Best Practice: Allow a dynamic port (port 0 = ephemeral) so multiple webservers can be used in multi-process testing
    const portToListenTo = config.port;
    const webServerPort = portToListenTo || 0;
    logger.info(`Server is about to listen to port ${webServerPort}`);
    connection = expressApp.listen(webServerPort, () => {
      errorHandler.listenToErrorEvents(connection);
      resolve(connection.address() as AddressInfo);
    });
  });
}

function defineErrorHandlingMiddleware(expressApp: express.Application) {
  expressApp.use(
    async (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: any,
      req: express.Request,
      res: express.Response,
      // Express requires next function in default error handlers
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      next: express.NextFunction
    ) => {
      if (error && typeof error === "object") {
        if (
          error.isCatastrophic === undefined ||
          error.isCatastrophic === null
        ) {
          error.isCatastrophic = true; // Error during a specific request is usually not fatal and should not lead to process exit
        }
      }
      // ✅ Best Practice: Pass all error to a centralized error handler so they get treated equally
      errorHandler.handleError(error);
      res.status(error?.HTTPStatus || 500).json({
        message: error?.message || "Internal Server Error",
      });
    }
  );
}

export { startWebServer, stopWebServer };
