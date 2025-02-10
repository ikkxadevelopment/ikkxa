"use client"
import { useSyncExternalStore } from "react";

const subscribe = (callback) => {
  window.addEventListener("resize", callback);
  return window.removeEventListener("resize", callback);
};

const useGetInnerWidth = () => {
  return useSyncExternalStore(
    subscribe,
    () => window.innerWidth,
    () => 0
  );
};

export default useGetInnerWidth;