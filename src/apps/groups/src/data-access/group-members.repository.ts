import { getPrismaClient } from "@monorepo/database";
import { addGroupMemberDTO } from "../domain/group-members.schema";

type GroupMemberRecord = {
  id: number;
  group_id: number;
  user_id: number;
};

export async function getAllGroupMembers(): Promise<GroupMemberRecord[]> {
  return getPrismaClient().groupMember.findMany();
}

export async function addGroupMember(newGroupMember: addGroupMemberDTO) {
  const results = getPrismaClient().groupMember.create({
    data: {
      ...newGroupMember,
    },
  });

  return results;
}

export async function deleteGroupMember(memberId: number) {
  const results = getPrismaClient().groupMember.delete({
    where: { id: memberId },
  });

  return results;
}

export async function getGroupMemberById(memberId: number) {
  const results = getPrismaClient().groupMember.findUnique({
    where: { id: memberId },
  });

  return results;
}
