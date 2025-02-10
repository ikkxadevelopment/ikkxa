import { clsx } from "clsx"
import { signOut } from "next-auth/react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}


