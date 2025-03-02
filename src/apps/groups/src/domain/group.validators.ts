import { AppError } from "@monorepo/error-handling";
import ajv, { ValidateFunction } from "@monorepo/validation";
import { groupSchema, addGroupDTO } from "./group.schema";

export function assertNewGroupIsValid(newGroupRequest: addGroupDTO) {
  // Since compiling a validation schema is expensive, we always try to use the cached version first
  let validationSchema!: ValidateFunction<addGroupDTO> | undefined;
  validationSchema = ajv.getSchema<addGroupDTO>("new-group");
  if (!validationSchema) {
    ajv.addSchema(groupSchema, "new-group");
    validationSchema = ajv.getSchema<addGroupDTO>("new-group");
  }

  if (validationSchema === undefined) {
    throw new AppError(
      "unpredictable-validation-failure",
      "An internal validation error occurred where schemas can't be obtained",
      500,
      false
    );
  }
  const isValid = validationSchema(newGroupRequest);
  if (!isValid) {
    throw new AppError("invalid-group", `Validation failed`, 400, true);
  }
}
