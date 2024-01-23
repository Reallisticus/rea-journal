import { inferProcedureOutput, inferProcedureQuery } from "@trpc/react";

export type UserStatus =
  | "VERIFIED"
  | "UNVERIFIED"
  | "FULLY_AUTHENTICATED"
  | null;

export type JwtCookie = {
  userId: string;
  emailVerified?: boolean;
  fullyAuthenticated: boolean;
};

export type GetUserStatusQuery = inferProcedureQuery<
  AppRouter,
  "user.getUserStatus"
>;
export type GetUserStatusRefetch = ReturnType<GetUserStatusQuery["refetch"]>;
