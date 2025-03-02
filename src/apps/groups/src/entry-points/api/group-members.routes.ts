import util from "util";
import express from "express";
import { logger } from "@monorepo/logger";
import * as groupMembersUseCase from "../../domain/group-members.usecase";

export default function defineRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.post("/", async (req, res, next) => {
    try {
      logger.info(
        `Group Members API was called to add new Group Member ${util.inspect(
          req.body
        )}`
      );
      // ✅ Best Practice: Using the 3-tier architecture, routes/controller are kept thin, logic is encapsulated in a dedicated domain folder
      const addGroupMemberResponse = await groupMembersUseCase.addGroupMember(
        req.body
      );
      return res.json(addGroupMemberResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });

  // get existing group member by id
  router.get("/:id", async (req, res, next) => {
    try {
      logger.info(
        `Group Members API was called to get group member by id ${req.params.id}`
      );
      const result = await groupMembersUseCase.getGroupMember(
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

  router.get("/", async (req, res, next) => {
    try {
      logger.info(`Group Members API was called to get all group members`);
      const result = await groupMembersUseCase.getAllGroupMembers();
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  // delete group member by id
  router.delete("/:id", async (req, res) => {
    logger.info(
      `Group Members API was called to delete group member ${req.params.id}`
    );
    await groupMembersUseCase.deleteGroupMember(parseInt(req.params.id, 10));
    return res.json({ message: "Group member deleted successfully" });
  });

  expressApp.use("/group-member", router);
}
