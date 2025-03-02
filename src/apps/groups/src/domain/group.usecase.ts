import * as groupRepository from "../data-access/group.repository";
import { addGroupDTO } from "./group.schema";
import { assertNewGroupIsValid } from "./group.validators";

// ️️️✅ Best Practice: Start a flow with a 'use case' function that summarizes the flow in high-level
// It should merely tell the feature story without too much information. Kind of a 'yellow pages' of the module
export async function addGroup(newGroup: addGroupDTO) {
  assertNewGroupIsValid(newGroup);

  return await groupRepository.addGroup(newGroup);
}

export async function deleteGroup(groupId: number) {
  return await groupRepository.deleteGroup(groupId);
}

export async function getGroup(groupId: number) {
  return await groupRepository.getGroupById(groupId);
}

export async function getAllGroups() {
  const response = await groupRepository.getAllGroups();
  return response;
}
