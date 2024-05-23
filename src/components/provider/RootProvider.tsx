import { Children } from "@/types/shared/types";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query/build/modern";
import { Toaster } from "react-hot-toast";
import { FC } from "react";
import { queryClient } from "@/lib/react-query/queryClient";

const RootProvider: FC<Children> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
      <Toaster />
    </QueryClientProvider>
  );
};

export default RootProvider;
