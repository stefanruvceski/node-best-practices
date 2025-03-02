import { AppError } from "@monorepo/error-handling";
import ajv, { ValidateFunction } from "@monorepo/validation";
import { taskSchema, addTaskDTO } from "./task-schema";

export function assertNewTaskIsValid(newTaskRequest: addTaskDTO) {
  // Since compiling a validation schema is expensive, we always try to use the cached version first
  let validationSchema!: ValidateFunction<addTaskDTO> | undefined;
  validationSchema = ajv.getSchema<addTaskDTO>("new-task");
  if (!validationSchema) {
    ajv.addSchema(taskSchema, "new-task");
    validationSchema = ajv.getSchema<addTaskDTO>("new-task");
  }

  if (validationSchema === undefined) {
    throw new AppError(
      "unpredictable-validation-failure",
      "An internal validation error occured where schemas cant be obtained",
      500,
      false
    );
  }
  const isValid = validationSchema(newTaskRequest);
  if (!isValid) {
    throw new AppError("invalid-task", `Validation failed`, 400, true);
  }
}
