import { Static, Type } from "@sinclair/typebox";

export const groupMemberSchema = Type.Object({
  group_id: Type.Number(),
  user_id: Type.Number(),
});

export type addGroupMemberDTO = Static<typeof groupMemberSchema>;
