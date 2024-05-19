import { queryClient } from "@/lib/react-query/queryClient";
import { Children } from "@/types/types";
import { QueryClientProvider } from "@tanstack/react-query";
import { FC } from "react";

const RootProvider: FC<Children> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default RootProvider;
