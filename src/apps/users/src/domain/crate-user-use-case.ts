import { assertNewUserIsValid } from "./user-validators";
import { addUserDTO } from "./user-schema";
import * as userRepository from "../data-access/user-repository";
import { AppError } from "@monorepo/error-handling";
import { logger } from "@monorepo/logger";

// ️️️✅ Best Practice: Start a flow with a 'use case' function that summarizes the flow in high-level
// It should merely tell the feature story without too much information. Kind of a 'yellow pages' of the module
export async function addUser(newUser: addUserDTO) {
  assertNewUserIsValid(newUser);
  const finalOrderToSave = { ...newUser };
  const user = await getUserByEmail(finalOrderToSave.email);
  if (user) {
    logger.error("User already exists");
    throw new AppError("user-already-exists", "User already exists", 400, true);
  }
  return await userRepository.addUser(finalOrderToSave);
}

export async function deleteUser(userId: number) {
  return await userRepository.deleteUser(userId);
}

export async function getUser(userId: number) {
  return await userRepository.getUserById(userId);
}

export async function getUserByEmail(email: string) {
  return await userRepository.getUserByEmail(email);
}

export async function getAllUsers() {
  const response = await userRepository.getAllUsers();
  return response;
}
