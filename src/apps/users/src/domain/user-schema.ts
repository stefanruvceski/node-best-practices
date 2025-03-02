import { Role } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";

export const userSchema = Type.Object({
  username: Type.String(),
  email: Type.String(),
  password: Type.String(),
  role: Type.Union([Type.Literal(Role.ADMIN), Type.Literal(Role.USER)]),
  is_active: Type.Boolean(),
});

export type addUserDTO = Static<typeof userSchema>;
