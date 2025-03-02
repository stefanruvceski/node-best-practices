import { Static, Type } from "@sinclair/typebox";

export const taskSchema = Type.Object({
  title: Type.String(),
  description: Type.String(),
  status: Type.Number(),
  creator_id: Type.Number(),
  assignee_id: Type.Optional(Type.Number()),
});

export type addTaskDTO = Static<typeof taskSchema>;
