"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
  } from "@tanstack/react-query";

  const queryClient = new QueryClient();


const Providers = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
        <SessionProvider>
            {children}
        </SessionProvider>
        </QueryClientProvider>

    );
};

export default Providers;
