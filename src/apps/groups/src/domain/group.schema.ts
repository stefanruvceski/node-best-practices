import { Static, Type } from "@sinclair/typebox";

export const groupSchema = Type.Object({
  name: Type.String(),
});

export type addGroupDTO = Static<typeof groupSchema>;
