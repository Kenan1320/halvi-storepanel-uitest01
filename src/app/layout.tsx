import "@/css/satoshi.css";
import "@/css/style.css";
import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { ToastContainer } from "react-toastify";
export const metadata: Metadata = {
  title: {
    template: "%s | MyHalvi - Store Panel",
    default: "MyHalvi - Store Panel",
  },
  description:
    "This is the store panel for myhavli.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />
          <ToastContainer/>
          <main >
            {children}
          </main>
        

        </Providers>
      </body>
    </html>
  );
}
