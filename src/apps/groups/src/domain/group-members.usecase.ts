import * as groupMembersRepository from "../data-access/group-members.repository";
import { assertNewGroupMemberIsValid } from "./group-members.validators";
import { addGroupMemberDTO } from "./group-members.schema";
import * as groupRepository from "../data-access/group.repository";
import { AppError } from "@monorepo/error-handling";
import axios from "axios";
// ️️️✅ Best Practice: Start a flow with a 'use case' function that summarizes the flow in high-level
// It should merely tell the feature story without too much information. Kind of a 'yellow pages' of the module

export async function addGroupMember(newGroupMember: addGroupMemberDTO) {
  assertNewGroupMemberIsValid(newGroupMember);

  //check if group exists
  const group = await groupRepository.getGroupById(newGroupMember.group_id);
  if (!group) {
    throw new AppError("group-not-found", `Group not found`, 404, true);
  }
  let user;
  console.log(newGroupMember.user_id);
  //check if user exists with http to users service
  try {
    user = await axios.get(
      `http://localhost:3000/user/${newGroupMember.user_id}`
    );
    if (!user) {
      throw new AppError("user-not-found", `User not found`, 404, true);
    }
  } catch (error) {
    // console.log(errorcc);
    throw new AppError("user-not-found", `User not found`, 404, true);
  }

  return await groupMembersRepository.addGroupMember(newGroupMember);
}

export async function deleteGroupMember(memberId: number) {
  return await groupMembersRepository.deleteGroupMember(memberId);
}

export async function getGroupMember(memberId: number) {
  return await groupMembersRepository.getGroupMemberById(memberId);
}

export async function getAllGroupMembers() {
  return await groupMembersRepository.getAllGroupMembers();
}
