import { AppError } from "@monorepo/error-handling";
import ajv, { ValidateFunction } from "@monorepo/validation";
import { userSchema, addUserDTO } from "./user-schema";

export function assertNewUserIsValid(newUserRequest: addUserDTO) {
  // Since compiling a validation schema is expensive, we always try to use the cached version first
  let validationSchema!: ValidateFunction<addUserDTO> | undefined;
  validationSchema = ajv.getSchema<addUserDTO>("new-user");
  if (!validationSchema) {
    ajv.addSchema(userSchema, "new-user");
    validationSchema = ajv.getSchema<addUserDTO>("new-user");
  }

  if (validationSchema === undefined) {
    throw new AppError(
      "unpredictable-validation-failure",
      "An internal validation error occured where schemas cant be obtained",
      500,
      false
    );
  }
  const isValid = validationSchema(newUserRequest);
  if (!isValid) {
    throw new AppError("invalid-user", `Validation failed`, 400, true);
  }
}
