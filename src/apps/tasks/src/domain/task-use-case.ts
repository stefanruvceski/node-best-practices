import { assertNewTaskIsValid } from "./task-validators";
import { addTaskDTO } from "./task-schema";
import * as userRepository from "../data-access/task-repository";
import { AppError } from "@monorepo/error-handling";
import { logger } from "@monorepo/logger";

// ️️️✅ Best Practice: Start a flow with a 'use case' function that summarizes the flow in high-level
// It should merely tell the feature story without too much information. Kind of a 'yellow pages' of the module
export async function addTask(newTask: addTaskDTO) {
  assertNewTaskIsValid(newTask);

  return await userRepository.addTask(newTask);
}

export async function deleteTask(taskId: number) {
  return await userRepository.deleteTask(taskId);
}

export async function getTask(taskId: number) {
  return await userRepository.getTaskById(taskId);
}

export async function getTaskByCreatorId(creatorId: number) {
  return await userRepository.getTaskByCreatorId(creatorId);
}

export async function getAllTasks() {
  const response = await userRepository.getAllTasks();
  return response;
}
