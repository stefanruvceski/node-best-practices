import util from "util";
import express from "express";
import { logger } from "@monorepo/logger";
import * as groupUseCase from "../../domain/group.usecase";

export default function defineRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.post("/", async (req, res, next) => {
    try {
      logger.info(
        `Group API was called to add new Group ${util.inspect(req.body)}`
      );
      // ✅ Best Practice: Using the 3-tier architecture, routes/controller are kept thin, logic is encapsulated in a dedicated domain folder
      const addGroupResponse = await groupUseCase.addGroup(req.body);
      return res.json(addGroupResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });

  // get existing group by id
  router.get("/:id", async (req, res, next) => {
    try {
      logger.info(`Group API was called to get group by id ${req.params.id}`);
      const result = await groupUseCase.getGroup(parseInt(req.params.id, 10));

      if (!result) {
        res.status(404).end();
        return;
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get("/", async (req, res, next) => {
    try {
      logger.info(`Group API was called to get all groups`);
      const result = await groupUseCase.getAllGroups();
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  // delete group by id
  router.delete("/:id", async (req, res) => {
    logger.info(`Group API was called to delete group ${req.params.id}`);
    await groupUseCase.deleteGroup(parseInt(req.params.id, 10));
    return res.json({ message: "Group deleted successfully" });
  });

  expressApp.use("/group", router);
}
