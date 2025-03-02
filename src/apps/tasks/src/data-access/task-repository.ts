import { getPrismaClient } from "@monorepo/database";
import { addTaskDTO } from "../domain/task-schema";

type TaskRecord = {
  id: number;
  title: string;
  description: string | null;
  status: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  creator_id: number;
  assignee_id: number | null;
};

export async function getAllTasks(): Promise<TaskRecord[]> {
  return getPrismaClient().task.findMany();
}

export async function addTask(newTask: addTaskDTO) {
  const results = getPrismaClient().task.create({
    data: {
      ...newTask,
      status: newTask.status,
    },
  });

  return results;
}

export async function deleteTask(taskId: number) {
  const results = getPrismaClient().task.delete({
    where: { id: taskId },
  });

  return results;
}

export async function getTaskById(taskId: number) {
  const results = getPrismaClient().task.findUnique({
    where: { id: taskId },
  });

  return results;
}

export async function getTaskByCreatorId(creatorId: number) {
  return await getPrismaClient().task.findMany({
    where: { creator_id: creatorId },
  });
}
