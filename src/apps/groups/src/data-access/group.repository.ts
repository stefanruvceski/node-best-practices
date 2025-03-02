import { getPrismaClient } from "@monorepo/database";
import { addGroupDTO } from "../domain/group.schema";

type GroupRecord = {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export async function getAllGroups(): Promise<GroupRecord[]> {
  return getPrismaClient().group.findMany();
}

export async function addGroup(newGroup: addGroupDTO) {
  const results = getPrismaClient().group.create({
    data: {
      ...newGroup,
    },
  });

  return results;
}

export async function deleteGroup(groupId: number) {
  const results = getPrismaClient().group.delete({
    where: { id: groupId },
  });

  return results;
}

export async function getGroupById(groupId: number) {
  const results = getPrismaClient().group.findUnique({
    where: { id: groupId },
  });

  return results;
}
