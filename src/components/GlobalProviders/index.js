"use client";
import { RecoilRoot } from "recoil";
import { SessionProvider } from "next-auth/react";
import fetcher, { fetcherWithToken } from "@/utils/fetcher";
import { SWRConfig } from "swr";
import { Suspense } from "react";
import { useLocale } from "next-intl";
const GlobalProviders = ({ children, session }) => {
  const lang = useLocale();
  const [locale, country] = lang.split('-');
  function localStorageProvider() {
    // When initializing, we restore the data from `localStorage` into a map.
    if (typeof window !== "undefined") {
      const map = new Map(JSON.parse(localStorage.getItem("app-cache") || "[]"));

      // Before unloading the app, we write back all the data into `localStorage`.
      window.addEventListener("beforeunload", () => {
        const appCache = JSON.stringify(Array.from(map.entries()));
        localStorage.setItem("app-cache", appCache);
      });

      // We still use the map for write & read for performance.
      return map;
    }
  }



  return (
    <SWRConfig
      value={{
        revalidateOnFocus: true, // Refreshes the data when the window is refocused
        dedupingInterval: 10000, // Prevents re-fetching the same data within 10 seconds
        // revalidateOnFocus: false,
        revalidateOnReconnect: false,
        fetcher: (resource, init) => fetcherWithToken(resource, init, session, country),
        ...(typeof window !== "undefined" && {
          provider: localStorageProvider,
        }),
      }}
    >
      
      <SessionProvider session={session} >
      {/* suspense={true} */}
        {/* <Suspense fallback={<div>Loading session...</div>}> */}
          <RecoilRoot>{children}</RecoilRoot>
        {/* </Suspense> */}
      </SessionProvider>
    </SWRConfig>
  );
};

export default GlobalProviders;
