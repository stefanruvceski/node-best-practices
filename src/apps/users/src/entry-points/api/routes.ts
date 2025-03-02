import util from "util";
import express from "express";
import { logger } from "@monorepo/logger";
import * as crateUserUseCase from "../../domain/crate-user-use-case";

export default function defineRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.post("/", async (req, res, next) => {
    try {
      logger.info(
        `User API was called to add new User ${util.inspect(req.body)}`
      );
      // ✅ Best Practice: Using the 3-tier architecture, routes/controller are kept thin, logic is encapsulated in a dedicated domain folder
      const addUserResponse = await crateUserUseCase.addUser(req.body);
      return res.json(addUserResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });

  // get existing user by id
  router.get("/:id", async (req, res, next) => {
    try {
      logger.info(`User API was called to get user by id ${req.params.id}`);
      const result = await crateUserUseCase.getUser(
        parseInt(req.params.id, 10)
      );

      if (!result) {
        res.status(404).end();
        return;
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  // delete user by id
  router.delete("/:id", async (req, res) => {
    logger.info(`User API was called to delete user ${req.params.id}`);
    await crateUserUseCase.deleteUser(parseInt(req.params.id, 10));
    return res.json({ message: "User deleted successfully" });
  });

  expressApp.use("/user", router);
}
