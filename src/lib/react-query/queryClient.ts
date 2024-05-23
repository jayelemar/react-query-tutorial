import { toast } from "react-hot-toast";

import { QueryCache, QueryClient } from "@tanstack/react-query/build/modern";

const errorHandler = (errorMsg: string) => {
  let isToastActive = true;
  const id = "react-query-toast";
  const customToast = () => {
    if (isToastActive) {
      toast.dismiss(id);
    }
    toast.error(
      `Could not fetch data: ${errorMsg ?? "Unable to establish connection with the server"}`,
      { id },
    );
  };
  customToast();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // for global refetch, for data that will not change very often
      staleTime: 600_000, // 10minutes
      gcTime: 900_000, // 15minutes
      refetchOnWindowFocus: false,
      // if the staletime ellapses..none of the below will trigger a refetch,
      //   refetchOnMount
      //   refetchOnReconnect
      //   refetchOnWindowFocus
      // it will only trigger a refetch when the gcTime ends(the cache is empty)
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      errorHandler(error.message);
    },
  }),
});
