import { inferProcedureOutput, inferProcedureQuery } from "@trpc/react";

export type UserStatus =
  | "UNVERIFIED"
  | "PENDING"
  | "VERIFIED"
  | "FULLY_AUTHENTICATED";

export type JwtCookie = {
  userId: string;
  emailVerified?: boolean;
  fullyAuthenticated: boolean;
};

export type PublicUser = {
  username: string;
  email: string;
  avatarUrl: string;
} | null;

type TRPCError = inferProcedureOutput<AppRouter["_def"]["queries"]>;

type Notification = {
  id: string;
  message?: string;
  type: "success" | "error" | "info";
  error?: Error | TRPCError;
  action?: {
    label: string;
    onClick: () => void;
    children: React.ReactNode;
  };
};

export type GetUserStatusQuery = inferProcedureQuery<
  AppRouter,
  "user.getUserStatus"
>;
export type GetUserStatusRefetch = ReturnType<GetUserStatusQuery["refetch"]>;

export interface RefetchProps {
  refetchUserStatus?: GetUserStatusRefetch;
}

export interface AuthState {
  isAuthenticated: boolean;
  userStatus: UserStatus;
  userDetails: PublicUser;
  isLoginView: boolean;
  isLoading: boolean;
}

export interface UIState {
  notifications: Notification[];
}

export interface BaseProps {
  userStatus: UserStatus;
}
