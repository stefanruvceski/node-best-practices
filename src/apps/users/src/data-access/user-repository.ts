import { getPrismaClient } from "@monorepo/database";
import { addUserDTO } from "../domain/user-schema";

type UserRecord = {
  id: number;
  username: string | null;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  role: string;
  is_active: boolean;
};

export async function getAllUsers(): Promise<UserRecord[]> {
  const results = getPrismaClient().user.findMany();

  return results;
}

export async function addUser(newUser: addUserDTO) {
  const results = getPrismaClient().user.create({
    data: newUser,
  });

  return results;
}

export async function deleteUser(userId: number) {
  const results = getPrismaClient().user.delete({
    where: { id: userId },
  });

  return results;
}

export async function getUserById(userId: number) {
  const results = getPrismaClient().user.findUnique({
    where: { id: userId },
  });

  return results;
}

export async function getUserByEmail(email: string) {
  return await getPrismaClient().user.findUnique({
    where: { email: email },
  });
}
