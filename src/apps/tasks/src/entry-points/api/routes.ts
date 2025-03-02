import util from "util";
import express from "express";
import { logger } from "@monorepo/logger";
import * as crateTaskUseCase from "../../domain/task-use-case";

export default function defineRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.post("/", async (req, res, next) => {
    try {
      logger.info(
        `Task API was called to add new Task ${util.inspect(req.body)}`
      );
      // ✅ Best Practice: Using the 3-tier architecture, routes/controller are kept thin, logic is encapsulated in a dedicated domain folder
      const addTaskResponse = await crateTaskUseCase.addTask(req.body);
      return res.json(addTaskResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });

  // get existing user by id
  router.get("/:id", async (req, res, next) => {
    try {
      logger.info(`Task API was called to get task by id ${req.params.id}`);
      const result = await crateTaskUseCase.getTask(
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
      logger.info(`Task API was called to get all tasks`);
      const result = await crateTaskUseCase.getAllTasks();
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  // delete user by id
  router.delete("/:id", async (req, res) => {
    logger.info(`Task API was called to delete task ${req.params.id}`);
    await crateTaskUseCase.deleteTask(parseInt(req.params.id, 10));
    return res.json({ message: "Task deleted successfully" });
  });

  expressApp.use("/task", router);
}
