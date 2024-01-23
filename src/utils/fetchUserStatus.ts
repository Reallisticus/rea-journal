import { api } from "~/utils/api";

export const fetchUserStatus = async () => {
  const userStatusQuery = api.user.getUserStatus.useQuery();
  return userStatusQuery.status;
};
