import axiosInstance from "@/lib/axios/axiosInstance";
import { queryKeys } from "@/lib/react-query/queryKey";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface Id {
  id: number;
}

export interface Image {
  fileName: string;
  authorName: string;
  authorLink: string;
  platformName: string;
  platformLink: string;
}

export interface Treatment extends Id {
  name: string;
  durationInMinutes: number;
  image: Image;
  description: string;
}

const getTreatments = async (): Promise<Treatment[]> => {
  const { data } = await axiosInstance.get("/treatments");
  return data;
};

export const useTreatments = (): Treatment[] => {
  const fallback: Treatment[] | [] = [];
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.appointments],
    queryFn: getTreatments,
    staleTime: 600_000, // 10mins
    gcTime: 900_000, // 15mins
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return data;
};

export const usePrefetchTreatments = (): void => {
  const { prefetchQuery } = useQueryClient();
  prefetchQuery({
    queryKey: [queryKeys.treatments],
    queryFn: getTreatments,
  });
};
