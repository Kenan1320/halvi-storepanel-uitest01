"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { store } from "@/store";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
         <Provider store={store}>
      <SidebarProvider>
        {children}
      </SidebarProvider>
      </Provider>
    </ThemeProvider>
  );
}
