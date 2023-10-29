import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const beautifyAddress = (addr: string) =>
  `${addr.substr(0, 4)}${addr.substr(-5, 5)}`
