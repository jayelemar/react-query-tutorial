import axiosInstance from "@/lib/axios/axiosInstance";
import { queryKeys } from "@/lib/react-query/queryKey";
import { useQuery } from "@tanstack/react-query/build/modern";
import { useState } from "react";
interface Staff {}

const getStaffs = async (): Promise<Staff[]> => {
  const { data } = await axiosInstance.get("/staff");
  return data;
};

export const useStaffs = () => {
  const [filter, setFilter] = useState("all");

  const fallback: Staff = [];
  const { data: staff = fallback } = useQuery({
    queryKey: [queryKeys.staff],
    queryFn: getStaffs,
  });

  return { staff, filter, setFilter };
};
