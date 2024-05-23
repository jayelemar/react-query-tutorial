import { useLoginData } from "@/components/auth/AuthContext";
import axiosInstance from "@/lib/axios/axiosInstance";
import { queryKeys } from "@/lib/react-query/queryKey";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export interface Id {
  id: number;
}

export interface NewUser {
  email: string;
  name?: string;
  address?: string;
  phone?: string;
  token?: string;
}

export type User = Id & NewUser;

export function getJWTHeader(userToken: string): Record<string, string> {
  return { Authorization: `Bearer ${userToken}` };
}

import { queryKeys } from "./constants";

export const generateUserKey = (userId: number, userToken: string) => {
  // deliberately exclude the userToken from the dependency array
  //   to keep key consistent for userId regardless of token changes
  return [queryKeys.user, userId];
};

export const generateUserAppointmentsKey = (
  userId: number,
  userToken: string
) => {
  return [queryKeys.appointments, queryKeys.user, userId, userToken];
};


const getUser = async (userId: number, userToken: string) => {
  const {}: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${userId}`,
    {
      headers: getJWTHeader(userToken),
    },
  );
};

export const useUser = () => {
  const { userId, userToken } = useLoginData();

  const { data: user } = useQuery({
    enabled: !!userId
    queryKey: generateUserKey(UserId, userToken),
    queryFn: () => getUser(userId, userToken),
    staletime: Infinity,

  });

  const user: User = null;

  const updateUser = (newUser: User): void => {};
  const clearUser = () => {};
  return { user, updateUser, clearUser };
};
