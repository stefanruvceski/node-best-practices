import { AppError } from "@monorepo/error-handling";
import ajv, { ValidateFunction } from "@monorepo/validation";
import { addGroupMemberDTO } from "./group-members.schema";
import { groupMemberSchema } from "./group-members.schema";

export function assertNewGroupMemberIsValid(
  newGroupMemberRequest: addGroupMemberDTO
) {
  // Since compiling a validation schema is expensive, we always try to use the cached version first
  let validationSchema!: ValidateFunction<addGroupMemberDTO> | undefined;
  validationSchema = ajv.getSchema<addGroupMemberDTO>("new-group-member");
  if (!validationSchema) {
    ajv.addSchema(groupMemberSchema, "new-group-member");
    validationSchema = ajv.getSchema<addGroupMemberDTO>("new-group-member");
  }

  if (validationSchema === undefined) {
    throw new AppError(
      "unpredictable-validation-failure",
      "An internal validation error occurred where schemas can't be obtained",
      500,
      false
    );
  }

  const isValid = validationSchema(newGroupMemberRequest);
  if (!isValid) {
    throw new AppError("invalid-group-member", `Validation failed`, 400, true);
  }
}
